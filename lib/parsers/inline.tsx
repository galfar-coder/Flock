// lib/parsers/inline.tsx
import React, { Fragment, ReactNode } from "react";
import { parseEmojis } from "./emoji-parser";
import Link from "next/link";
import {ChannelMention} from "@/components/app/messages/channel-mention.tsx";
import {UserMention} from "@/components/app/messages/user-mention.tsx";
import {FlockCombinedChannel, FlockMember, FlockRole} from "@/lib/models.ts";

// Dictionary for common shortcodes
const SHORTCODE_MAP: Record<string, string> = {
    "smile": "😄", "rocket": "🚀", "fire": "🔥", "thumbsup": "👍", "heart": "❤️"
};

export function parseInline(
    text: string,
    serverId: string,
    mentions?: FlockMember[],
    roles?: FlockRole[],
    channels?: FlockCombinedChannel[]
): ReactNode[] {
    if (!text) return [];

    // Regex for: Links/Images, Custom Emojis, Bold/Italic, Inline Code, Strikethrough, Shortcodes
    const regex = /(!?\[[^\]]+\]\([^)]+\)|<a?:[a-zA-Z0-9_]+:\d+>|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*|~~[^~]+~~|:[a-zA-Z0-9_]+:|<@&?\d+>|<#\d+>|@everyone|@here)/g;

    return text.split(regex).map((part, i) => {
        if (!part) return null;
        const key = `inline-${i}`;

        // Channel Mentions (<#ID>)
        const channelMatch = part.match(/^<#(\d+)>$/);
        if (channelMatch) {
            const channelId = channelMatch[1];
            const chan = channels?.find(c => c.id === channelId);
            return (
                <ChannelMention key={key} channel={chan} serverId={serverId} channelId={channelId} />
            );
        }

        // Role Mentions (<@&ID>)
        const roleMatch = part.match(/^<@&(\d+)>$/);
        if (roleMatch) {
            const roleId = roleMatch[1];
            const role = roles?.find(r => r.id === roleId);
            const color = role?.color ? `#${role.color.toString(16).padStart(6, '0')}` : "#c9cdfb";
            return (
                <span
                    key={key}
                    style={{ color, backgroundColor: `${color}20` }}
                    className="hover:brightness-125 px-1 rounded-[3px] font-medium cursor-pointer transition-colors"
                >
                    @{role?.name || "unknown-role"}
                </span>
            );
        }

        // User Mentions (<@123456789>)
        const mentionMatch = part.match(/^<@!?(\d+)>$/);
        if (mentionMatch) {
            const userId = mentionMatch[1];
            // Find the user in the mentions array provided by the API
            const mentionedUser = mentions?.find(u => u.id === userId);
            return (
                <UserMention key={key} user={mentionedUser!} userId={userId} />
            );
        }

        // Global Mentions (@everyone / @here)
        if (part === "@everyone" || part === "@here") {
            return (
                <span key={key} className="bg-[#5865F2]/20 text-[#c9cdfb] hover:bg-[#5865F2]/40 hover:text-white px-1 rounded-[3px] font-medium cursor-pointer transition-colors">
                    {part}
                </span>
            );
        }

        // Custom Emojis (Spacebar)
        const emoji = parseEmojis(part, key);
        if (emoji) return emoji;

        // Formatting (Markdown)
        if (part.startsWith("***")) return <strong key={key}><i>{part.slice(3, -3)}</i></strong>;
        if (part.startsWith("**")) return <strong key={key}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*")) return <i key={key}>{part.slice(1, -1)}</i>;
        if (part.startsWith("~~")) return <del key={key} className="opacity-60">{part.slice(2, -2)}</del>;
        if (part.startsWith("`")) return <code key={key} className="bg-[#2b2d31] px-1 rounded font-mono text-sm">{part.slice(1, -1)}</code>;

        // Links and Images
        const linkMatch = part.match(/^(!?)\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
            const [_, isImg, label, url] = linkMatch;
            if (isImg) return <img key={key} src={url} alt={label} className="max-w-full rounded-lg my-2 border border-white/10" />;
            return <Link key={key} href={url} target="_blank" title={url} className="text-blue-400 hover:underline">{label}</Link>;
        }

        // Shortcodes
        if (part.startsWith(":")) {
            const code = part.slice(1, -1);
            if (SHORTCODE_MAP[code]) return SHORTCODE_MAP[code];
        }

        return <Fragment key={key}>{part}</Fragment>;
    });
}