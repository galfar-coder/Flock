import {Hash, MessageSquareText} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {ExtendedChannel} from "@/types/CustomInterfaces.ts";

export interface ForumChannelProps {
    channel: ExtendedChannel;
    active: boolean;
    collapsed?: boolean;
    serverId: string;
    channelId: string;
}

export function ForumChannel({ channel, collapsed, active, serverId, channelId }: ForumChannelProps) {
    return (
        <Link
            key={channel.channel.name}
            href={`/channels/${serverId}/${channelId}`}
            title={channel.channel.name}
        >
            <div
                className={cn(
                    "group flex items-center hover:bg-background-app mb-0.5 py-1.5 rounded-xl transition-all duration-300 ease-fluid cursor-pointer",
                    // 2. Adjust layout: Center icon if collapsed, otherwise space-between with hover effect
                    collapsed
                        ? "justify-center px-0 w-full"
                        : "justify-between px-2 hover:translate-x-1.5",
                    active
                        ? "bg-blue-500/50 hover:bg-blue-700/50 transition-all"
                        : ""
                )}
            >
                <div className={cn("flex items-center", !collapsed && "gap-2")}>
                    <MessageSquareText
                        className={cn(
                            "w-4 h-4 text-gray-400",
                            // Highlight icon if unread (since badge might be hidden)
                            channel.unread > 0 && "text-primary-300"
                        )}
                    />

                    {/* 3. Hide Text when collapsed */}
                    {!collapsed && (
                        <span
                            className={cn(
                                "text-sm whitespace-nowrap",
                                channel.unread > 0 && "font-semibold"
                            )}
                        >
                            {channel.channel.name}
                        </span>
                    )}
                </div>

                {/* 4. Hide Unread Badge when collapsed */}
                {!collapsed && channel.unread > 0 && (
                    <span className="flex justify-center items-center bg-primary-300 py-0.5 rounded-full min-w-5 max-w-5 text-background text-xs text-center">
                        {channel.unread}
                    </span>
                )}
            </div>
        </Link>
    );
}
