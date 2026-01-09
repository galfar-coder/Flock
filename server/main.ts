import { Server, Socket } from "socket.io";
import type { IMessage, IMessagePayload, IChannelJoinPayload } from "./interfaces.ts";

const io = new Server({
    cors: { origin: "*" },
});

// Helper function to safely create a room name
const getChannelRoomName = (serverId?: string, channelId?: string): string | null => {
    if (!serverId || !channelId) return null;
    return `server:${serverId}:channel:${channelId}`;
};

io.on("connection", (socket: Socket) => {
    console.log(`New connection: ${socket.id}`);

    // --- 1. HANDLE USER JOINING A CHANNEL ---
    socket.on("join_channel", (payload: IChannelJoinPayload | null | undefined) => {
        try {
            if (!payload) {
                console.warn(`join_channel: Missing payload from ${socket.id}`);
                return;
            }

            const { serverId, channelId, userId } = payload;
            if (!serverId || !channelId || !userId) {
                console.log(payload ? null : `join_channel: Missing payload from ${socket.id}`);
                console.warn(`join_channel: Invalid payload from ${socket.id}`, payload);
                return;
            }

            const roomName = getChannelRoomName(serverId, channelId);
            if (!roomName) {
                console.warn(`join_channel: Failed to generate room name`, payload);
                return;
            }

            // Leave other channel rooms
            for (const room of socket.rooms) {
                if (room.startsWith("server:")) socket.leave(room);
            }

            socket.join(roomName);
            console.log(`User ${userId} joined room: ${roomName}`);

            io.to(roomName).emit(
                "system_message",
                `${userId} has joined the channel.`
            );
        } catch (err) {
            console.error(`Error in join_channel handler:`, err);
        }
    });

    // --- 2. HANDLE NEW MESSAGE ---
    socket.on("message", (payload: IMessagePayload | null | undefined) => {
        try {
            if (!payload) {
                console.warn("message: Missing payload");
                return;
            }

            const { serverId, channelId, content, authorId } = payload;

            if (!serverId || !channelId || !content || !authorId) {
                console.warn("message: Invalid payload", payload);
                return;
            }

            const roomName = getChannelRoomName(serverId, channelId);
            if (!roomName) {
                console.warn("message: Invalid room name", payload);
                return;
            }

            // Splits Message content into multiple messages,
            // one message content length limit is 2048 characters
            const contentMaxLength = 2048;
            const messages = [];
            for (let i = 0; i < content.length; i += contentMaxLength) {
                messages.push(content.slice(i, i + contentMaxLength));
            }
            for (const message of messages) {
                const data = {
                    messageId: Math.random().toString(36).substring(2, 9),
                    serverId,
                    channelId,
                    content: message,
                    timestamp: Date.now(),
                    author: {
                        id: authorId,
                        username: `User-${authorId.toString().substring(10, 14)}`,
                        avatarUrl: `https://example.com/avatars/${authorId}`,
                    },
                };
                console.log(data);
                io.to(roomName).emit("message", data);
            }

            console.log(
                `[${roomName}] New message from ${authorId}: ${content}`
            );
        } catch (err) {
            console.error(`Error in message handler:`, err);
        }
    });

    // --- 3. HANDLE DISCONNECT ---
    socket.on("disconnect", (reason) => {
        try {
            console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
        } catch (err) {
            console.error("Error in disconnect handler:", err);
        }
    });

    // --- 4. HANDLE UNEXPECTED ERRORS ---
    socket.on("error", (err) => {
        console.error(`Socket error from ${socket.id}:`, err);
    });
});

io.listen(6942);
console.log("Server listening on port 6942");
