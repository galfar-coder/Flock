import {FlockDMChannel, FlockGuild, FlockUser, FlockUserSettings} from "@/lib/models.ts";


export type GatewayReady = {
    analytics_token: string;
    api_code_version: number;
    auth_session_id_hash: string;
    connectedAccounts?: [];
    consents: {
        personalization: {
            consented: boolean;
        };
    };
    country_code: string;
    experiments: [];
    friend_suggestion_count: number;
    game_relationships: [];
    geo_ordered_rtc_regions: [];
    guild_experiments: [];
    guild_join_requests: [];
    guilds: FlockGuild[];
    merged_members: [];
    notification_settings: {
        flags: number;
    };
    presences: [];
    private_channels: FlockDMChannel[];
    read_state: {
        entries: GatewayReadState[];
        partial: boolean;
        version: number;
    };
    relationships: [];
    resume_gateway_url: string;
    session_id: string;
    session_type: string;
    sessions: GatewaySession[];
    tutorial: null;
    user: FlockUser;
    user_guild_settings: {
        entries: GatewayGuildSettings[];
        partial: boolean;
        version: number;
    };
    user_settings: FlockUserSettings;
    user_settings_proto: string;
    user_settings_proto_json: {
        versions: object;
    };
    users: FlockUser[];
    v: number;
    _trace: string[];
};

export interface GatewayGuildSettings {
    channel_overrides: [];
    flags: number;
    guild_id: string;
    hide_muted_channels: boolean;
    message_notifications: number;
    mobile_push: boolean;
    mute_config: null;
    mute_scheduled_events: boolean;
    muted: boolean;
    notify_highlights: number;
    suppress_everyone: boolean;
    suppress_roles: boolean;
    version: number;
}

export interface GatewaySession {
    active: boolean;
    activities: [];
    client_info: {
        client: string;
        os: string;
        version: number;
    };
    hidden_activities: [];
    session_id: string;
    status: string;
}

export interface GatewayReadState {
    id: string;
    channel_id: string;
    last_message_id: string | null;
    last_pin_timestamp?: string | null;
    mention_count: number;
}

export interface GatewayReadStateChannel {
    id: string;
    last_message_id?: string | null;
}

export interface GatewayReadStateGuild {
    id: string;
    channels?: GatewayReadStateChannel[];
}