"use client";

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

            // Generate timestamp
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

    if (loading) {
        return null;
    }

    return (
        <div className="flex-1 bg-accent m-3 p-4 rounded-2xl overflow-y-auto snap-end">
            {messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                    <p>No messages yet. Start typing to see messages appear!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className="flex gap-3 hover:bg-primary-100 px-2 py-1.5 rounded-lg transition-colors"
                        >
                            <div className="flex flex-shrink-0 justify-center items-center bg-gradient-to-br from-primary-100 to-background-300 rounded-full w-10 h-10 font-semibold text-white">
                                {msg.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">
                                        {msg.author}
                                    </span>
                                    <span className="text-xs">{msg.time}</span>
                                </div>
                                <p className="text-sm break-words leading-relaxed">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
        </div>
    );
}
