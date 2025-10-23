"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { io, Socket } from "socket.io-client";

interface ConnectionKey {
    serverId: string;
    channelId: string;
}

interface WebSocketManagerContextType {
    getSocket: (serverId: string, channelId: string) => Socket | null;
    connectToChannel: (
        serverId: string,
        channelId: string,
        userId: string
    ) => Socket;
    disconnectFromChannel: (serverId: string, channelId: string) => void;
}

const WebSocketManagerContext =
    createContext<WebSocketManagerContextType | null>(null);

export const useWebSocketManager = () => {
    const ctx = useContext(WebSocketManagerContext);
    if (!ctx)
        throw new Error(
            "useWebSocketManager must be used within a WebSocketManagerProvider"
        );
    return ctx;
};

export const WebSocketManagerProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [connections, setConnections] = useState<Map<string, Socket>>(
        new Map()
    );

    const makeKey = (serverId: string, channelId: string) =>
        `${serverId}:${channelId}`;

    const getSocket = useCallback(
        (serverId: string, channelId: string): Socket | null => {
            const key = makeKey(serverId, channelId);
            return connections.get(key) || null;
        },
        [connections]
    );

    const connectToChannel = useCallback(
        (serverId: string, channelId: string, userId: string): Socket => {
            const key = makeKey(serverId, channelId);
            const existing = connections.get(key);
            if (existing) return existing;

            const socket = io("ws://localhost:6942");

            socket.on("connect", () => {
                console.log(`🔌 Connected [${key}] as ${userId}`);
                socket.emit("join_channel", { serverId, channelId, userId });
            });

            socket.on("disconnect", (reason) => {
                console.log(`❌ Disconnected [${key}] due to ${reason}`);
            });

            setConnections((prev) => {
                const next = new Map(prev);
                next.set(key, socket);
                return next;
            });

            return socket;
        },
        [connections]
    );

    const disconnectFromChannel = useCallback(
        (serverId: string, channelId: string) => {
            const key = makeKey(serverId, channelId);
            const socket = connections.get(key);
            if (socket) {
                socket.disconnect();
                setConnections((prev) => {
                    const next = new Map(prev);
                    next.delete(key);
                    return next;
                });
                console.log(`🧹 Cleaned up socket [${key}]`);
            }
        },
        [connections]
    );

    useEffect(() => {
        return () => {
            connections.forEach((socket, key) => {
                socket.disconnect();
                console.log(`🧹 Disconnected leftover socket: ${key}`);
            });
        };
    }, [connections]);

    return (
        <WebSocketManagerContext.Provider
            value={{
                getSocket,
                connectToChannel,
                disconnectFromChannel,
            }}
        >
            {children}
        </WebSocketManagerContext.Provider>
    );
};
