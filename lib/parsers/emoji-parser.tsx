import {CDN_URL} from "@/lib/constants.ts";


const SHORTCODE_MAP: Record<string, string> = {
    "thumbsup": "👍", "smile": "😄", "heart": "❤️", "skull": "💀"
};

export function parseEmojis(part: string, key: string) {
    // Custom Emoji Check
    const customEmojiMatch = part.match(/<(a?):([a-zA-Z0-9_]+):(\d+)>/);
    if (customEmojiMatch) {
        const [_, animated, name, id] = customEmojiMatch;
        const ext = animated ? "gif" : "png";
        return (
            <img
                key={key}
                src={`${CDN_URL}/emojis/${id}.${ext}`}
                alt={name}
                className="inline-block w-6 h-6 align-bottom object-contain mx-0.5"
            />
        );
    }

    // Shortcode Check
    if (part.startsWith(":") && part.endsWith(":")) {
        const code = part.slice(1, -1).toLowerCase();
        if (SHORTCODE_MAP[code]) return <span key={key}>{SHORTCODE_MAP[code]}</span>;
    }

    return null;
}