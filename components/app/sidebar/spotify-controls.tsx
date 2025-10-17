"use client";

import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Repeat,
    Shuffle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function SpotifyControls() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(80); // 01:20 in seconds
    const [duration, setDuration] = useState(189); // 03:09 in seconds
    const [isDragging, setIsDragging] = useState(false);

    const progressBarRef = useRef<HTMLDivElement>(null);

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    // Handle progress bar click
    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        setCurrentTime(percentage * duration);
    };

    // Handle progress bar drag
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleProgressClick(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        setCurrentTime(percentage * duration);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            };
        }
    }, [isDragging]);

    // Simulate playback
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
        <div className="flex flex-col justify-center items-center p-2 border-b border-b-subtle/20 w-full">
            <div className="flex items-center gap-2 mb-4 w-full">
                {/* Album Art */}

                <div className="bg-background-app shadow-2xl rounded-lg size-12 overflow-hidden"></div>

                {/* Song Info */}
                <div className="text-left">
                    <h2 className="font-bold text-white text-sm">Given Up</h2>
                    <p className="text-gray-400 text-xs">Linkin Park</p>
                    <p className="text-gray-500 text-xs">Minutes to Midnight</p>
                </div>
            </div>
            <div className="w-full">
                {/* Progress Bar */}
                <div className="mb-1">
                    <div
                        ref={progressBarRef}
                        className="group relative bg-gray-700 rounded-full h-1 cursor-pointer"
                        onClick={handleProgressClick}
                        onMouseDown={handleMouseDown}
                    >
                        {/* Progress */}
                        <div
                            className="absolute bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full h-full"
                            style={{ width: `${progress}%` }}
                        />
                        {/* Thumb */}
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
                <div className="flex justify-center items-center gap-6 mb-4">
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
            </div>
        </div>
    );
}
