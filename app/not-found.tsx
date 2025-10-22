"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex items-center bg-background px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 min-h-screen">
            <div className="absolute inset-0 opacity-20">
                <div className="top-20 left-10 absolute bg-primary-100 blur-3xl rounded-full w-40 h-40"></div>
                <div className="right-10 bottom-20 absolute bg-primary-300 blur-3xl w-60 h-60"></div>
            </div>
            <div className="space-y-6 w-full text-center">
                <div className="space-y-3">
                    <div className="z-10 relative mx-auto max-w-2xl text-center">
                        <div className="relative mb-12">
                            <h1 className="font-bold text-[120px] text-foreground md:text-[180px] tracking-tighter">
                                <span className="relative">
                                    <span className="absolute inset-0 opacity-70 text-primary-100 animate-glitch-1">
                                        404
                                    </span>
                                    <span className="absolute inset-0 opacity-70 text-primary-300 animate-glitch-2">
                                        404
                                    </span>
                                    <span className="relative">404</span>
                                </span>
                            </h1>
                        </div>
                    </div>
                    <h2 className="mb-6 font-bold text-foreground text-3xl md:text-5xl">
                        Page not found
                    </h2>
                    <p className="mb-10 text-muted-foreground text-lg">
                        Oops! The page you&apos;re looking for has vanished into
                        the digital void.
                    </p>
                </div>

                <Button
                    className="group relative bg-gradient-to-r from-primary-100 to-primary-300 !px-8 !py-4 rounded-2xl overflow-hidden font-bold text-white cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <span className="z-10 relative">Return to Safety</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-300 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>

                <div className="bottom-10 left-1/2 absolute flex space-x-4 -translate-x-1/2 transform">
                    <div className="bg-primary-300 rounded-full w-3 h-3 animate-float delay-100"></div>
                    <div className="bg-primary-100 rounded-full w-2 h-2 animate-float delay-300"></div>
                    <div className="bg-white rounded-full w-4 h-4 animate-float delay-500"></div>
                </div>
            </div>
        </div>
    );
}
