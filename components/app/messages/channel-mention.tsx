import {ChannelType} from "discord-api-types/v9";
import Link from "next/link";
import {FlockCombinedChannel} from "@/lib/models.ts";

interface ChannelMentionProps {
    channel?: FlockCombinedChannel;
    serverId: string;
    channelId: string;
}


export function ChannelMention({
    channel,
    serverId,
    channelId
}: ChannelMentionProps) {
    const icon = channel?.type === ChannelType.GuildVoice ? "🔊" : "#";
    const name = channel?.name || "unknown-channel";

    let redirect = "#";
    if (channelId.length > 0 && serverId.length > 0) {
        redirect = `/channels/${serverId}/${channelId}`;
    }

    return (
        <Link
            href={redirect}
            className="bg-white/10 text-gray-200 hover:bg-white/20 hover:text-white px-1 rounded-[3px] font-medium transition-colors inline-flex items-center gap-0.5"
        >
            <span className="opacity-60 text-lg leading-none">{icon}</span>
            {name}
        </Link>
    );
}