"use client";

import { useAuth } from "@/components/auth/auth-provider";
import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {GATEWAY_URL} from "@/lib/constants.ts";
import {
    IExtendedMember,
    IGuildMemberListUpdate,
    IMemberListItem,
    IMemberListOp
} from "@/types/CustomInterfaces.ts";
import {MessageType} from "@/types/WebSocketTypes.ts";
import {clearTimeout} from "node:timers";
import {API} from "@spacebarchat/spacebar-ts";
import {enhanceMessage, enhanceUser, FlockMember, FlockMessage, FlockPresence, FlockUser} from "@/lib/models.ts";

const GUILDS = 1 << 0;
const GUILD_MEMBERS = 1 << 1;
const GUILD_MESSAGES = 1 << 9;
const ALL_INTENTS = GUILDS | GUILD_MEMBERS | GUILD_MESSAGES;

const WebSocketContext = createContext<{
    requestMembers : (guildId: string, channelId: string) => void;
    guildMembers : Record<string, FlockMember[]>;
    isReady: boolean;
    lastMessage: FlockMessage | null;
    messageUpdate: Partial<FlockMessage> | null;
    messageDelete: {
        id: string;
        channel_id: string;
    } | null;
}>({
    requestMembers: () => {},
    guildMembers: {},
    isReady: false,
    lastMessage: null,
    messageUpdate: null,
    messageDelete: null,
});

export function WebSocketManagerProvider({ children }: { children: React.ReactNode }) {
    const {token} = useAuth();
    const socketRef = useRef<WebSocket | null>(null);
    const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [isReady, setReady] = useState(false);
    const [lastMessage, setLastMessage] = useState<FlockMessage | null>(null);
    const [messageUpdate, setMessageUpdate] = useState<Partial<FlockMessage> | null>(null);
    const [messageDelete, setMessageDelete] = useState<{ id: string; channel_id: string; } | null>(null);

    const [guildMembers, setGuildMembers] = useState<Record<string, FlockMember[]>>({});
    const guildMemberChunkNonceRef = useRef<string>("");
    const guildMembersChunkCountRef = useRef<number>(0);
    const guildMembersReceivedChunkCountRef = useRef<number>(0);

    const requestMembers = useCallback((guildId: string, channelId: string)=> {
        const socket = socketRef.current;
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log(`🚀 Requesting members for Guild: ${guildId} | Channel: ${channelId}`);
            socket.send(JSON.stringify({
                op: 14,
                d: {
                    guild_id: guildId,
                    typing: true,
                    activities: true,
                    threads: true,
                    channels: {
                        [channelId]: [[0, 99]]
                    }
                }
            }));
            /*const membersNonce = encodeBase64Safe(`Flock-GuildMembers|${guildId}`);
            guildMemberChunkNonceRef.current = membersNonce;
            guildMembersChunkCountRef.current = 0;
            guildMembersReceivedChunkCountRef.current = 0;
            socket.send(JSON.stringify({
                op: 8,
                d: {
                    guild_id: guildId,
                    query: "",
                    limit: 0,
                    presences: true,
                    nonce: membersNonce
                }
            }))*/
        }
    }, [])

    useEffect(() => {
        if (!token) return;

        let isActive = true;

        console.log("Connecting to Spacebar Gateway with token...");
        const connect = () => {
            const socket = new WebSocket(GATEWAY_URL);
            socketRef.current = socket;
            if (reconnectTimeoutRef.current) clearInterval(reconnectTimeoutRef.current);

            socket.onopen = () => {
                if (!isActive) {
                    return socket.close();
                }
                console.log("✅ WebSocket Connected!");
                socket.send(JSON.stringify({
                    op: 2,
                    d: {
                        token: token,
                        capabilities: 125,
                        properties: {os: "linux", browser: "Flock", device: "Flock"},
                        presence: {status: "online", since: 0, activities: [], afk: false},
                    }
                }));
            };

            socket.onmessage = (event) => {
                if (!isActive) return;

                const payload = JSON.parse(event.data);
                const {op, t, d} = payload;

                // Gateway HELLO (Sent by server onconnect)
                if (op === 10) {
                    console.log("👾 Gateway says Hello! Setting up heartbeats...");
                    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);

                    heartbeatIntervalRef.current = setInterval(() => {
                        socket.send(JSON.stringify({op: 1, d: null}));
                        console.log("💓 Heartbeat sent");
                    }, d.heartbeat_interval);
                }

                // DISPATCH (READY, MESSAGE_CREATE, etc.)
                if (op === 0) {
                    if (t === MessageType.READY) {
                        console.log("🚀 AUTH SUCCESS! Ready as:", d.user.username);
                        setReady(true);
                    }

                    if (t === MessageType.MESSAGE_CREATE) {
                        console.log("📩 New Message Received:", d.content, d);
                        //console.log(d)
                        setLastMessage(enhanceMessage(d, d.guild_id));
                    }

                    if (t === MessageType.MESSAGE_UPDATE) {
                        console.log("Message Update:", d);
                        setMessageUpdate(d);
                    }

                    if (t === MessageType.MESSAGE_DELETE) {
                        setMessageDelete(d);
                    }

                    if (t === MessageType.GUILD_MEMBER_LIST_UPDATE) {
                        console.log(d);
                        const data = d as IGuildMemberListUpdate;

                        const syncOp = data.ops.find((operation): operation is IMemberListOp =>
                            operation.op === "SYNC"
                        );

                        if (syncOp) {
                            console.log(`📦 Member list synced for guild: ${data.guild_id}`);

                            const members: FlockMember[] = syncOp.items
                                .filter((item): item is { member: IExtendedMember } => !!item.member)
                                .map((item) => enhanceUser({
                                    user: item.member.user,
                                    memberContext: item.member,
                                    serverId: data.guild_id,
                                    presence: item.member.presence
                                }) as FlockMember);

                            console.log("Got this member list:", members);

                            setGuildMembers((prev) => ({
                                ...prev,
                                [data.guild_id]: members
                            }));
                        }
                    }

                    if (t === MessageType.GUILD_MEMBERS_CHUNK) {
                        const nonce = d.nonce as string;
                        if (!nonce || nonce !== guildMemberChunkNonceRef.current) return;

                        console.log("✅ Received valid chunk:", d.chunk_index + 1, "/", d.chunk_count);
                        console.log(d);

                        const presences = d.presences as FlockPresence[];

                        const members: FlockUser[] = (d.members as API.Member[]).map(m => {
                            return enhanceUser({
                                user: m.user,
                                memberContext: m,
                                serverId: d.guild_id,
                                presence: presences.find(p => p.user?.id === m.user.id)
                            })
                        });

                        console.log("Members after stuff:", members);


                        guildMembersChunkCountRef.current = d.chunk_count as number;
                        guildMembersReceivedChunkCountRef.current += 1;

                        setGuildMembers(prev => ({
                            ...prev,
                            [d.guild_id]: [...(prev[d.guild_id] || []), ...members]
                        }))
                    }
                }
            }

            socket.onerror = (err) => console.log("WebSocket Error: ", err);

            socket.onclose = (e) => {
                if (!isActive) return;
                if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
                setReady(false);

                if (isActive) {
                    console.warn(`❌ WebSocket Closed (Code: ${e.code}). Reconnecting...`);
                    reconnectTimeoutRef.current = setInterval(connect, 3000);
                }
            }
        }

        connect();

        return () => {
            isActive = false;
            socketRef.current?.close();
            if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        }
    }, [token]);

    return (
        <WebSocketContext.Provider value={{ requestMembers, guildMembers, isReady, lastMessage, messageUpdate, messageDelete }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => useContext(WebSocketContext);