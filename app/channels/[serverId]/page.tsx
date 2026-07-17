"use client";

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {ChannelType} from "discord-api-types/v9";
import {FlockDMChannel} from "@/lib/models.ts";


export default function ServerEntryPage() {
    const router = useRouter();
    const { serverId } = useParams();
    const serverIdReal = decodeURIComponent(serverId as string);

    const [isMe, setIsMe] = useState(false);

    useEffect(() => {
        if (serverIdReal === "@me") {
            setIsMe(true);
            return;
        }

        async function redirectToServerChannel() {
            const lastChannel = localStorage.getItem(`last_channel_${serverIdReal}`);
            if (lastChannel) {
                router.replace(`/channels/${serverIdReal}/${lastChannel}`);
                return;
            }

            try {
                const channels = await spacebarFetch(`guilds/${serverIdReal}/channels`) as FlockDMChannel[];

                const textChannels = channels
                    .filter((c: FlockDMChannel) => c.type === ChannelType.GuildText)
                    .sort((a, b) => (0) - (0));

                if (textChannels.length > 0) {
                    router.replace(`/channels/${serverIdReal}/${textChannels[0].id}`);
                } else {
                    console.warn(`No channel found for guild ${serverIdReal}`);
                }
            } catch (err) {
                console.error("Failed to fetch channels for redirect", err);
                router.replace("/channels/@me");
            }
        }
        redirectToServerChannel();
    }, [serverIdReal, router]);

    if (isMe) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full bg-background-chat rounded-2xl text-gray-400">
                <h1 className="text-2xl font-bold text-white mb-2">Friends</h1>
                <p>Such friends</p>
            </div>
        );
    }

    return <div className="h-full w-full bg-background-chat rounded-2xl animate-pulse"></div>;
}