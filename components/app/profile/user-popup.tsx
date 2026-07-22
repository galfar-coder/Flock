import {FlockMember, FlockUserProfile} from "@/lib/models.ts";
import {useEffect, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {CDN_URL} from "@/lib/constants.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {parseMarkdown} from "@/lib/parsers/markdown-parser.tsx";
import {cn} from "@/lib/utils.ts";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";


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
                    console.log("Got user profile data", data)
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
            <PopoverContent
                className={cn(
                    "relative border-white/10 text-white p-0 overflow-hidden shadow-2xl blur-in",
                    "w-[512px] aspect-video",
                    !hasBanner && "bg-background-chat"
                )}

            >
                {/* Banner Background/Color */}
                {hasBanner ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center -z-0"
                        style={{
                            backgroundImage: `url('${CDN_URL}/banners/${userId}/${banner}.png')`,
                        }}
                    />
                ) : (
                    <div
                        className="absolute inset-0 bg-cover bg-center -z-0"
                        style={{
                            backgroundColor: color,
                        }}
                    >

                    </div>
                )}

                {/* Background gradient for readablity */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent -z-0" />

                {/* Content */}
                <div className="relative z-10 h-full w-full p-4 grid grid-cols-2 gap-4 justify-between">
                    {/* Avatar / Badge / Dev Info */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="mb-2">
                                <Avatar className="size-20 border-4 border-background-chat shadow-xl">
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback className="bg-primary-300 text-xl">
                                        {displayName || user?.initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-shadow-accent text-shadow-xs w-min px-1 rounded-xl">
                                <h2 className="text-xl font-bold">{displayName || user?.initials || "unknown-user"}</h2>
                                <p className="text-stone-200 text-sm">
                                    {user?.username || "unknown"}#{user?.discriminator || "????"}
                                </p>
                                {user?.pronouns && (
                                    <p className="text-xs text-gray-500">{displayPronouns}</p>
                                )}
                            </div>
                        </div>
                        <div className="text-shadow-accent text-shadow-xs w-min px-1 rounded-xl group transition-all duration-200">
                            <p className="relative bottom-0 text-xs font-mono text-gray-400 line-clamp-1 cursor-pointer">
                                <span className="group-hover:hidden">User<span className="px-0.5" />ID</span>
                                <span className="invisible group-hover:visible">{userId}</span>
                            </p>
                        </div>
                    </div>
                    {/* Info Tabs */}
                    <div className="h-full flex flex-col gap-2 justify-between overflow-hidden">
                        {!isLoadingProfile ? (
                            <Tabs defaultValue="bio" className="flex flex-col h-full overflow-hidden">
                                <TabsList className="flex w-full shrink-0 gap-1">
                                    <TabsTrigger value="bio" className="uppercase" disabled={true}>Bio</TabsTrigger>
                                </TabsList>
                                <TabsContent
                                    value="bio"
                                    className="backdrop-blur-xs rounded-md p-3 bg-black/25 mt-2 flex-1 overflow-y-auto min-h-0 text-sm scrollbar-thin scrollbar-thumb-white/20 break-words"
                                >
                                    {displayBio ? (
                                        <div className="overflow-y-auto overflow-x-hidden">
                                            <div className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                                                {parseMarkdown(displayBio, "")}
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-sm text-gray-400 italic">
                                                This user does not have any bio
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="animate-pulse flex flex-col gap-2 justify-center h-full">
                                <Skeleton className="h-3 bg-white/10 rounded w-1/4" />
                                <Skeleton className="h-3 bg-white/10 rounded w-3/4" />
                                <Skeleton className="h-3 bg-white/10 rounded w-1/2" />
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}