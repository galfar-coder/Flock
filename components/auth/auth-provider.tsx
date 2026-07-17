"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { spacebarFetch } from "@/lib/api-client.ts";
import { APIUser } from "discord-api-types/v9";
import {API} from "@spacebarchat/spacebar-ts";
import {FlockUser} from "@/lib/models.ts";

const AuthContext = createContext<{
    token: string | null,
    user: FlockUser | null,
    loading: boolean;
}>({
    token: null,
    user: null,
    loading: true
});

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
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<FlockUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved token
        const savedToken = localStorage.getItem("flock_token");

        async function initAuth() {
            if (savedToken) {
                setToken(savedToken);
                try {
                    const userData: FlockUser = await spacebarFetch("users/@me");
                    setUser(userData);
                } catch (err) {
                    console.error("Auth Initialization failed", err);
                    localStorage.removeItem("flock_token");
                }
            }
            setLoading(false);
        }

        initAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
    //return <SessionProvider>{children}</SessionProvider>;
}

export const useAuth = () => useContext(AuthContext);
