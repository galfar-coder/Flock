"use client";

import { useState, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

// Mock data generator

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
    const mockMessages = useMemo(() => {
        return [
            {
                id: 1,
                author: "Sarah Chen",
                avatar: "SC",
                time: "9:45 AM",
                content:
                    "Good morning team! Just a reminder that we have our sprint review at 2 PM today.",
            },
            {
                id: 2,
                author: "Mike Rodriguez",
                avatar: "MR",
                time: "9:47 AM",
                content:
                    "Thanks for the reminder! I'll have the dashboard demo ready.",
            },
            {
                id: 3,
                author: "Emily Watson",
                avatar: "EW",
                time: "9:50 AM",
                content:
                    "I just deployed the new authentication flow to staging. Would love to get some feedback before we merge.",
            },
            {
                id: 4,
                author: "David Kim",
                avatar: "DK",
                time: "9:52 AM",
                content:
                    "I can test it right now. Do we have any specific test cases we should focus on?",
            },
            {
                id: 5,
                author: "Emily Watson",
                avatar: "EW",
                time: "9:53 AM",
                content:
                    "Yeah! Mainly focus on the password reset flow and social login. Those were the trickiest parts.",
            },
            {
                id: 6,
                author: "Sarah Chen",
                avatar: "SC",
                time: "10:05 AM",
                content:
                    "Great work everyone! The progress this week has been amazing. 🚀",
            },
            {
                id: 7,
                author: "Alex Thompson",
                avatar: "AT",
                time: "10:12 AM",
                content:
                    "Quick question - has anyone looked into that performance issue on the search feature?",
            },
            {
                id: 8,
                author: "Mike Rodriguez",
                avatar: "MR",
                time: "10:15 AM",
                content:
                    "I'm working on it now. Found the bottleneck - it was an N+1 query issue. Should have a fix by end of day.",
            },
            {
                id: 9,
                author: "Alex Thompson",
                avatar: "AT",
                time: "10:16 AM",
                content:
                    "Perfect! Let me know if you need any help with testing.",
            },
            {
                id: 10,
                author: "David Kim",
                avatar: "DK",
                time: "10:30 AM",
                content:
                    "Auth flow looks solid! Just tested password reset and Google login - both working flawlessly. Nice work Emily! ✨",
            },
        ];
    }, []);

    socket.on("message", (data) => {
        console.log(data);
        messages.push({
            id: messages.length + 1,
            author: "anonymous",
            avatar: "A",
            time: "now",
            content: data,
        });
        setMessages(messages);
    });

    // Simulate loading messages
    useEffect(() => {
        const timer = setTimeout(() => {
            setMessages(mockMessages);
            setLoading(false);
        }, 1500); // 1.5 second delay to show skeleton

        return () => clearTimeout(timer);
    }, [mockMessages]);

    if (loading) {
        return null; // Skeleton will show from Suspense in layout
    }

    return (
        <div className="flex-1 bg-accent m-3 mr-0 p-4 rounded-2xl overflow-y-auto">
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
            </div>
        </div>
    );
}
