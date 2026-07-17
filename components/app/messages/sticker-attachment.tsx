import {CDN_URL} from "@/lib/constants.ts";
import {FlockSticker} from "@/lib/models.ts";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";


export function StickerAttachment({ sticker }: { sticker: FlockSticker }) {
    if (!sticker) return null;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <img
                    src={`${CDN_URL}/stickers/${sticker.id}.png`}
                    title={`${sticker.name}`}
                    className="w-[150px] h-[150px] rounded-sm"
                />
            </PopoverTrigger>
            <PopoverContent side="right" className="w-full bg-background-app">
                <div className="m-1 flex flex-col">
                    <p>{sticker.name}</p>
                    {sticker.description && (
                        <>
                            <p>{sticker.description}</p>
                            <hr className="my-2" />
                        </>
                    )}
                    {sticker.tags && (<hr className="my-2" />)}
                    <div className="flex flex-nowrap">
                        {sticker.tags && (
                            <div>Emoji: {sticker.tags}</div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}