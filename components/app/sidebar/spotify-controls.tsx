"use client";

import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
    ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";

export default function SpotifyControls() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(80);
    const [duration, setDuration] = useState(189);
    const [isDragging, setIsDragging] = useState(false);

    const [open, setOpen] = useState(true);

    const progressBarRef = useRef<HTMLDivElement>(null);

    const songInfo = {
        name: "My Song",
        artist: "My Artist",
        album: "My Album",
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setCurrentTime(percentage * duration);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleProgressClick(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        setCurrentTime(percentage * duration);
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        if (!isDragging) return;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setCurrentTime((prev) => {
                if (prev >= duration) {
                    setIsPlaying(false);
                    return duration;
                }
                return prev + 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    const progress = (currentTime / duration) * 100;

    return (
        <Collapsible
            open={open}
            onOpenChange={setOpen}
            className="border-b border-b-subtle/20 w-full"
        >
            {/* Header row (always visible) */}
            <div className="flex items-center gap-2 p-2 w-full">
                <div className="bg-background-app shadow-2xl rounded-lg size-12 overflow-hidden" />

                <div className="min-w-0 text-left">
                    <h2 className="font-bold text-white text-sm truncate">
                        {songInfo.name}
                    </h2>
                    <p className="text-gray-400 text-xs truncate">
                        {songInfo.artist}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                        {songInfo.album}
                    </p>
                </div>

                <CollapsibleTrigger asChild>
                    <button
                        type="button"
                        className="group inline-flex justify-center items-center ml-auto p-2 rounded-md text-gray-400 hover:text-white transition-colors cursor-pointer"
                        aria-label={
                            open
                                ? "Collapse player controls"
                                : "Expand player controls"
                        }
                    >
                        <ChevronDown className="size-4 group-data-[state=open]:rotate-180 transition-transform" />
                    </button>
                </CollapsibleTrigger>
            </div>

            {/* Collapsible body */}
            <CollapsibleContent className="px-2 pb-2 w-full overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                {/* Progress Bar */}
                <div className="my-2">
                    <div
                        ref={progressBarRef}
                        className="group relative bg-gray-700 rounded-full h-1 cursor-pointer"
                        onClick={handleProgressClick}
                        onMouseDown={handleMouseDown}
                    >
                        <div
                            className="absolute bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full h-full"
                            style={{ width: `${progress}%` }}
                        />
                        <div
                            className="top-1/2 absolute bg-foreground opacity-100 shadow-lg rounded-full w-4 h-4 -translate-y-1/2"
                            style={{
                                left: `${progress}%`,
                                transform: "translate(-50%, -0%)",
                            }}
                        />
                    </div>
                </div>

                {/* Time Labels */}
                <div className="flex justify-between mb-2 text-gray-400 text-xs">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-6">
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Shuffle size={12} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipBack size={16} />
                    </button>
                    <button
                        className="rounded-full text-gray-400 hover:scale-105 transition-transform"
                        onClick={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Pause size={16} className="fill-gray-400" />
                        ) : (
                            <Play size={16} className="fill-gray-400" />
                        )}
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <SkipForward size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Repeat size={12} />
                    </button>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}
