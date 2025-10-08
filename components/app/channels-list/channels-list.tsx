import { useRef, useEffect } from "react";

export function ChannelsList() {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (scrollRef.current) {
                e.preventDefault();
                scrollRef.current.scrollLeft += e.deltaY;
            }
        };

        const element = scrollRef.current;
        if (element) {
            element.addEventListener("wheel", handleWheel, { passive: false });
        }

        return () => {
            if (element) {
                element.removeEventListener("wheel", handleWheel);
            }
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className="flex items-center gap-3 p-3 border-accent border-t-2 overflow-x-auto overflow-y-hidden"
        >
            {[...Array(40)].map((_, i) => (
                <div
                    key={i}
                    className="flex-shrink-0 bg-accent rounded-full size-15"
                ></div>
            ))}
        </div>
    );
}
