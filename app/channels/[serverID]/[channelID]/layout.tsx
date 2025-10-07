import { ChannelHeader } from "@/components/app/channel-header/channel-header";
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
        <div className="flex flex-col p-3 h-screen min-h-dvh">
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
            <div className="flex justify-between items-center p-3 border-accent border-t-2 overflow-x-scroll">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-accent rounded-full size-15"
                    ></div>
                ))}
            </div>
        </div>
    );
}
