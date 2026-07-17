import {APIAttachment, APIGuildMember, APIMessage, APIReaction, APIUser, StickerFormatType} from "discord-api-types/v9";

import { API } from "@spacebarchat/spacebar-ts";

export enum FlockUserFlags {
    STAFF,
    PARTNER,
    HYPESQUAD,
    BUG_HUNTER_LEVEL_1,
    HYPESQUAD_ONLINE_HOUSE_1,
    HYPESQUAD_ONLINE_HOUSE_2,
    HYPESQUAD_ONLINE_HOUSE_3,
    PREMIUM_EARLY_SUPPORTER,
    TEAM_PSEUDO_USER,
    BUG_HUNTER_LEVEL_2,
    VERIFIED_BOT,
    VERIFIED_DEVELOPER,
    CERTIFIED_MODERATOR,
    BOT_HTTP_INTERACTIONS
}