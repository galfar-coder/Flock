import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { useState } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:6942");

interface InputFieldProps {
    disabled?: boolean;
}

const getTabId = () => {
    if (typeof window === "undefined") return "";

    let id = sessionStorage.getItem("chat_tab_id");
    if (!id) {
        id = `tab-${crypto.randomUUID()}`;
        sessionStorage.setItem("chat_tab_id", id);
    }
    return id;
};

export function InputField({ disabled = false }: InputFieldProps) {
    if (!socket.active) socket.connect();

    const [value, setValue] = useState("");

    function sendMessage() {
        if (!value.trim() || disabled) return;
        socket.emit("message", {
            serverId: "1",
            channelId: "1",
            content: value,
            authorId: "1761-" + getTabId(),
        });
        setValue("");
    }

    return (
        <div
            className={`flex items-center gap-2 bg-background-chat m-2 p-2 border border-app rounded-2xl ${
                disabled ? "animate-shake" : ""
            } `}
        >
            <div className="flex items-center">
                <button
                    className="hover:bg-primary-300 disabled:opacity-50 p-3 rounded-full transition-colors disabled:cursor-not-allowed"
                    disabled={disabled}
                >
                    <Plus size={20} />
                </button>
            </div>
            <Input
                className="relative flex-1 !bg-background-chat disabled:opacity-50 !m-0 !border-none focus:!border-none rounded-xl !ring-0 h-12 !text-muted-foreground placeholder:!text-muted-foreground/50 !text-lg !break-words transition-colors ease-fluid disabled:cursor-not-allowed"
                placeholder={disabled ? "Rate limited..." : "Send message..."}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) =>
                    e.key === "Enter" && !disabled && sendMessage()
                }
                disabled={disabled}
            />
            <div className="flex justify-between items-center">
                <button
                    className="hover:bg-primary-300 disabled:opacity-50 p-3 rounded-full transition-colors disabled:cursor-not-allowed"
                    onClick={() => sendMessage()}
                    disabled={disabled}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
