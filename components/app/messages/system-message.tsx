import {MessageType} from "discord-api-types/v9";
import {UserRoundPlus} from "lucide-react";
import {FlockMessage} from "@/lib/models.ts";

interface SystemMessageProps {
    message: FlockMessage;
}

export function SystemMessage({ message }: SystemMessageProps) {
    // Format Time
    const timeStr = new Date(message.dateTimestamp).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
    });

    if (message.type === MessageType.UserJoin) {
        return (
            <div className="flex items-center gap-3 px-4 py-2 hover:bg-primary-100/10 rounded-lg transition-colors group">
                <div className="flex flex-shrink-0 justify-center items-center w-12">
                    <UserRoundPlus className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1 text-sm text-gray-400">
                    <span className="font-bold text-gray-200 cursor-pointer hover:underline mr-1">
                        {message.author!.username}
                    </span>
                    <span>joined the server.</span>
                    <span className="text-[10px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {timeStr}
                    </span>
                </div>
            </div>
        );
    }

    // TODO: Make other System Messages

    return (
        <div className="px-4 py-2 text-sm text-gray-500 font-bold">
            System Message: {message.type}
        </div>
    );
}