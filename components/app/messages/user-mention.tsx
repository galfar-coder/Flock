import {FlockMember} from "@/lib/models.ts";
import {UserPopup} from "@/components/app/profile/user-popup.tsx";

interface UserMentionProps {
    user: FlockMember;
    userId: string;
}

export function UserMention({
    user,
    userId
}: UserMentionProps) {

    return (
        <UserPopup user={user} userId={userId}>
            <span className="bg-[#5865F2]/20 text-[#c9cdfb] hover:bg-[#5865F2]/40 hover:text-white px-1 rounded-[3px] font-medium cursor-pointer transition-colors inline-block">
                @{user?.displayName || "unknown-user"}
            </span>
        </UserPopup>
    );
}