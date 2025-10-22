import { Hash, MoreVertical } from "lucide-react";
import { UserControls } from "./user-controls";
import { VoiceChannel } from "./channels/voice-channel";

export function Sidebar() {
    const channels = [
        { id: 1, name: "general", unread: 0 },
        { id: 2, name: "random", unread: 3 },
        { id: 3, name: "announcements", unread: 0 },
        { id: 4, name: "support", unread: 1 },
    ];

    return (
        <div className="hidden md:flex md:flex-col gap-3 h-full">
            <div className="flex flex-col bg-background-chat p-2 border-app rounded-2xl w-72 h-full text-gray-100">
                {/* Server/Workspace Header */}
                <div className="flex justify-between items-center shadow-sm px-4 border-subtle/20 border-b h-12">
                    <span className="font-semibold text-sm">My Server</span>
                    <MoreVertical className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                </div>

                {/* Channel List */}
                <div className="flex-1 px-2 py-3 overflow-y-auto">
                    <div className="mb-4">
                        <div className="mb-1 px-2 font-semibold text-gray-400 text-xs uppercase tracking-wide">
                            Text Channels
                        </div>
                        {channels.map((channel) => (
                            <div
                                key={channel.id}
                                className="group flex justify-between items-center hover:bg-background-app mb-0.5 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer transtion-all"
                            >
                                <div className="flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm">
                                        {channel.name}
                                    </span>
                                </div>
                                {channel.unread > 0 && (
                                    <span className="bg-primary-300 px-1.5 py-0.5 rounded-full min-w-5 text-background text-xs text-center">
                                        {channel.unread}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    <VoiceChannel />
                </div>
            </div>
            {/* User Section */}
            <UserControls />
        </div>
    );
}
