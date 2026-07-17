import {API} from "@spacebarchat/spacebar-ts";
import {getAvatarUrl} from "@/lib/utils/avatars.ts";

export type FlockMember = API.Member & FlockUser;

export type FlockUser = API.User & {
    displayName: string;
    initials: string;
    avatarUrl: string;
    color: string | null;
    memberContext?: Partial<FlockMember>;
    presence?: FlockPresence;
    bio?: string;
    pronouns?: string;
}

export type FlockMessage = API.Message & {
    dateTimestamp: Date;
    editedDate: Date | null;
    authorUser: FlockMember;
    imageAttachments: FlockAttachment[];
    fileAttachments: FlockAttachment[];
    mentions: FlockMember[];
    stickers: FlockSticker[];
}

export type FlockPresence = {
    status: "online" | "idle" | "dnd" | "offline";
    platform?: string | null;
    user?: FlockUser;
}

export type FlockRole = API.Role;

export type FlockAttachment = API.Attachment_1;

export type FlockChannel = API.Channel;

export type FlockDMChannel = API.DmChannelDTO;

export type FlockCombinedChannel = FlockChannel | FlockDMChannel;

export type FlockSticker = API.Sticker;

export type FlockGuild = API.Guild;

export type FlockUserProfile = API.UserProfile;

export interface UserEnhanceProps {
    user: API.User,
    memberContext?: Partial<API.Member>,
    serverId?: string,
    presence?: FlockPresence,
    serverRoles?: API.Role[],
}

export function enhanceUser(
    props: UserEnhanceProps,
): FlockUser {
    const displayName = props.memberContext?.nick || props.user.username;

    let color = null;
    if (props.memberContext && props.memberContext.roles && props.serverRoles) {
        // member.roles is an array of strings (IDs). Includes checks if the string exists.
        const roles = props.serverRoles
            .filter(r => props.memberContext?.roles!.filter(r2 => r2.id === r.id).length !== 0 && r.color !== 0)
            .sort((a, b) => b.position - a.position);

        if (roles.length > 0) {
            color = `#${roles[0].color.toString(16).padStart(6, '0')}`;
        }
    }

    return {
        ...props.user,
        displayName,
        bio: props.user.bio,
        pronouns: props.memberContext?.pronouns,
        initials: displayName.substring(0, 2).toUpperCase(),
        avatarUrl: getAvatarUrl({
            serverId: props.serverId || "",
            userId: props.user.id,
            userAvatar: props.user.avatar,
            memberAvatar: props.memberContext?.avatar
        }) || "",
        color,
        memberContext: props.memberContext as FlockMember,
        presence: props.presence,
    }
}

export function enhanceMessage(
    message: API.Message,
    serverId: string,
    serverMembers: FlockMember[] = [],
    serverRoles: API.Role[] = [],
): FlockMessage {
    const member = serverMembers.find(member => member.id === message.author?.id);

    const authorUser = enhanceUser({
        user: message.author as FlockUser,
        memberContext: member?.memberContext,
        serverId,
        serverRoles,
        presence: member?.presence,
    }) as FlockMember;

    const imageAttachments = message.attachments?.filter(a => a.content_type?.startsWith("image/")) || [];
    const fileAttachments = message.attachments?.filter(a => !a.content_type?.startsWith("image/")) || [];

    const mentions = (message.mentions || []).map(mentionedUser => {
        const fullMember = serverMembers.find(m => m.id === mentionedUser.id);

        return enhanceUser({
            user: mentionedUser as FlockUser,
            memberContext: fullMember?.memberContext,
            serverId,
            serverRoles,
            presence: member?.presence,
        }) as FlockMember;
    });

    return {
        ...message,
        dateTimestamp: new Date(message.timestamp),
        editedDate: message.edited_timestamp ? new Date(message.edited_timestamp) : null,
        authorUser,
        imageAttachments,
        fileAttachments,
        stickers: message.sticker_items as FlockSticker[],
        mentions: mentions,
    }
}