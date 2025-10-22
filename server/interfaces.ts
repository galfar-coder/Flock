// The structure for joining a channel (room) 
export interface IChannelJoinPayload {
    serverId: string;
    channelId: string;
    userId: string;
}

// The structure of the message payload a client *sends* to the server
export interface IMessagePayload {
    serverId: string;
    channelId: string;
    content: string;
    // Client might send a temporary user ID, but the server should validate/assign the official one
    authorId: string; 
}

// The full, canonical message object the server *broadcasts*
export interface IMessage {
    messageId: string;
    serverId: string;
    channelId: string;
    content: string;
    timestamp: number; // Unix timestamp
    author: {
        id: string;
        username: string;
        avatarUrl?: string;
    };
}

