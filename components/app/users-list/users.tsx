import {useParams} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {spacebarFetch} from "@/lib/api-client.ts";
import {useWebSocket} from "@/components/websocket/websocket-manager.tsx";
import Image from "next/image";
import {CDN_URL} from "@/lib/constants.ts";
import {getAvatarUrl} from "@/lib/utils/avatars.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {API} from "@spacebarchat/spacebar-ts";
import {FlockMember, FlockRole, FlockUser} from "@/lib/models.ts";
import {UserPopup} from "@/components/app/profile/user-popup.tsx";

export default function UserList() {
    const params = useParams();
    const serverId = decodeURIComponent(params.serverId as string);
    const channelId = params.channelId as string;

    const { requestMembers, guildMembers, isReady } = useWebSocket();

    const [roles, setRoles] = useState<FlockRole[]>([]);
    const [loading, setLoading] = useState(true);

    const rawMembers = guildMembers[serverId] as FlockMember[];

    const groupedData = useMemo(() => {
        const groups: Record<string, FlockMember[]> = {};
        if (!rawMembers) {
            setLoading(true);
            return groups;
        } else {
            if (loading) setLoading(false);
        }

        if (serverId === "@me") return groups;

        const seenUserIds = new Set<string>();

        // Sort roles by position
        const sortedRoles = [...roles].sort((a, b) => b.position - a.position);
        // Separate Members Into Online / Offline
        const onlineMembers = rawMembers.filter(m => m.presence?.status !== "offline");
        const offlineMembers = rawMembers.filter(m => m.presence?.status === "offline");
        // Assign each user their highest role
        sortedRoles.forEach((role) => {
            const roleId = String(role.id);

            const membersInRole = onlineMembers.filter(m => {
                const member = m as FlockMember;
                // If user has a higher role, skip him
                if (seenUserIds.has(member.id)) return false;

                const hasRole = member.roles?.some(r => String(r) === roleId) || roleId === serverId;

                if (hasRole) {
                    seenUserIds.add(m.id); // Role assigned
                    return true;
                }
                return false;
            });

            if (membersInRole.length > 0) {
                groups[roleId] = membersInRole;
            }
        });

        groups["offline"] = offlineMembers;

        return groups;
    }, [roles, rawMembers, serverId]);

    // Presence Helpers
    const statusColors: Record<string, string> = {
        online: "bg-green-500",
        idle: "bg-yellow-500",
        dnd: "bg-red-500",
        offline: "bg-gray-500"
    };

    useEffect(() => {
        if (!isReady || !serverId || serverId === "@me" || !channelId) return;

        let isMounted = true;

        async function fetchMemberData() {
            setLoading(true);
            try {
                const rolesData = await spacebarFetch(`guilds/${serverId}/roles`);

                const sortedRoles = (rolesData as API.Role[])
                    .sort((a, b) => b.position - a.position);

                setRoles(sortedRoles);

                requestMembers(serverId, channelId);
            } catch (err) {
                console.error("Failed to load user list", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchMemberData();

        return () => { isMounted = false; };
    }, [isReady, serverId, channelId, requestMembers]);

    if (serverId === "@me") return null;
    if (loading) return (
        <div className="hidden md:flex md:flex-col bg-background-chat border-app rounded-2xl w-60 h-full text-gray-100">
            <div className="flex flex-col gap-6 p-4">
                {/* Mocking two different role sections for a better look */}
                {[...Array(2)].map((_, roleIndex) => (
                    <div key={roleIndex} className="flex flex-col gap-3">
                        {/* Role Header Skeleton */}
                        <Skeleton className="h-3 w-32 bg-white/5" />

                        <div className="flex flex-col gap-2">
                            {/* Mocking 5 members per role */}
                            {[...Array(5)].map((_, memberIndex) => (
                                <div key={memberIndex} className="flex items-center gap-3 py-1">
                                    {/* Avatar Skeleton */}
                                    <Skeleton className="h-8 w-8 rounded-full shrink-0 bg-white/5" />

                                    {/* Username Skeleton */}
                                    <Skeleton className="h-4 w-28 bg-white/5" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="hidden md:flex md:flex-col bg-background-chat border-app rounded-2xl w-60 h-full text-gray-100">
            <div className="flex-col items-start p-4 overflow-y-auto">
                {roles.map((role) => {
                    const list = groupedData[String(role.id)];
                    if (!list) return null;

                    return (
                        <div key={role.id}>
                            <span className="mb-4 text-gray-400 text-sm uppercase tracking-wide">
                                {role.name} - {list.length}
                            </span>
                            {list.map((member: FlockMember) => {
                                return (
                                    <UserPopup key={member.id} user={member} userId={member.id}>
                                        <div key={member.id} className="flex items-center gap-2 my-3 cursor-pointer">
                                            <div className="flex relative bg-primary-300 rounded-full size-8 justify-center items-center aspect-square">
                                                {member.avatarUrl ? (
                                                    <Image
                                                        width={32}
                                                        height={32}
                                                        src={member.avatarUrl}
                                                        alt={member.displayName}
                                                        className="object-cover rounded-full aspect-square"
                                                    />
                                                ) : member.initials}
                                                <div className={`right-0 bottom-0 absolute ${statusColors[member.presence?.status || "offline"]} border border-accent rounded-full size-3`}>
                                                </div>
                                            </div>
                                            <div
                                                className="text-ellipsis line-clamp-1"
                                                style={{ color: role.color
                                                        ? `#${role.color.toString(16).padStart(6, '0')}`
                                                        : "#FF0000" }}
                                            >{member.displayName}</div>
                                        </div>
                                    </UserPopup>
                                )
                            })}
                        </div>
                    )
                })}
                {Array.from([0]).map(i => {
                    const list = groupedData["offline"];
                    if (!list) return null;
                    if (list.length === 0) return null;

                    return (
                        <div key={i}>
                            <span className="mb-4 text-gray-400 text-sm uppercase tracking-wide">
                                Offline - {list.length}
                            </span>
                            {list.map((member: FlockMember) => {
                                return (
                                    <UserPopup key={member.id+Math.random()*4} user={member} userId={member.id}>
                                        <div className="flex items-center gap-2 py-1 cursor-pointer">
                                            <div className="flex relative bg-primary-300 rounded-full size-8 justify-center items-center aspect-square">
                                                {member.avatarUrl ? (
                                                    <Image
                                                        width={32}
                                                        height={32}
                                                        src={member.avatarUrl}
                                                        alt={member.displayName}
                                                        className="object-cover rounded-full aspect-square"
                                                    />
                                                ) : member.initials}
                                                <div className={`right-0 bottom-0 absolute ${statusColors["offline"]} border border-accent rounded-full size-3`}>
                                                </div>
                                            </div>
                                            <div
                                                className="text-ellipsis line-clamp-1 text-gray-600"
                                            >{member.displayName}</div>
                                        </div>
                                    </UserPopup>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
