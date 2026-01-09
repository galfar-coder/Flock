"use client";

import { Headphones, Mic, Settings } from "lucide-react";
import SpotifyControls from "./spotify-controls";
import { cn } from "@/lib/utils";

type UserControlsProps = {
    collapsed: boolean;
};

export function UserControls({ collapsed }: UserControlsProps) {
    return (
        <div
            className={cn(
                "flex flex-col bg-background-chat border-app rounded-2xl w-full transition-all duration-300",
                collapsed ? "items-center py-3" : "items-start"
            )}
        >
            {/* Hide Spotify Player when collapsed to prevent layout break */}
            {!collapsed && (
                <div className="slide-in-from-bottom-2 w-full animate-in duration-300 fade-in">
                    <SpotifyControls />
                </div>
            )}

            <div
                className={cn(
                    "flex items-center w-full",
                    collapsed ? "justify-center p-0" : "p-2"
                )}
            >
                <div
                    className={cn(
                        "flex flex-1 items-center gap-2",
                        collapsed && "justify-center"
                    )}
                >
                    {/* Avatar */}
                    <div className="flex justify-center items-center bg-primary-300 rounded-full min-w-8 size-8 font-semibold text-white text-sm">
                        JD
                    </div>

                    {/* User Text Info - Hide when collapsed */}
                    {!collapsed && (
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="font-medium text-sm truncate">
                                John Doe
                            </div>
                            <div className="text-gray-400 text-xs truncate">
                                Online
                            </div>
                        </div>
                    )}
                </div>

                {/* Icons - Hide when collapsed to save space, or stack them if preferred */}
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <Mic className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                        <Headphones className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                        <Settings className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                    </div>
                )}
            </div>
        </div>
    );
}
