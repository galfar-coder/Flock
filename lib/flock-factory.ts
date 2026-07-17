import {
    APIGuildMember,
    APIMessage,
    APIRole, APISticker,
    APIStickerItem,
    APIUser,
    GatewayPresenceUpdate
} from "discord-api-types/v9";
import {FlockMessage, FlockPresence, FlockSticker, FlockUser} from "@/types/flock.ts";
import {getAvatarUrl} from "@/lib/utils/avatars.ts";
import {API} from "@spacebarchat/spacebar-ts";


export class FlockFactory {
    /**
     * Unifies a User and Member into single FlockUser
     * @param user
     * @param member
     * @param serverId
     * @param roles
     * @param presence
     */
    static createUser(
        user: API.User,
        member?: Partial<API.Member>,
        serverId?: string,
        presence?: FlockPresence,
        roles?: API.Role[],
    ): FlockUser {
        const displayName = member?.nick || user.username;

        const defaultPresence: FlockPresence = {
            status: "offline",
        }

        let roleColor = "";
        if (member?.roles && roles && roles.length > 0) {
            const sortedRoles = roles
                .filter(r => member.roles!.filter(r2 => r2.id === r.id).length !== 0 && r.color !== 0)
                .sort((a, b) => b.position - a.position);

            if (sortedRoles.length > 0) {
                roleColor = `#${sortedRoles[0].color.toString(16).padStart(6, '0')}`;
            }
        }

        return {
            id: user.id,
            username: user.username,
            displayName: displayName,
            bot: user.bot ,
            color: roleColor,
            avatarUrl: getAvatarUrl({
                serverId: serverId || "",
                userId: user.id,
                userAvatar: user.avatar,
                memberAvatar: member?.avatar
            }) || "",
            banner: user.banner,
            bio: member?.bio || user.bio || "",
            pronouns: user.pronouns || "",
            initials: user.username.substring(0, 2).toUpperCase(),
            presence: presence || defaultPresence,
            rawUser: user,
            rawMember: member
        };
    }

    /**
     * Transforms a raw APIMessage into a FlockMessage
     * @param message
     * @param serverId
     * @param serverMembers
     * @param serverRoles
     */
    static createMessage(
        message: FlockMessage,
        serverId: string,
        serverMembers: FlockUser[] = [],
        serverRoles: API.Role[] = []
    ): FlockMessage {
        console.log(message);
        const member = serverMembers.find(m => m.id === message.author?.id);

        const images = message.attachments?.filter(a => a.content_type?.startsWith("image/")) || [];
        const files = message.attachments?.filter(a => !a.content_type?.startsWith("image/")) || [];

        let editedTimestamp = null;
        if (message.edited_timestamp) {
            editedTimestamp = new Date(message.edited_timestamp);
        }

        const stickers = (message.sticker_items && message.sticker_items.length > 0) ? message.sticker_items?.map(s =>
            this.createSticker(s as API.Sticker)
        ) : []

        const mentions = message.mentions.length > 0 ? message.mentions.map(u => this.createUser(u)) : [];

        return {
            id: message.id,
            channelId: message.channel_id,
            type: message.type,
            content: message.content || "",
            dateTimestamp: new Date(message.timestamp),
            editedTimestamp: editedTimestamp,
            nonce: message.nonce as string,
            // Recursively use our user factory!
            author: this.createUser(message.author!, member?.rawMember, serverId, member?.presence, serverRoles),
            customAttachments: { images, files },
            stickers: stickers,
            mentions: mentions,
            reactions: message.reactions || [],
            rawMessage: message
        };
    }

    static createSticker(
        sticker: API.Sticker
    ): FlockSticker {
        return {
            id: sticker.id,
            name: sticker.name,
            description: sticker.description,
            available: sticker.available,
            guildId: sticker.guild_id,
            type: sticker.type,
            format_type: sticker.format_type,
            pack: sticker.pack,
        }
    }
}