import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";

export function Hero() {
    return (
        <div className="gap-12 grid lg:grid-cols-2 px-6 py-12 lg:py-0 w-full">
            <div className="my-auto">
                <h1 className="mt-6 max-w-[17ch] font-semibold lg:text-[2.75rem] xl:text-[3.25rem] text-4xl md:text-5xl leading-[1.2]! tracking-tighter">
                    Stay Connected — Anytime, Anywhere.
                </h1>
                <p className="mt-6 max-w-[60ch] text-xl">
                    Spend time with your friends, jump into voice calls, share
                    what you&apos;re working on, watch something together, or
                    chat late into the night — everything happens in one place
                    built for genuine connection and easy communication.
                </p>
                <div className="flex items-center gap-4 mt-12">
                    <Button
                        size="lg"
                        className="rounded-full text-base cursor-pointer"
                    >
                        Get Started <ArrowUpRight className="w-5! h-5!" />
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        className="shadow-none rounded-full text-base cursor-pointer"
                    >
                        <CirclePlay className="w-5! h-5!" /> Learn more
                    </Button>
                </div>
            </div>
            <div className="bg-accent rounded-xl w-full lg:w-[1000px] lg:h-[calc(100vh-4rem)] aspect-video lg:aspect-auto" />
        </div>
    );
}
