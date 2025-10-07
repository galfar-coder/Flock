import { Bell, Hash, Pin, Search, Users } from "lucide-react";

export function ChannelHeader() {
    return (
        <div className="flex justify-between items-center bg-accent shadow-sm px-4 border-gray-700 border-b h-12">
            <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-muted-foreground">
                    general
                </span>
                <span className="text-gray-500 text-sm">
                    General discussions
                </span>
            </div>

            <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Pin className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Search className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                <Users className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
            </div>
        </div>
    );
}
