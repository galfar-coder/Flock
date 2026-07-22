import {APIGuildChannel, APIGuildMember, GatewayActivity, GatewayPresenceUpdate} from "discord-api-types/v9";
import {API} from "@spacebarchat/spacebar-ts";
import {FlockChannel, FlockMember, FlockPresence} from "@/lib/models.ts";

export interface ExtendedChannel {
    channel: FlockChannel;
    unread: number;
}

export type IExtendedMember = FlockMember & {
    presence: FlockPresence;
}

export interface IMemberListItem {
    member?: IExtendedMember;
    group?: {
        id: string;
        count: number;
    };
}

export interface IMemberListOp {
    op: "SYNC" | "INSERT" | "UPDATE" | "DELETE";
    items: IMemberListItem[];
    range?: [number, number];
    index?: number;
}

export interface IGuildMemberGroup {
    count: number;
    id: string;
}

export interface IGuildMemberListUpdate {
    groups: IGuildMemberGroup[];
    guild_id: string;
    id: string; // everyone
    member_count: number;
    online_count: number;
    ops: IMemberListOp[];
}

export interface APIPresence {
    status: 'online' | 'idle' | 'dnd' | 'offline';
    activities?: GatewayActivity[];
    client_status?: {
        desktop?: string;
        mobile?: string;
        web?: string;
    };
}