import {FlockMember, FlockUserProfile} from "@/lib/models.ts";
import {useEffect, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {CDN_URL} from "@/lib/constants.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {parseMarkdown} from "@/lib/parsers/markdown-parser.tsx";


export interface UserPopupProps {
    user: FlockMember;
    userId: string;
    children?: React.ReactNode;
}

export function UserPopup({ user, userId, children }: UserPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [fullProfile, setFullProfile] = useState<FlockUserProfile | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);

    useEffect(() => {
        if (isOpen && !fullProfile) {
            setIsLoadingProfile(true);

            spacebarFetch(`users/${userId}`)
                .then((data: FlockUserProfile) => {
                    setFullProfile(data);
                })
                .catch(err => console.error("Failed to load user profile", err))
                .finally(() => setIsLoadingProfile(false));
        }
    }, [isOpen, userId, fullProfile]);

    const displayName = user?.displayName || `Unknown User`;
    const avatarUrl = user?.avatarUrl || "";
    const color = user?.color || "#5865F2";
    const banner = fullProfile?.banner || user?.banner || null;

    const displayBio = fullProfile?.bio || user?.bio;
    const displayPronouns = fullProfile?.pronouns || user?.pronouns;
    const hasBanner = banner !== null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background-chat border-white/10 text-white p-0 overflow-hidden shadow-2xl">
                <>
                    {/* Header/Banner Area */}
                    <div
                        className="h-16 w-full flex"
                        style={{ backgroundColor: color }}
                    >
                        {hasBanner && (
                            <img src={`${CDN_URL}/banners/${userId}/${banner}.png`} alt="Banner image" className="flex-1" />
                        )}
                    </div>
                    <div className="px-4 pb-4 z-1">
                        <div className="relative -mt-8 mb-2">
                            <Avatar className="size-20 border-4 border-background-chat">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback className="bg-primary-300 text-xl">
                                    {displayName || user?.initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <h2 className="text-xl font-bold">{displayName || user?.initials || "unknown-user"}</h2>
                        <p className="text-gray-400 text-sm">
                            {user?.username || "unknown"}#{user?.discriminator || "????"}
                        </p>
                        {user?.pronouns && (
                            <p className="text-xs text-gray-500">{displayPronouns}</p>
                        )}
                        <hr className="my-3 border-white/5" />
                        {isLoadingProfile ? (
                            <div className="animate-pulse flex flex-col gap-2">
                                <Skeleton className="h-2 bg-white/10 rounded w-1/4" />
                                <Skeleton className="h-2 bg-white/10 rounded w-3/4" />
                                <Skeleton className="h-2 bg-white/10 rounded w-1/2" />
                            </div>
                        ): (
                            <>
                                {displayBio ? (
                                    <>
                                        <p className="text-sm uppercase mb-1 font-bold text-gray-500">Bio</p>
                                        <div className="text-sm text-gray-200 whitespace-pre-wrap">
                                            {parseMarkdown(displayBio, "")}
                                        </div>
                                        <hr className="my-3 border-white/5" />
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm uppercase mb-1 font-bold text-gray-500">Bio</p>
                                        <div className="text-sm text-gray-400 whitespace-pre-wrap">
                                            This user does not have any bio
                                        </div>
                                        <hr className="my-3 border-white/5" />
                                    </>
                                )}
                                <p className="text-xs text-gray-500 uppercase font-bold mb-1">User ID</p>
                                <p className="text-xs font-mono text-gray-400">{userId}</p>
                            </>
                        )}

                    </div>
                </>
            </PopoverContent>
        </Popover>
    )
}