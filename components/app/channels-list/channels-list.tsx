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
        <div className="flex items-center bg-background-chat border-app rounded-2xl overflow-hidden">
            <div className="bg-background-app p-3 rounded-r-full">
                <div className="bg-background-chat rounded-full size-15"></div>
            </div>
            <div
                ref={scrollRef}
                className="relative flex items-center gap-3 p-3 border-t-2 border-background-chat overflow-x-auto overflow-y-hidden"
            >
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 bg-background-app rounded-3xl size-15"
                    ></div>
                ))}
            </div>
        </div>
    );
}
