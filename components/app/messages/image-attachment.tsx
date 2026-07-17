import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {Description, DialogTitle} from "@radix-ui/react-dialog";
import {FlockAttachment} from "@/lib/models.ts";


export function ImageAttachment({ attachment }: { attachment: FlockAttachment }) {
    if (!attachment.url) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative mt-2 cursor-pointer overflow-hidden rounded-lg border border-white/10 max-w-sm max-h-80 w-fit">
                    <img
                        src={attachment.url}
                        alt={attachment.filename || "Attachment"}
                        className="object-contain max-h-80 w-auto h-auto transition-transform hover:scale-[1.02]"
                        loading="lazy"
                    />
                </div>
            </DialogTrigger>
            <DialogContent
                className="max-w-7xl w-full h-screen bg-transparent border-none shadow-none flex justify-center items-center"
            >
                <Description className="hidden"></Description>
                <DialogTitle className="hidden text-lg leading-tight"></DialogTitle>
                <img
                    src={attachment.url}
                    alt={attachment.filename || "Attachment"}
                    className="max-w-full max-h-[90vh] object-contain rounded-md"
                />
                <a
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 text-sm text-blue-400 hover:underline bg-black/50 px-3 py-1 rounded-full"
                >
                    Open original
                </a>
            </DialogContent>
        </Dialog>
    )
}