// lib/parsers/markdown-parser.tsx
import { parseInline } from "@/lib/parsers/inline";
import { ReactNode } from "react";
import {FlockCombinedChannel, FlockMember, FlockRole, FlockUser} from "@/lib/models.ts";

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export function parseMarkdown(
    content: string,
    serverId: string,
    mentions?: FlockMember[],
    roles?: FlockRole[],
    channels?: FlockCombinedChannel[]
): ReactNode {
    if (!content) return null;

    const lines = content.split("\n");
    const result: ReactNode[] = [];

    let i = 0;
    while (i < lines.length) {
        const line = lines[i];

        // Fenced Code Blocks
        if (line.startsWith("```")) {
            let code = "";
            i++;
            while (i < lines.length && !lines[i].startsWith("```")) {
                code += lines[i] + "\n";
                i++;
            }
            result.push(
                <pre key={`code-${i}`} className="bg-[#1e1f22] p-3 rounded-md font-mono text-sm my-2 overflow-x-auto border border-white/5 whitespace-pre">
                    <code>{code.trim()}</code>
                </pre>
            );
            i++; continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const Tag = `h${level}` as HeadingTag;
            const sizes: Record<number, string> = { 1: 'text-2xl', 2: 'text-xl', 3: 'text-lg', 4: 'text-base', 5: 'text-sm', 6: 'text-xs' };
            result.push(<Tag key={`h-${i}`} className={`${sizes[level]} font-bold mt-4 mb-2 border-b border-white/5 pb-1`}>{parseInline(headingMatch[2], serverId, mentions, roles, channels)}</Tag>);
            i++; continue;
        }

        // Small Text (-#)
        if (line.startsWith("-# ")) {
            result.push(<small key={`s-${i}`} className="block text-gray-400 text-xs mt-1 leading-tight">{parseInline(line.slice(3), serverId, mentions, roles, channels)}</small>);
            i++; continue;
        }

        // Blockquotes
        if (line.startsWith("> ")) {
            let quoteLevel = 0;
            let currentLine = line;
            while (currentLine.startsWith("> ")) {
                quoteLevel++;
                currentLine = currentLine.slice(2);
            }
            result.push(
                <blockquote key={`q-${i}`} className="border-l-4 border-gray-600 pl-4 my-2 italic text-gray-400" style={{ marginLeft: `${(quoteLevel - 1) * 20}px` }}>
                    {parseInline(currentLine, serverId, mentions, roles, channels)}
                </blockquote>
            );
            i++; continue;
        }

        // Horizontal Rule
        if (line.trim() === "---") {
            result.push(<hr key={`hr-${i}`} className="my-4 border-white/10" />);
            i++; continue;
        }

        // Lists & Task Lists
        const listMatch = line.match(/^(\s*)-\s+(.*)/);
        if (listMatch) {
            const indent = listMatch[1].length;
            let text = listMatch[2];
            let checked = null;
            if (text.startsWith("[x] ")) { checked = true; text = text.slice(4); }
            else if (text.startsWith("[ ] ")) { checked = false; text = text.slice(4); }

            result.push(
                <div key={`li-${i}`} className="flex items-start gap-2" style={{ marginLeft: `${indent * 12}px` }}>
                    {checked !== null ? (
                        <input type="checkbox" readOnly checked={checked} className="mt-1" />
                    ) : (
                        <span className="text-gray-500 mt-0.5">•</span>
                    )}
                    <span>{parseInline(text, serverId, mentions, roles, channels)}</span>
                </div>
            );
            i++; continue;
        }

        // Ordered Lists
        const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)/);
        if (olMatch) {
            result.push(
                <div key={`ol-${i}`} className="flex gap-2" style={{ marginLeft: `${olMatch[1].length * 12}px` }}>
                    <span className="text-gray-500 min-w-[1.2rem]">{olMatch[2]}.</span>
                    <span>{parseInline(olMatch[3], serverId, mentions, roles, channels)}</span>
                </div>
            );
            i++; continue;
        }

        // Tables
        if (line.startsWith("|") && lines[i+1]?.includes("---")) {
            const headers = line.split("|").filter(Boolean).map(s => s.trim());
            const tableRows = [];
            i += 2;
            while(i < lines.length && lines[i].startsWith("|")) {
                tableRows.push(lines[i].split("|").filter(Boolean).map(s => s.trim()));
                i++;
            }
            result.push(
                <table key={`t-${i}`} className="w-full border-collapse my-4 text-sm">
                    <thead><tr className="bg-white/5">
                        {headers.map((h, k) => <th key={k} className="border border-white/10 p-2 text-left">{h}</th>)}
                    </tr></thead>
                    <tbody>
                    {tableRows.map((row, rk) => (
                        <tr key={rk}>{row.map((cell, ck) => <td key={ck} className="border border-white/10 p-2">{parseInline(cell, serverId, mentions, roles, channels)}</td>)}</tr>
                    ))}
                    </tbody>
                </table>
            );
            continue;
        }

        // Default Paragraph
        if (line.trim()) {
            result.push(<div key={`p-${i}`} className="min-h-[1.2rem]">{parseInline(line, serverId, mentions, roles, channels)}</div>);
        } else {
            result.push(<br key={`br-${i}`} />);
        }
        i++;
    }

    return <div className="markdown-body">{result}</div>;
}