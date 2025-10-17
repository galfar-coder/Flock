"use client";

import { InputField } from "@/components/app/input/input";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:6942");

export default function ChannelPage() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<
        {
            id: number;
            author: string;
            avatar: string;
            time: string;
            content: string;
        }[]
    >([]);
    const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(
        null
    );

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageTimestamps = useRef<number[]>([]);
    const MAX_MESSAGES = 3;
    const MAX_TOTAL_MESSAGES = 50;

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        const handleMessage = (data: string) => {
            const now = Date.now();
            messageTimestamps.current = messageTimestamps.current.filter(
                (timestamp) => now - timestamp < 1000
            );

            if (messageTimestamps.current.length >= MAX_MESSAGES) {
                console.warn("Message rate limit exceeded, ignoring message");
                return;
            }

            messageTimestamps.current.push(now);

            const timeStr = new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });

            setMessages((prevMessages) => {
                const newMessages = [
                    ...prevMessages,
                    {
                        id: prevMessages.length + 1,
                        author: "anonymous",
                        avatar: "A",
                        time: timeStr,
                        content: data,
                    },
                ];

                if (newMessages.length > MAX_TOTAL_MESSAGES) {
                    return newMessages.slice(-MAX_TOTAL_MESSAGES);
                }

                return newMessages;
            });
        };

        socket.on("message", handleMessage);

        return () => {
            clearTimeout(timer);
            socket.off("message", handleMessage);
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Check if message should show header (avatar, name, timestamp)
    const shouldShowHeader = (index: number) => {
        if (index === 0) return true;
        return messages[index].author !== messages[index - 1].author;
    };

    if (loading) {
        return null;
    }

    return (
        <div className="flex flex-col bg-background-chat border-app rounded-2xl w-full h-full overflow-hidden">
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
                            return (
                                <div
                                    key={msg.id}
                                    className={`group flex gap-3 hover:bg-primary-100/10 px-2 rounded-lg transition-colors ${
                                        showHeader ? "mt-4 py-1.5" : "py-0.5"
                                    }`}
                                    onMouseEnter={() =>
                                        setHoveredMessageId(msg.id)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredMessageId(null)
                                    }
                                >
                                    {/* Avatar - show only for first message in group */}
                                    {showHeader ? (
                                        <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-primary-100 to-background-300 rounded-full w-10 h-10 font-semibold text-white">
                                            {msg.avatar}
                                        </div>
                                    ) : (
                                        <div className="flex flex-shrink-0 justify-center items-center w-10">
                                            {/* Timestamp shows on hover for grouped messages */}
                                            <span
                                                className={`text-xs text-gray-400 transition-opacity ${
                                                    hoveredMessageId === msg.id
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                            >
                                                {msg.time}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        {/* Header - show only for first message in group */}
                                        {showHeader && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold">
                                                    {msg.author}
                                                </span>
                                                <span className="text-gray-400 text-xs">
                                                    {msg.time}
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-sm break-words leading-relaxed">
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
            <div className="flex-shrink-0 pb-2 w-full">
                <InputField />
            </div>
        </div>
    );
}
