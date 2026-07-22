// lib/parsers/index.tsx
import { ReactNode } from "react";
import { parseMarkdown } from "./markdown-parser";
import {FlockCombinedChannel, FlockMember, FlockRole, FlockUser} from "@/lib/models.ts";

export function parseMessageContent(
    content: string,
    serverId: string,
    mentions?: FlockMember[],
    roles?: FlockRole[],
    channels?: FlockCombinedChannel[]
): ReactNode {
    return parseMarkdown(content, serverId, mentions, roles, channels);
}