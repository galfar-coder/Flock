"use client";

import { InputField } from "@/components/app/input/input";
import { useState, useEffect, useRef } from "react";
import { IMessage } from "@/server/interfaces";
import { usePathname } from "next/navigation";
import { TabManager } from "@/components/websocket/tab-manager";

export default function ChannelPage() {
    const pathname = usePathname();
    const serverId = pathname.split("/")[2];
    const channelId = pathname.split("/")[3];
    const userId = "1761";

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(
        null
    );
    const [rateLimitError, setRateLimitError] = useState<string>("");
    const [isRateLimited, setIsRateLimited] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageTimestamps = useRef<number[]>([]);
    const rateLimitTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Configurable rate limit settings
    const MAX_MESSAGES = 10;
    const TIME_WINDOW_MS = 5000; // 1 second (change to 60000 for 1 minute, 30000 for 30 seconds, etc.)

    const handleMessage = (data: IMessage) => {
        const now = Date.now();

        // Remove timestamps older than the time window
        messageTimestamps.current = messageTimestamps.current.filter(
            (timestamp) => now - timestamp < TIME_WINDOW_MS
        );

        if (
            messageTimestamps.current.length >= MAX_MESSAGES &&
            data.author.id === userId
        ) {
            // Format time window for display
            const timeText =
                TIME_WINDOW_MS >= 1000
                    ? `${TIME_WINDOW_MS / 1000} second${
                          TIME_WINDOW_MS > 1000 ? "s" : ""
                      }`
                    : `${TIME_WINDOW_MS}ms`;

            setRateLimitError(
                `You can only send ${MAX_MESSAGES} messages per ${timeText}`
            );
            setIsRateLimited(true);

            // Clear any existing timer
            if (rateLimitTimerRef.current) {
                clearTimeout(rateLimitTimerRef.current);
            }

            // Auto-hide error and re-enable input after the time window
            rateLimitTimerRef.current = setTimeout(() => {
                setRateLimitError("");
                setIsRateLimited(false);
            }, TIME_WINDOW_MS);

            return;
        }

        messageTimestamps.current.push(now);
        setMessages((prev) => [...prev, data]);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            clearTimeout(timer);
            if (rateLimitTimerRef.current) {
                clearTimeout(rateLimitTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Check if message should show header (avatar, name, timestamp)
    const shouldShowHeader = (index: number) => {
        if (index === 0) return true;

        const currentMsg = messages[index];
        const prevMsg = messages[index - 1];

        // Different author = new group
        if (currentMsg.author.id !== prevMsg.author.id) return true;

        // Same author but > 5 minutes apart = new group
        const timeDiff = currentMsg.timestamp - prevMsg.timestamp;
        if (timeDiff > 5 * 60 * 1000) return true; // 5 minutes in milliseconds

        return false;
    };

    if (loading) {
        return null;
    }

    return (
        <div className="flex flex-col bg-background-chat border-app rounded-2xl w-full h-full overflow-hidden">
            <TabManager
                serverId={serverId}
                channelId={channelId}
                userId={userId}
                onMessage={handleMessage}
            />
            <div className="flex-1 p-4 min-h-0 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        <p>
                            No messages yet. Start typing to see messages
                            appear!
                        </p>
                    </div>
                ) : (
                    <div className="space-y-0.5">
                        {messages.map((msg, index) => {
                            const showHeader = shouldShowHeader(index);

                            // Format timestamp
                            const timeStr = new Date(
                                msg.timestamp
                            ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            });

                            // Get initials from username
                            const initials =
                                msg.author.username
                                    .split("-")[1]
                                    ?.substring(0, 2)
                                    .toUpperCase() || "U";

                            return (
                                <div
                                    key={msg.messageId}
                                    className={`group flex gap-3 hover:bg-primary-100/10 px-2 rounded-lg transition-colors ${
                                        showHeader ? "mt-4 py-1.5" : "py-0.5"
                                    }`}
                                    onMouseEnter={() =>
                                        setHoveredMessageId(msg.messageId)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredMessageId(null)
                                    }
                                >
                                    {/* Avatar - show only for first message in group */}
                                    {showHeader ? (
                                        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-primary-100 to-background-300 mr-2 rounded-full w-10 h-10 font-semibold text-white">
                                            {initials}
                                        </div>
                                    ) : (
                                        <div className="flex flex-shrink-0 justify-center items-center w-12">
                                            {/* Timestamp shows on hover for grouped messages */}
                                            <span
                                                className={`text-xs text-gray-400 transition-opacity ${
                                                    hoveredMessageId ===
                                                    msg.messageId
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                            >
                                                {timeStr}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        {/* Header - show only for first message in group */}
                                        {showHeader && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">
                                                    {msg.author.username}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    {timeStr}
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-md text-muted-foreground break-words tracking-wide">
                                            {msg.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
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
                <InputField disabled={isRateLimited} />
            </div>
        </div>
    );
}
