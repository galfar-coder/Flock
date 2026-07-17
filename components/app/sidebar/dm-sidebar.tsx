import {useEffect, useState} from "react";
import {APIDMChannel, APIGroupDMChannel} from "discord-api-types/v9";
import {spacebarFetch} from "@/lib/api-client.ts";
import {DMChannel} from "@/components/app/sidebar/channels/dm-channel.tsx";
import {API} from "@spacebarchat/spacebar-ts";
import {FlockDMChannel} from "@/lib/models.ts";


interface DMSidebarProps {
    currentChannelId: string;
    collapsed: boolean;
    setHeaderName: (name: string) => void;
}

export function DMSidebarContent({ currentChannelId, collapsed, setHeaderName }: DMSidebarProps) {
    const [dmChannels, setDmChannels] = useState<FlockDMChannel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setHeaderName("Direct Messages");

        async function fetchDMs() {
            setLoading(true);
            try {
                const data = await spacebarFetch(`users/@me/channels`);

                setDmChannels(data);
            } catch (err) {
                console.error("Failed to fetch DMs", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDMs();
    }, [setHeaderName]);

    if (loading) return <div className="px-4 text-xs text-gray-500">Loading DMs...</div>;

    return (
        <div className="flex flex-col gap-1 px-2 mt-2">
            {!collapsed && (
                <div className="mb-2 px-2 font-semibold text-gray-400 text-xs uppercase tracking-wide">
                    Direct Messages
                </div>
            )}
            {dmChannels.map(channel => (
                <DMChannel
                    key={channel.id}
                    channel={channel}
                    active={currentChannelId === channel.id}
                    collapsed={collapsed}
                />
            ))}
        </div>
    );
}