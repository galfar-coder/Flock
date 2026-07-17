

/**
 * Safely encodes a string into Base64.
 * Uses Buffer on the server (SSR) and TextEncoder + window.btoa on the client.
 */
export function encodeBase64Safe(str: string): string {
    // 1. Server-side (Node.js) - Satisfies the IDE completely
    if (typeof window === "undefined") {
        return Buffer.from(str, "utf8").toString("base64");
    }

    // 2. Client-side (Browser) - 'window.' removes the deprecated warning
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
    return window.btoa(binString);
}

/**
 * Safely decodes a Base64 string back into a UTF-8 string.
 * Uses Buffer on the server (SSR) and window.atob + TextDecoder on the client.
 */
export function decodeBase64Safe(base64: string): string {
    // 1. Server-side (Node.js)
    if (typeof window === "undefined") {
        return Buffer.from(base64, "base64").toString("utf8");
    }

    // 2. Client-side (Browser)
    const binString = window.atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.codePointAt(0)!);
    return new TextDecoder().decode(bytes);
}