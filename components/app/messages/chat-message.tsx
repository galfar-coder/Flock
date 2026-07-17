import {useState} from "react";
import Image from "next/image";
import { parseMessageContent } from "@/lib/parsers";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, MessageSquareReply, Trash2, Edit2 } from "lucide-react";
import {ImageAttachment} from "@/components/app/messages/image-attachment.tsx";
import {useAuth} from "@/components/auth/auth-provider.tsx";
import {decodeBase64Safe} from "@/lib/utils/base64.ts";
import {StickerAttachment} from "@/components/app/messages/sticker-attachment.tsx";
import {API} from "@spacebarchat/spacebar-ts";
import {enhanceUser, FlockChannel, FlockMember, FlockMessage, FlockRole, FlockUser} from "@/lib/models.ts";
import {UserPopup} from "@/components/app/profile/user-popup.tsx";

interface ChatMessageProps {
    message: FlockMessage;
    serverId: string;
    serverMembers: FlockMember[];
    serverRoles: FlockRole[];
    serverChannels: FlockChannel[];
    showHeader: boolean;
    replyToMessage?: FlockMessage | null;
}

export function ChatMessage({
    message,
    serverId,
    serverMembers,
    serverRoles,
    serverChannels,
    showHeader,
    replyToMessage

}: ChatMessageProps) {

    // Whether the message is currently hovered
    const [isHovered, setIsHovered] = useState(false);

    const { user } = useAuth();

    const isAuthor = message.author?.id === user?.id;

    const memberProfile = serverMembers?.find(m => m.id === message.author?.id);

    let timeStrTime = "";
    if (message.dateTimestamp) {
        timeStrTime = message.dateTimestamp.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: false,
        });
    }

    const isEdited  = message.editedDate ? " (edited)" : "";
    const timeStr = `${timeStrTime}${isEdited}`;


    let decodedNonce: string | null = null;
    try {
        decodedNonce = decodeBase64Safe(message?.nonce as string);
    } catch {
        decodedNonce = null;
    }

    let clientName = "Unknown"
    if (decodedNonce) {
        if (decodedNonce.match(/^\d{1,10}$/)) clientName = "Fermi";
        else if (decodedNonce.toLowerCase().startsWith("fermo-")) clientName = "Fermo";
        else if (decodedNonce.toLowerCase().startsWith("hoshika-")) clientName = "Hoshika";
        else if (decodedNonce.toLowerCase().startsWith("hoshi-")) clientName = "Hoshi";
        else if (decodedNonce.toLowerCase().startsWith("pax-")) clientName = "Pax";
        else if (decodedNonce.toLowerCase().startsWith("flock")) clientName = "Flock";
        else if (decodedNonce.toLowerCase().startsWith("papillon-")) clientName = "Papillon";
        else if (decodedNonce.toLowerCase().startsWith("fuzzyclient-")) clientName = "FuzzyClient";
    } else {
        if (message.nonce?.toString().toLowerCase().startsWith("pax-")) clientName = "Pax";
        else if (message.nonce?.toString().toLowerCase().startsWith("papillon-")) clientName = "Papillon";
    }

    const specialClients = [
        "Papillon",
        "FuzzyClient"
    ]

    const mentions = message.mentions.map(m =>
        serverMembers?.find(sm => sm.id === m.id) || m as FlockMember
    )
    //console.log("mentions", mentions);

    const handleCopyId = () => navigator.clipboard.writeText(message.id);
    const handleCopyMsgLink = () => navigator.clipboard.writeText(`${window.location}/${message.id}`);
    const handleCopyText = () => navigator.clipboard.writeText(message.content || "");
    const handleReply = () => console.log("Reply to:", message.id);
    const handleDelete = () => console.log("Delete:", message.id);

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <div
                    className={`group flex flex-col hover:bg-primary-100/10 px-4 rounded-lg transition-colors ${
                        showHeader ? "mt-4 py-1.5" : "py-0.5"
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Reply Context */}
                    {replyToMessage && showHeader && <ReplyContext replyTo={replyToMessage} />}

                    <div className="flex gap-3">
                        {/* Avatar Column */}
                        <div className="flex-shrink-0 w-10 flex justify-center mt-0.5">
                            {showHeader ? (
                                <Avatar author={message.authorUser} />
                            ) : (
                                <span className={`text-[10px] text-gray-400 mt-1 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
                                    {timeStr}
                                </span>
                            )}
                        </div>

                        {/* Content Column */}
                        <div className="flex-1 min-w-0">
                            {/* Header (Name, Time) */}
                            {showHeader && <MessageHeader author={message.authorUser} timeStr={timeStr} editedTimestamp={message.editedDate} />}

                            {/* The actual message content. */}
                            <div className="flex items-center text-md text-muted-foreground break-words tracking-wide whitespace-pre-wrap leading-relaxed">
                                {parseMessageContent(message.content || "", serverId, mentions, serverRoles, serverChannels)}
                            </div>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="flex flex-nowrap gap-2 mt-1">
                                    {message.imageAttachments.map((attachment) => (
                                        <ImageAttachment key={attachment.id} attachment={attachment} />
                                    ))}
                                </div>
                            )}

                            {message.stickers && message.stickers.length > 0 && (
                                <div className="flex flex-nowrap gap-2 mt-1">
                                    {message.stickers.map((sticker) => (
                                        <StickerAttachment key={sticker.id} sticker={sticker} />
                                    ))}
                                </div>
                            )}

                            {/* Embeds, etc. will go here */}
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-48 bg-background-chat border-white/10 text-gray-200">
                <ContextMenuItem onClick={handleReply} className="cursor-pointer gap-2 focus:bg-white/10">
                    <MessageSquareReply size={16} /> Reply
                </ContextMenuItem>
                <ContextMenuItem className="cursor-pointer gap-2 focus:bg-white/10">
                    <Edit2 size={16} /> Edit Message
                </ContextMenuItem>

                <ContextMenuSeparator className="bg-white/10" />

                <ContextMenuItem onClick={handleCopyText} className="cursor-pointer gap-2 focus:bg-white/10">
                    <Copy size={16} /> Copy Text
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCopyMsgLink} className="cursor-pointer gap-2 focus:bg-white/10 text-gray-400">
                    <Copy size={16} /> Copy Message Link
                </ContextMenuItem>
                <ContextMenuItem onClick={handleCopyId} className="cursor-pointer gap-2 focus:bg-white/10 text-gray-400">
                    <Copy size={16} /> Copy Message ID
                </ContextMenuItem>

                {isAuthor && (<ContextMenuSeparator className="bg-white/10"/>)}

                {isAuthor && (<ContextMenuItem onClick={handleDelete}
                                  className="cursor-pointer gap-2 text-red-500 focus:bg-red-500/20 focus:text-red-500">
                    <Trash2 size={16}/> Delete Message
                </ContextMenuItem>)}

                {!message.author?.bot && (<ContextMenuSeparator className="bg-white/10"/>)}

                {!message.author?.bot && (<ContextMenuItem className="cursor-pointer gap-2 focus:bg-white/10 text-gray-400" disabled={true}>
                    {specialClients.includes(clientName) ? (
                        <>
                            Sent via: FuzzyClient
                            <span className="animate-bounce">🐾</span>
                            <span className="hidden font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{clientName}</span>
                        </>
                    ) : (
                        <>Sent via {clientName}</>
                    )}

                </ContextMenuItem>)}

            </ContextMenuContent>
        </ContextMenu>
    );
}

/// SUB COMPONENTS ///

function Avatar({ author }: { author: FlockMember }) {
    return (
        <div className="flex justify-center items-center bg-primary-300 rounded-full size-10 font-semibold text-white overflow-hidden">
            {author.avatarUrl ? (
                <Image width={40} height={40} src={author.avatarUrl} alt={author.username} className="size-full object-cover" />
            ) : (
                <span>{author!.initials}</span>
            )}
        </div>
    );
}

function MessageHeader({ author, timeStr, editedTimestamp }: { author: FlockMember, timeStr: string, editedTimestamp: Date | null }) {
    return (
        <div className="flex items-baseline gap-2 mb-0.5">
            <UserPopup user={author} userId={author.id} >
                <div>
                    <span className="font-bold text-gray-100 hover:underline cursor-pointer">
                        {author.displayName ? author.displayName : "unknown-user"}
                    </span>
                        {author && author.bot && (
                            <span className="rounded-[3px] bg-[#5865F2] text-white text-[10px] font-bold px-1 py-0.5 flex items-center justify-center">
                        BOT
                    </span>
                        )}
                    <span className="text-gray-400 text-xs font-medium">
                        {timeStr}
                    </span>
                </div>
            </UserPopup>
        </div>
    );
}

function ReplyContext({ replyTo }: { replyTo: FlockMessage }) {
    return (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1 ml-10 relative">
            <div className="absolute -left-7 top-1.5 w-6 h-3 border-l-2 border-t-2 border-gray-600 rounded-tl-lg" />
            <span className="font-semibold cursor-pointer hover:underline">
                @{replyTo.authorUser?.displayName || "unknown-user"}
            </span>
            <span className="truncate max-w-sm">{replyTo.content}</span>
        </div>
    );
}