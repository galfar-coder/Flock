"use client";

import {InputField} from "@/components/app/input/input";
import {useEffect, useRef, useState} from "react";
import {useParams} from "next/navigation";
import {spacebarFetch} from "@/lib/api-client.ts";
import {MessageType} from "discord-api-types/v9";
import {useWebSocket} from "@/components/websocket/websocket-manager.tsx";
import {useAuth} from "@/components/auth/auth-provider.tsx";
import {SystemMessage} from "@/components/app/messages/system-message.tsx";
import {ChatMessage} from "@/components/app/messages/chat-message.tsx";
import {encodeBase64Safe} from "@/lib/utils/base64.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {FlockFactory} from "@/lib/flock-factory.ts";
import {API} from "@spacebarchat/spacebar-ts";
import {enhanceMessage, FlockChannel, FlockMessage} from "@/lib/models.ts";

const getTabId = () => {
    if (typeof window === "undefined") return "";

    let id = sessionStorage.getItem("chat_tab_id");
    if (!id) {
        id = `tab-${crypto.randomUUID()}`;
        sessionStorage.setItem("chat_tab_id", id);
    }
    return id;
};

export default function ChannelPage() {
    const params = useParams();
    const serverId = decodeURIComponent(params.serverId as string);
    const channelId = params.channelId as string;
    const [messages, setMessages] = useState<FlockMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [rateLimitError, setRateLimitError] = useState<string>("");
    const [isRateLimited, setIsRateLimited] = useState(false);

    const [roles, setRoles] = useState<API.Role[]>([]);
    const [serverChannels, setServerChannels] = useState<FlockChannel[]>([]);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { lastMessage, guildMembers, messageUpdate, messageDelete } = useWebSocket();
    const { user } = useAuth();

    useEffect(() => {
        if (!loading) {
            chatContainerRef.current?.scrollTo({
                top: chatContainerRef.current?.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, loading]);

    useEffect(() => {
        if (serverId && serverId !== "@me") {
            spacebarFetch(`guilds/${serverId}/roles`).then(setRoles);
            spacebarFetch(`guilds/${serverId}/channels`).then(setServerChannels);
        }
    }, []);

    useEffect(() => {
        if (serverId && channelId && serverId !== "@me") {
            localStorage.setItem(`last_channel_${serverId}`, channelId)
        }
    }, [serverId, channelId]);

    useEffect(() => {
        async function loadMessages() {
            setLoading(true);
            try {
                const data = await spacebarFetch(`channels/${channelId}/messages`);
                const rData = data.reverse();
                const convertedMessages: FlockMessage[] = rData.map((m: API.Message) =>
                   enhanceMessage(m, serverId, guildMembers[serverId], roles)
                );

                setMessages(convertedMessages);
            } catch (err) {
                console.error("Failed to load messages", err);
            } finally {
                setLoading(false);
            }
        }

        if (channelId) loadMessages();
    }, [channelId]);

    useEffect(() => {
        if (lastMessage && lastMessage.channel_id === channelId) {
            setMessages((prev) => {
                if (prev.some((msg) => msg.id === lastMessage.id)) {
                    return prev;
                }

                if (lastMessage.nonce) {
                    const fakeIndex = prev.findIndex(msg => msg.nonce === lastMessage.nonce);
                    if (fakeIndex !== -1) {
                        const newArray = [...prev];
                        newArray[fakeIndex] = lastMessage;
                        return newArray;
                    }
                }

                return [...prev, lastMessage];
            })
        }
    }, [lastMessage, channelId]);

    useEffect(() => {
        if (messageUpdate && messageUpdate.channel_id === channelId) {
            setMessages((prev) =>
                prev.map((msg) => {
                    if (msg.id === messageUpdate.id) {
                        return { ...msg, ...messageUpdate } as FlockMessage;
                    }
                    return msg;
                })
            );
        }
    }, [messageUpdate, channelId]);

    useEffect(() => {
        if (messageDelete && messageDelete.channel_id === channelId) {
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== messageDelete.id)
            );
        }
    }, [messageDelete, channelId]);

    const handleSendMessage = async (content: string) => {
        if (!user) return;

        const nonce = `Flock|0.0.71dev|${new Date().toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })}`;

        const nonce64 = encodeBase64Safe(nonce);

        const optimisticMessageAPI = {
            id: `temp-${nonce}`,
            guild: serverId,
            channel: channelId,
            channel_id: channelId,
            content: content,
            author: user,
            timestamp: new Date().toISOString(),
            nonce: nonce64,
            type: MessageType.Default
        } as unknown as API.Message;

        const optimisticMessage = enhanceMessage(
            optimisticMessageAPI,
            serverId,
            guildMembers[serverId],
            roles
        )

        setMessages(prev => [...prev, optimisticMessage]);

        try {
            await spacebarFetch(`channels/${channelId}/messages`, {
                method: "POST",
                body: JSON.stringify({
                    content: content,
                    nonce: nonce64,
                })
            });
            // console.log(Buffer.from(nonce64, "base64").toString("utf-8"));
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };



    // Check if message should show header (avatar, name, timestamp)
    const shouldShowHeader = (index: number) => {
        if (index === 0) return true;

        const currentMsg = messages[index];
        const prevMsg = messages[index - 1];

        // Different author = new group
        if (currentMsg.author?.id !== prevMsg.author?.id) return true;

        const currentTime = new Date(currentMsg.dateTimestamp).getTime();
        const prevTime = new Date(prevMsg.dateTimestamp).getTime();

        // If the previous message was a system message, force a header for the new normal message
        if (prevMsg.type !== MessageType.Default && prevMsg.type !== MessageType.Reply) return true;
        if (currentMsg.type === MessageType.Reply) return true;

        // Same author but > 5 minutes apart = new group
        const timeDiff = Number(currentTime) - Number(prevTime);
        if (timeDiff > 5 * 60 * 1000) return true; // 5 minutes in milliseconds

        return false;
    };

    return (
        <div className="flex flex-col bg-background-chat border-app rounded-2xl w-full h-full overflow-hidden">
            <div ref={chatContainerRef} className="flex-1 p-4 min-h-0 overflow-y-auto">
                { loading ? (
                    // --- SKELETON LOADER ---
                    <div className="flex flex-col gap-6 justify-end h-full">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex gap-3 px-2">
                                <Skeleton className="size-10 rounded-full shrink-0 bg-white/5" />
                                <div className="flex flex-col gap-2 w-full mt-1">
                                    <div className="flex items-center gap-2">
                                        {/* Name & Timestamp Skeletons */}
                                        <Skeleton className="h-4 w-32 bg-white/5" />
                                        <Skeleton className="h-3 w-16 bg-white/5" />
                                    </div>
                                    {/* Message Text Skeletons */}
                                    <Skeleton className="h-4 w-[60%] bg-white/5" />
                                    {i % 2 === 0 && <Skeleton className="h-4 w-[40%] bg-white/5" />}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>
                            No messages yet. Start typing to see messages appear!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {messages.map((msg, index) => {
                            // Display System Message
                            if (msg.type !== MessageType.Default && msg.type !== MessageType.Reply) {
                                return <SystemMessage key={msg.id} message={msg} />
                            }

                            // Normal chat message stuff
                            const showHeader = shouldShowHeader(index);

                            // Find the reply context if it exists
                            const replyToMsgId = msg!.message_reference?.message_id;
                            const replyToMsg = replyToMsgId
                                ? messages.find(m => m.id === replyToMsgId)
                                : null;

                            return (
                                <ChatMessage
                                    key={msg.id}
                                    message={msg}
                                    serverId={serverId}
                                    serverMembers={guildMembers[serverId]}
                                    serverRoles={roles}
                                    serverChannels={serverChannels}
                                    showHeader={showHeader}
                                    replyToMessage={replyToMsg}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="relative flex-shrink-0 w-full">
                <div className="-top-6 right-0 left-0 z-10 absolute bg-gradient-to-t from-background-chat to-transparent w-full h-6"></div>
                {/* Only show error when it exists */}
                {rateLimitError && (
                    <div className="slide-in-from-bottom-2 z-20 bg-destructive p-1 rounded-t-2xl w-full text-foreground text-sm text-center animate-in duration-200 fade-in">
                        {rateLimitError}
                    </div>
                )}
                <InputField disabled={isRateLimited || loading} onSend={handleSendMessage} />
            </div>
        </div>
    );
}
