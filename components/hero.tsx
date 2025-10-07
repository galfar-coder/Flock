import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <div className="gap-12 grid lg:grid-cols-2 px-6 py-24 lg:py-0">
            <div className="my-auto cs-container">
                <h1 className="mt-6 max-w-[20ch] font-bold lg:text-[2.75rem] xl:text-[3.25rem] text-4xl md:text-5xl md:text-left text-center leading-[1.2]!tracking-tighter">
                    Stay Connected — Anytime, Anywhere.
                </h1>
                <p className="mt-6 max-w-[60ch] text-xl">
                    Spend time with your friends, jump into voice calls, share
                    what you&apos;re working on, watch something together, or
                    chat late into the night — Flock is the place built for
                    genuine connection and easy communication.
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
            <div className="flex justify-center items-center">
                <Image
                    width={500}
                    height={500}
                    alt="Flock Logo"
                    src={"/FlockLogo.png"}
                />
            </div>
        </div>
    );
}
