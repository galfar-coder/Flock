import { Hash, MoreVertical, Settings, Users } from "lucide-react";

export function Sidebar() {
    const channels = [
        { id: 1, name: "general", unread: 0 },
        { id: 2, name: "random", unread: 3 },
        { id: 3, name: "announcements", unread: 0 },
        { id: 4, name: "support", unread: 1 },
    ];

    return (
        <div className="flex flex-col bg-accent w-60 text-gray-100">
            {/* Server/Workspace Header */}
            <div className="flex justify-between items-center shadow-sm px-4 border-gray-700 border-b h-12">
                <span className="font-semibold text-sm">My Workspace</span>
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
                            className="group flex justify-between items-center hover:bg-gray-700 mb-0.5 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer transtion-all"
                        >
                            <div className="flex items-center gap-2">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <span className="text-sm">{channel.name}</span>
                            </div>
                            {channel.unread > 0 && (
                                <span className="bg-red-500 px-1.5 py-0.5 rounded-full min-w-5 text-white text-xs text-center">
                                    {channel.unread}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <div>
                    <div className="mb-1 px-2 font-semibold text-gray-400 text-xs uppercase tracking-wide">
                        Voice Channels
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">General Voice</span>
                    </div>
                </div>
            </div>

            {/* User Section */}
            <div className="flex items-center bg-background-200 px-2 border-gray-700 border-t h-14">
                <div className="flex flex-1 items-center gap-2">
                    <div className="flex justify-center items-center bg-primary-300 rounded-full w-8 h-8 font-semibold text-white text-sm">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                            John Doe
                        </div>
                        <div className="text-gray-400 text-xs">Online</div>
                    </div>
                </div>
                <div className="flex gap-1">
                    <Settings className="w-4 h-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
