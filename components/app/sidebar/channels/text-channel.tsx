import { Hash } from "lucide-react";

export interface TextChannelProps {
    channel: {
        serverId: number;
        channelId: number;
        name: string;
        unread: number;
    };
}

export function TextChannel({ channel }: TextChannelProps) {
    return (
        <div
            key={channel.channelId}
            className="group flex justify-between items-center hover:bg-background-app mb-0.5 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer transtion-all"
        >
            <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{channel.name}</span>
            </div>
            {channel.unread > 0 && (
                <span className="flex justify-center items-center bg-primary-300 py-0.5 rounded-full min-w-5 max-w-5 text-background text-xs text-center">
                    {channel.unread}
                </span>
            )}
        </div>
    );
}
