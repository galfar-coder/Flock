"use client";

import { ChannelHeader } from "@/components/app/channel-header/channel-header";
import { ChannelsList } from "@/components/app/channels-list/channels-list";
import { InputField } from "@/components/app/input/input";
import { ChannelSkeleton } from "@/components/app/messages/channel-skeleton";
import { Sidebar } from "@/components/app/sidebar/sidebar";
import { Suspense } from "react";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex flex-col p-3 h-screen min-h-dvh overflow-hidden">
            <div className="flex rounded-t-2xl h-full overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1">
                    <ChannelHeader />
                    <Suspense fallback={<ChannelSkeleton />}>
                        {children}
                    </Suspense>
                    <InputField />
                </div>
            </div>
            <ChannelsList />
        </section>
    );
}
