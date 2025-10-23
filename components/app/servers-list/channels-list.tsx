import { useRef, useEffect, useState } from "react";
import { BellOff, MailOpen } from "lucide-react";

export function ServersList() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        scrollRef.current.style.cursor = "grabbing";
        scrollRef.current.style.userSelect = "none";
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollRef.current) scrollRef.current.style.cursor = "grab";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    // Wheel → horizontal scroll
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <div className="relative flex items-center bg-background-chat border-app rounded-2xl overflow-hidden">
            {/* Channels icon panel */}
            <div className="z-20 flex items-center gap-2 bg-background-app p-3 border-r border-r-subtle/20 rounded-r-2xl">
                <div className="bg-background-chat rounded-full size-15"></div>
                <div className="flex flex-col items-center gap-4 pl-3 border-l border-l-subtle/20 h-full text-muted-foreground">
                    <BellOff size={20} />
                    <MailOpen size={20} />
                </div>
            </div>

            {/* Scrollable list */}
            <div
                ref={scrollRef}
                className="relative flex items-center gap-3 p-4 overflow-x-auto overflow-y-hidden touch-auto cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                {[...Array(40)].map((_, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 bg-background-app rounded-3xl size-15"
                    />
                ))}

                {/* End marker for scroll-to-end if needed */}
                <div className="flex-shrink-0 w-px" />
            </div>

            {/* Left gradient mask */}
            <div className="left-31 absolute inset-y-0 bg-gradient-to-r from-background-chat to-transparent w-[2%] pointer-events-none" />

            {/* Right gradient mask */}
            <div className="right-0 absolute inset-y-0 bg-gradient-to-l from-background-chat to-transparent w-[2%] pointer-events-none" />
        </div>
    );
}
