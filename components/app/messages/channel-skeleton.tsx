import { Skeleton } from "@/components/ui/skeleton";

export function ChannelSkeleton() {
    return (
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
            <div className="space-y-4 mx-auto max-w-4xl">
                {/* Message Skeleton 1 */}
                <div className="flex gap-3">
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

                {/* Message Skeleton 2 */}
                <div className="flex gap-3">
                    <Skeleton className="rounded-full w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-32 h-4" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-2/3 h-4" />
                    </div>
                </div>

                {/* Message Skeleton 3 */}
                <div className="flex gap-3">
                    <Skeleton className="rounded-full w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-28 h-4" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                        <Skeleton className="w-5/6 h-4" />
                    </div>
                </div>

                {/* Message Skeleton 4 */}
                <div className="flex gap-3">
                    <Skeleton className="rounded-full w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-36 h-4" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                        <Skeleton className="w-4/5 h-4" />
                        <Skeleton className="w-3/5 h-4" />
                    </div>
                </div>

                {/* Message Skeleton 5 */}
                <div className="flex gap-3">
                    <Skeleton className="rounded-full w-10 h-10" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-28 h-4" />
                            <Skeleton className="w-16 h-3" />
                        </div>
                        <Skeleton className="w-11/12 h-4" />
                        <Skeleton className="w-2/3 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
