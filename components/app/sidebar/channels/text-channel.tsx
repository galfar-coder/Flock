import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TextChannelProps {
    channel: {
        serverId: number;
        channelId: number;
        name: string;
        unread: number;
    };
    collapsed?: boolean;
}

export function TextChannel({ channel, collapsed }: TextChannelProps) {
    return (
        <div
            className={cn(
                "group flex items-center hover:bg-background-app mb-0.5 py-1.5 rounded-xl transition-all duration-300 ease-fluid cursor-pointer",
                // 2. Adjust layout: Center icon if collapsed, otherwise space-between with hover effect
                collapsed
                    ? "justify-center px-0 w-full"
                    : "justify-between px-2 hover:translate-x-1.5"
            )}
        >
            <div className={cn("flex items-center", !collapsed && "gap-2")}>
                <Hash
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
                        {channel.name}
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
    );
}
