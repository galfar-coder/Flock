import {ExtendedChannel} from "@/types/CustomInterfaces.ts";
import {useEffect, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {APIGuildChannel, ChannelType} from "discord-api-types/v9";
import {Separator} from "@/components/ui/separator.tsx";
import {VoiceChannel} from "@/components/app/sidebar/channels/voice-channel.tsx";
import {ForumChannel} from "@/components/app/sidebar/channels/forum-channel.tsx";
import {TextChannel} from "@/components/app/sidebar/channels/text-channel.tsx";
import {cn} from "@/lib/utils.ts";
import {API} from "@spacebarchat/spacebar-ts";
import {FlockChannel} from "@/lib/models.ts";


interface GuildSidebarProps {
    serverId: string;
    currentChannelId: string;
    collapsed: boolean;
    setHeaderName: (name: string) => void;
}

export function GuildSidebarContent({ serverId, currentChannelId, collapsed, setHeaderName }: GuildSidebarProps) {
    const [channels, setChannels] = useState<ExtendedChannel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchChannels() {
            setLoading(true);
            try {
                const [serverData, channelsData] = await Promise.all([
                    spacebarFetch(`guilds/${serverId}`),
                    spacebarFetch(`guilds/${serverId}/channels`)
                ]);

                setHeaderName(serverData.name); // Set the header to the Guild Name!

                const guildChannels = channelsData as (FlockChannel & { position: number })[];
                const sorted = guildChannels.sort((a, b) => a.position - b.position);

                setChannels(sorted.map(c => ({ channel: c, unread: 0 })));
            } catch (err) {
                console.error("Failed to load guild", err);
                setHeaderName("Unknown Server");
            } finally {
                setLoading(false);
            }
        }

        fetchChannels();
    }, [serverId, setHeaderName]);

    // @ts-expect-error bitmask.
    const VIEW_CHANNEL = 1n << 10n;
    function canSeeChannel(channel: FlockChannel) {
        if (!channel.permission_overwrites) return true;
        const everyoneOverwrite = channel.permission_overwrites.find(o => o.id === serverId);
        if (everyoneOverwrite) {
            const denied = BigInt(everyoneOverwrite.deny);
            if ((denied & VIEW_CHANNEL) === VIEW_CHANNEL) return false;
        }
        return true;
    }

    const visibleChannels = channels.filter(c => canSeeChannel(c.channel as FlockChannel));
    const categories = visibleChannels.filter(c => c.channel.type === ChannelType.GuildCategory);
    const textAndForums = visibleChannels.filter(c => c.channel.type !== ChannelType.GuildCategory && c.channel.type !== ChannelType.GuildVoice);
    const voiceChannels = visibleChannels.filter(c => c.channel.type === ChannelType.GuildVoice);

    if (loading) return <div className="px-4 text-xs text-gray-500">Loading channels...</div>;

    return (
        <>
            {/* Top Level Channels */}
            <div className="flex flex-col gap-1 px-2 mb-4">
                {textAndForums.filter(c => !c.channel.parent_id).map(item => (
                    item.channel.type === ChannelType.GuildForum
                        ? <ForumChannel key={item.channel.id} channel={item} active={currentChannelId === item.channel.id} channelId={item.channel.id} serverId={serverId} collapsed={collapsed} />
                        : <TextChannel key={item.channel.id} channel={item} active={currentChannelId === item.channel.id} channelId={item.channel.id} serverId={serverId} collapsed={collapsed} />
                ))}
            </div>

            {/* Categories */}
            {categories.map(cat => {
                const children = textAndForums.filter(c => c.channel.parent_id === cat.channel.id);
                return (
                    <div key={cat.channel.id} className="mb-4">
                        <div className={cn("mb-1 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide", collapsed && "hidden")}>
                            {cat.channel.name}
                        </div>
                        <div className="flex flex-col gap-1 px-2">
                            {children.map(item => (
                                item.channel.type === ChannelType.GuildForum
                                    ? <ForumChannel key={item.channel.id} channel={item} active={currentChannelId === item.channel.id} channelId={item.channel.id} serverId={serverId} collapsed={collapsed} />
                                    : <TextChannel key={item.channel.id} channel={item} active={currentChannelId === item.channel.id} channelId={item.channel.id} serverId={serverId} collapsed={collapsed} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Voice Channels */}
            {voiceChannels.length > 0 && (
                <>
                    <Separator className="my-2 border-subtle/20" />
                    <div className="mb-4">
                        {!collapsed && <div className="mb-1 px-4 font-semibold text-gray-400 text-xs uppercase tracking-wide">Voice Channels</div>}
                        <div className="flex flex-col gap-1 px-2">
                            {voiceChannels.map((item) => (
                                <VoiceChannel key={item.channel.id} name={item.channel.name!} collapsed={collapsed} />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}