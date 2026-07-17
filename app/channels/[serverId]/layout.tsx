"use client";

import { ChannelHeader } from "@/components/app/channel-header/channel-header.tsx";
import { ServersList } from "@/components/app/servers-list/servers-list.tsx";
import { ChannelSkeleton } from "@/components/app/messages/channel-skeleton.tsx";
import { Sidebar } from "@/components/app/sidebar/sidebar.tsx";
import { AddTab } from "@/components/app/tab/add-tab.tsx";
import { Tab } from "@/components/app/tab/tab.tsx";
import UserList from "@/components/app/users-list/users.tsx";
import { Suspense } from "react";

export default function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section
            className="flex flex-col gap-3 bg-background-app p-3 h-screen min-h-dvh overflow-hidden"
            suppressHydrationWarning
        >
            <div className="flex items-center gap-2 w-full">
                <Tab />
                <AddTab />
            </div>
            <div className="flex gap-3 rounded-t-2xl h-full overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 gap-3 overflow-hidden">
                    <ChannelHeader />
                    <div className="flex flex-1 items-center gap-3 h-full max-h-full overflow-hidden">
                        <Suspense fallback={<ChannelSkeleton />}>
                            {children}
                        </Suspense>
                        <UserList />
                    </div>
                </div>
            </div>
            <ServersList />
        </section>
    );
}
