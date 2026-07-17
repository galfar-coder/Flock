import {APIDMChannel, APIGroupDMChannel} from "discord-api-types/v9";
import {CDN_URL} from "@/lib/constants.ts";
import Link from "next/link";
import {cn} from "@/lib/utils.ts";
import {FlockDMChannel} from "@/lib/models.ts";


interface DMChannelProps {
    channel: FlockDMChannel;
    active: boolean;
    collapsed: boolean;
}

export function DMChannel({ channel, active, collapsed }: DMChannelProps) {

    let name = "unknown-user";
    let avatarUrl = "";

    if (channel.recipients && channel.recipients.length > 0) {
        const user = channel.recipients[0];
        name = user.username;
        if (user.avatar) {
            avatarUrl = `${CDN_URL}/avatars/${user.id}/${user.avatar}.png`;
        }
    }

    const initials = name ? name.substring(0, 2).toUpperCase() : "??";

    return (
        <Link href={`/channels/@me/${channel.id}`}>
            <div className={cn(
                "group flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-300",
                collapsed && "justify-center"
            )}>
                <div className="relative flex-shrink-0 size-8 rounded-full bg-primary-300 flex items-center justify-center font-bold text-xs text-white overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name || "DM"} className="size-full object-cover" />
                    ) : initials}
                </div>
                {!collapsed && (
                    <div className="flex-1 truncate text-sm font-medium">
                        {name}
                    </div>
                )}
            </div>
        </Link>
    );
}