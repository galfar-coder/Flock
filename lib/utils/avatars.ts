import {CDN_URL} from "@/lib/constants.ts";


interface AvatarParams {
    serverId: string;
    userId: string;
    userAvatar: string | null | undefined;
    memberAvatar: string | null | undefined;
}

export function getAvatarUrl({ serverId, userId, userAvatar, memberAvatar }: AvatarParams) {
    // Priority: Guild-Specific Avatar
    if (memberAvatar) {
        return `${CDN_URL}/guilds/${serverId}/users/${userId}/avatars/${memberAvatar}.png`;
    }

    // Fallback: Global User Avatar
    if (userAvatar) {
        return `${CDN_URL}/avatars/${userId}/${userAvatar}.png`;
    }

    // Final fallback
    return null;
}