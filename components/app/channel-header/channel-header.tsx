import { Bell, Hash, Pin, Users, Eye, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import {useEffect, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {useParams} from "next/navigation";

export function ChannelHeader() {
    const [channelName, setChannelName] = useState("Unknown");
    const [channelTopic, setChannelTopic] = useState("");
    const params = useParams();
    const channelId = params.channelId;
    useEffect(() => {
        async function getChannelDetails() {
            const channel = await spacebarFetch(`channels/${channelId}`);
            setChannelName(channel.name);
            setChannelTopic(channel.topic);
        }
        if (channelId) getChannelDetails();
    }, [channelId]);

    return (
        <div className="flex justify-between items-center bg-background-chat shadow-sm p-4 border-app rounded-2xl h-12">
            <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-muted-foreground">
                    {channelName}
                </span>
                <span className="text-gray-500 text-sm">
                    {channelTopic}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Pin className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Users className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <div className="relative">
                    <Input
                        className="!bg-background-app !m-0 border-app focus:!border-primary-300 rounded-xl !ring-0 !text-sm transition-colors ease-fluid"
                        placeholder="Search for users..."
                    />
                    <KbdGroup className="top-1/2 right-2 absolute -translate-y-1/2">
                        <Kbd className="text-[9px]">Ctrl</Kbd>
                        <span className="text-gray-500">+</span>
                        <Kbd className="text-[9px]">K</Kbd>
                    </KbdGroup>
                </div>
                <Search className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>
        </div>
    );
}
