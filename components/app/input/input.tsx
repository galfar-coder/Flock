import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import {useEffect, useRef, useState} from "react";
import { io } from "socket.io-client";
import {spacebarFetch} from "@/lib/api-client.ts";
import {useParams} from "next/navigation";

// const socket = io("ws://localhost:6942");

interface InputFieldProps {
    disabled?: boolean;
    onSend: (content: string) => void;
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

export function InputField({ disabled = false, onSend }: InputFieldProps) {
    const [value, setValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resizing textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "24px"; // Reset for correct calculation
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 200)}px`; // Resizing
        }
    }, [value]);

    const handleSend = () => {
        if (!value.trim() || disabled) return;
        onSend(value);
        setValue("");
        if (textAreaRef.current) textAreaRef.current.style.height = "24px";
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
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !disabled) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                disabled={disabled}
            />
            <div className="flex justify-between items-center">
                <button
                    className="hover:bg-primary-300 disabled:opacity-50 p-3 rounded-full transition-colors disabled:cursor-not-allowed"
                    onClick={handleSend}
                    disabled={disabled}
                >
                    <Send size={20} />
                </button>
            </div>
        </div>
    );
}
