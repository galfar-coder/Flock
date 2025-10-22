import { Users } from "lucide-react";

export function VoiceChannel() {
    return (
        <div>
            <div className="mb-1 px-2 font-semibold text-gray-400 text-xs uppercase tracking-wide">
                Voice Channels
            </div>
            <div className="flex items-center gap-2 hover:bg-gray-700 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm">General Voice</span>
            </div>
        </div>
    );
}
