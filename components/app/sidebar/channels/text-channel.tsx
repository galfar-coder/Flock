import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {ExtendedChannel} from "@/types/CustomInterfaces.ts";
import {useWebSocket} from "@/components/websocket/websocket-manager.tsx";

export interface TextChannelProps {
    channel: ExtendedChannel;
    active: boolean;
    collapsed?: boolean;
    serverId: string;
    channelId: string;
}

export function TextChannel({ channel, collapsed, active, serverId, channelId }: TextChannelProps) {
    const { isChannelUnread, getMentionCount } = useWebSocket();
    const unread = isChannelUnread(channelId);
    const mentionCount = getMentionCount(channelId);

    const displayCount = mentionCount > 99 ? "99+" : mentionCount.toString();

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
                    <Hash
                        className={cn(
                            "w-4 h-4 text-gray-400",
                            // Highlight icon if unread (since badge might be hidden)
                            unread && "text-primary-300"
                        )}
                    />

                    {/* 3. Hide Text when collapsed */}
                    {!collapsed && (
                        <span
                            className={cn(
                                "text-sm whitespace-nowrap text-muted-foreground",
                                unread && "font-semibold text-white"
                            )}
                        >
                            {channel.channel.name}
                        </span>
                    )}
                </div>

                {/* Hide Unread Badge when collapsed */}
                {!collapsed && mentionCount > 0 && (
                    <span className="flex justify-center items-center bg-primary-300 py-0.5 rounded-full min-w-[20px] text-background text-xs text-center">
                        {displayCount}
                    </span>
                )}
            </div>
        </Link>
    );
}
