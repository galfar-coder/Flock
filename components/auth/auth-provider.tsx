"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Provides next-auth session provider to the application.
 * @param {React.ReactNode} children - The content to be wrapped with the session provider.
 * @returns {JSX.Element} - The wrapped content.
 */
export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SessionProvider>{children}</SessionProvider>;
}
