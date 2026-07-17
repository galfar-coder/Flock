import {APIGuildMember, APIMessage} from "discord-api-types/v9";
import {getAvatarUrl} from "@/lib/utils/avatars.ts";
import {FlockMessage, FlockUser} from "@/types/flock.ts";


export function formatMessageData(
    message: FlockMessage,
    serverId: string,
    serverMembers: FlockUser[]
): FlockMessage {
    const member = serverMembers?.find(m => m.id === message.author.id);

    const avatarUrl = getAvatarUrl({
        serverId,
        userId: message.author.id,
        userAvatar: message.author.avatarUrl,
        memberAvatar: member?.rawMember?.avatar,
    });

    return {
        id: message.id,
        channelId: message.channelId,
        type: message.type,
        content: message.content,
        dateTimestamp: new Date(message.dateTimestamp),
        author: message.author,
        customAttachments: {
            images,
            files,
        },
        mentions: message.mentions,
        reactions: [],
    }
}