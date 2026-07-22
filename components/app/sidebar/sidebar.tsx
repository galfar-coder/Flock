"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserControls } from "./user-controls";

// Import your two new content components
import { GuildSidebarContent } from "./guild-sidebar";
import { DMSidebarContent } from "./dm-sidebar";

export function Sidebar() {
    const params = useParams();
    const serverId = decodeURIComponent(params.serverId as string);
    const currentChannelId = params.channelId as string;

    const [isCollapsed, setIsCollapsed] = useState(false);

    // We lift the header name state up here so the sub-components can change it!
    const [headerName, setHeaderName] = useState("Loading...");

    return (
        <div className={cn(
            "hidden md:flex flex-col gap-3 h-full transition-[width] duration-300 ease-in-out",
            isCollapsed ? "w-[80px]" : "w-72"
        )}>
            <div className="flex flex-col bg-background-chat border-app rounded-2xl h-full overflow-hidden text-gray-100">

                {/* 1. The Dynamic Header */}
                <div className={cn(
                    "flex items-center px-4 border-subtle/20 border-b h-12 transition-all",
                    isCollapsed ? "justify-center" : "justify-between"
                )}>
                    {!isCollapsed && (
                        <span className="overflow-hidden font-semibold text-sm text-ellipsis whitespace-nowrap">
                            {headerName}
                        </span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                    >
                        {isCollapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-4" />}
                    </button>
                </div>

                {/* 2. The Dynamic Content Router */}
                <div className="flex-1 py-3 overflow-x-hidden overflow-y-auto custom-scrollbar">
                    {serverId === "@me" ? (
                        <DMSidebarContent
                            currentChannelId={currentChannelId}
                            collapsed={isCollapsed}
                            setHeaderName={setHeaderName}
                        />
                    ) : (
                        <GuildSidebarContent
                            serverId={serverId}
                            currentChannelId={currentChannelId}
                            collapsed={isCollapsed}
                            setHeaderName={setHeaderName}
                        />
                    )}
                </div>
            </div>

            {/* 3. The Footer */}
            <UserControls collapsed={isCollapsed} />
        </div>
    );
}