import { Skeleton } from "@/components/ui/skeleton";

export function ChannelSkeleton() {
    return (
        <div className="flex-1 bg-background-chat p-4 overflow-y-auto">
            <div className="flex items-center gap-3">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-16 h-3" />
                    </div>
                    <Skeleton className="w-3/4 h-4" />
                    <Skeleton className="w-1/2 h-4" />
                </div>
            </div>
        </div>
    );
}
