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
import {
    enhanceMessage,
    enhanceUser,
    FlockMember,
    FlockMessage,
    FlockPresence,
    FlockUser
} from "@/lib/models.ts";
import {spacebarFetch} from "@/lib/api-client.ts";
import {read} from "fs";
import {number} from "zod";
import {GatewayReadState, GatewayReadStateChannel, GatewayReadStateGuild, GatewayReady} from "@/lib/GatewayTypes.ts";

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
    isChannelUnread: (channelId: string) => boolean;
    isServerUnread: (serverId: string) => boolean;
    markAsRead: (channelId: string, messageId: string) => void;
    getMentionCount: (channelId: string) => number;
}>({
    requestMembers: () => {},
    guildMembers: {},
    isReady: false,
    lastMessage: null,
    messageUpdate: null,
    messageDelete: null,
    isChannelUnread: () => false,
    isServerUnread: () => false,
    markAsRead: () => {},
    getMentionCount: () => 0,
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

    const [readStates, setReadStates] = useState<Record<string, string>>({});
    const [latestMessages, setLatestMessages] = useState<Record<string, string>>({});
    const [channelToServer, setChannelToServer] = useState<Record<string, string>>({});

    const [mentionCounts, setMentionCounts] = useState<Record<string, number>>({});

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

                        console.log(d);
                        const data = d as GatewayReady;

                        // Parsing read states
                        const rs: Record<string, string> = {};
                        const mc: Record<string, number> = {};
                        data.read_state?.entries?.forEach((r) => {
                            if (r.last_message_id) rs[r.id] = r.last_message_id;

                            if (r.mention_count > 0) mc[r.id] = r.mention_count;
                        });
                        setReadStates(rs);
                        setMentionCounts(mc);

                        const lm: Record<string, string> = {};
                        const c2s: Record<string, string> = {};

                        data.guilds?.forEach((g) => {
                            g.channels?.forEach((c) => {
                                if (c.last_message_id) {
                                    lm[c.id] = c.last_message_id;
                                }
                                c2s[c.id] = g.id;
                            })
                        });
                        setLatestMessages(lm);
                        setChannelToServer(c2s);

                        setReady(true);
                    }

                    if (t === MessageType.MESSAGE_CREATE) {
                        console.log("📩 New Message Received:", d.content, d);
                        //console.log(d)
                        setLastMessage(enhanceMessage(d, d.guild_id));

                        setLatestMessages(prev => ({...prev, [d.channel_id]: d.id}));
                        if (d.guild_id) {
                            setChannelToServer(prev => ({...prev, [d.channel_id]: d.guild_id}));
                        }

                        setMentionCounts(prev => ({...prev, [d.channel_id]: d.mention_count}));
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

    const isChannelUnread = useCallback((channelId: string) => {
        const latest = latestMessages[channelId];
        const read = readStates[channelId];
        if (!latest) return false;
        return latest !== read;
    }, [latestMessages, readStates]);

    const isServerUnread = useCallback((serverId: string) => {
        const channels = Object.keys(channelToServer).filter(c => channelToServer[c] === serverId);
        return channels.some(c => isChannelUnread(c));
    }, [channelToServer, isChannelUnread]);

    const markAsRead = useCallback((channelId: string, messageId: string) => {
        if (readStates[channelId] === messageId) return;

        setReadStates(prev => ({...prev, [channelId]: messageId}));

        spacebarFetch(`channels/${channelId}/messages/${messageId}/ack`, {
            method: "POST",
            body: JSON.stringify({ token: token }),
        }).catch(err => console.error("Failed to ack message", err));
    }, [readStates, token]);

    const getMentionCount = useCallback((channelId: string) => {
        return mentionCounts[channelId] || 0;
    }, [mentionCounts]);

    return (
        <WebSocketContext.Provider value={{
            requestMembers, guildMembers, isReady, lastMessage, messageUpdate, messageDelete, isChannelUnread,
            isServerUnread, markAsRead, getMentionCount
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => useContext(WebSocketContext);