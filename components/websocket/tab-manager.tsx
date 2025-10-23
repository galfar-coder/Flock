"use client";

import React, { useEffect, useState, useRef } from "react";
import type { IMessage } from "@/server/interfaces";
import { useWebSocketManager } from "@/components/websocket/websocket-manager";

interface TabManagerProps {
    serverId: string;
    channelId: string;
    userId: string;
    onMessage?: (msg: IMessage) => void;
}

export const TabManager: React.FC<TabManagerProps> = ({
    serverId,
    channelId,
    userId,
    onMessage,
}) => {
    const { connectToChannel, disconnectFromChannel } = useWebSocketManager();
    const [connected, setConnected] = useState(false);
    const socketRef = useRef<ReturnType<typeof connectToChannel> | null>(null);

    useEffect(() => {
        const socket = connectToChannel(serverId, channelId, userId);
        socketRef.current = socket;

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        if (onMessage) socket.on("message", onMessage);

        return () => {
            if (onMessage) socket.off("message", onMessage);
            disconnectFromChannel(serverId, channelId);
        };
    }, [serverId, channelId, userId]);

    return null; // purely functional manager; it doesn't render anything itself
};
