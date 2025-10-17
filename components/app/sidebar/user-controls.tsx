import { Headphones, Mic, Settings } from "lucide-react";
import SpotifyControls from "./spotify-controls";

export function UserControls() {
    return (
        <div className="flex flex-col items-start bg-background-chat border-app rounded-2xl w-full">
            <SpotifyControls />
            <div className="flex items-center p-2 w-full">
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
                <div className="flex items-center gap-2">
                    <Mic className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                    <Headphones className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                    <Settings className="size-4 text-gray-400 hover:text-gray-200 cursor-pointer" />
                </div>
            </div>
        </div>
    );
}
