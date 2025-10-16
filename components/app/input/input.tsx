import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:6942");

export function InputField() {
    if (!socket.active) socket.connect();

    const [value, setValue] = useState("");
    function sendMessage() {
        if (!value.trim()) return;
        socket.send(value);
        setValue("");
    }

    return (
        <div className="flex items-center gap-2 bg-background-chat p-2">
            <div className="flex items-center">
                <button className="hover:bg-primary-300 p-3 rounded-full transition-colors">
                    <Plus size={20} />
                </button>
            </div>
            <Input
                className="relative flex-1 !bg-background-app !m-0 !border-app focus:!border-primary-300 rounded-xl !ring-0 h-12 !text-lg transition-colors ease-fluid"
                placeholder="Send message..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <div className="flex justify-between items-center">
                <button
                    className="hover:bg-primary-300 p-3 rounded-full transition-colors"
                    onClick={() => sendMessage()}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
