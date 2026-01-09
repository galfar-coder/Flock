"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { UserControls } from "./user-controls";
import { VoiceChannel } from "./channels/voice-channel";
import { TextChannel } from "./channels/text-channel";
import { cn } from "@/lib/utils"; // Uses shadcn's default utility
import { Separator } from "@/components/ui/separator";

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const channels = [
        { id: 1, name: "general", unread: 5 },
        { id: 2, name: "random", unread: 3 },
        { id: 3, name: "announcements", unread: 0 },
        { id: 4, name: "support", unread: 1 },
    ];

    return (
        <div
            // Transition width and allow flex-shrink to work in layout
            className={cn(
                "hidden md:flex flex-col gap-3 h-full transition-[width] duration-300 ease-in-out",
                isCollapsed ? "w-[80px]" : "w-72"
            )}
        >
            <div className="flex flex-col bg-background-chat border-app rounded-2xl h-full overflow-hidden text-gray-100">
                {/* Server/Workspace Header */}
                <div
                    className={cn(
                        "flex items-center px-4 border-subtle/20 border-b h-12 transition-all",
                        isCollapsed ? "justify-center" : "justify-between"
                    )}
                >
                    {!isCollapsed && (
                        <span className="overflow-hidden font-semibold text-sm text-ellipsis whitespace-nowrap">
                            My Server
                        </span>
                    )}

                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="size-5" />
                        ) : (
                            <PanelLeftClose className="size-4" />
                        )}
                    </button>
                </div>

                {/* Channel List */}
                <div className="flex-1 py-3 overflow-x-hidden overflow-y-auto">
                    <div className="mb-4">
                        {/* Section Label - Hide when collapsed */}
                        <div
                            className={cn(
                                "mb-1 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide transition-opacity",
                                isCollapsed ? "hidden" : "block"
                            )}
                        >
                            Text Channels
                        </div>

                        <div className="flex flex-col gap-1 px-2">
                            {channels.map((channel) => (
                                <TextChannel
                                    key={channel.id}
                                    channel={{
                                        serverId: 1,
                                        channelId: channel.id,
                                        name: channel.name,
                                        unread: channel.unread,
                                    }}
                                    collapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    </div>

                    <Separator className="my-2 border-subtle/20" />

                    <div className="px-2">
                        <VoiceChannel collapsed={isCollapsed} />
                    </div>
                </div>
            </div>

            {/* User Section */}
            <UserControls collapsed={isCollapsed} />
        </div>
    );
}
