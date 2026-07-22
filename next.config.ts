import type { NextConfig } from "next";
import {CDN_URL} from "@/lib/constants.ts";

const nextConfig: NextConfig = {
  /* config options here */
    async rewrites() {
        return [
            {
                source: "/api/v9/:path*",
                destination: "https://api.spacebar.chat/api/v9/:path*"
            },
        ]
    },
    images: {
        remotePatterns: [
            new URL(`${CDN_URL}/**`),
            {
                protocol: "https",
                hostname: "cdn.rory.server.spacebar.chat",
                port: "",
                pathname: "/**"
            },
        ],
    },
};

export default nextConfig;
