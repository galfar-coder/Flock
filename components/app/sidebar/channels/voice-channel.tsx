import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceChannel({ collapsed }: { collapsed?: boolean }) {
    return (
        <div>
            <div
                className={cn(
                    "mb-1 px-2 font-semibold text-gray-400 text-xs uppercase tracking-wide",
                    collapsed ? "hidden" : "block"
                )}
            >
                Voice Channels
            </div>
            <div
                className={cn(
                    "flex items-center gap-2 hover:bg-gray-700 px-2 py-1.5 rounded-xl hover:translate-x-1.5 duration-300 ease-fluid cursor-pointer",
                    collapsed ? "justify-center" : ""
                )}
            >
                <Users className={cn("w-4 h-4 text-gray-400 text-center")} />
                <span
                    className={cn(
                        "font-semibold text-sm",
                        collapsed ? "hidden" : "inline-block"
                    )}
                >
                    General Voice
                </span>
            </div>
        </div>
    );
}
