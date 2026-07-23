import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {SiX, SiGithub, SiTwitch, SiDribbble } from "@icons-pack/react-simple-icons";

const footerLinks = [
    {
        title: "Overview",
        href: "/overview",
    },
    {
        title: "Features",
        href: "/features",
    },
    {
        title: "Pricing",
        href: "/pricing",
    },
    {
        title: "Careers",
        href: "/careers",
    },
    {
        title: "Help",
        href: "/faq",
    },
    {
        title: "Privacy",
        href: "/privacy",
    },
];

const Footer05Page = () => {
    return (
        <div className="flex flex-col">
            <footer className="border-t">
                <div className="max-w-(--breakpoint-xl) mx-auto">
                    <div className="flex flex-col justify-start items-center py-12">
                        <div className="flex items-center gap-4">
                            <Image
                                width={50}
                                height={50}
                                alt="Flock Logo"
                                src="/FlockLogo.png"
                            />

                            <span className="font-bold text-lg">Flock</span>
                        </div>
                        <ul className="flex flex-wrap items-center gap-4 mt-6">
                            {footerLinks.map(({ title, href }) => (
                                <li key={title}>
                                    <Link
                                        href={href}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        {title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <Separator />
                    <div className="flex sm:flex-row flex-col-reverse justify-between items-center gap-x-2 gap-y-5 px-6 xl:px-0 py-8">
                        {/* Copyright */}
                        <span className="text-muted-foreground">
                            &copy; {new Date().getFullYear()}{" "}
                            <Link href="/" target="_blank">
                                Flock Chat Team
                            </Link>
                            . Licensed under GPL-3.0.
                        </span>

                        <div className="flex items-center gap-5 text-muted-foreground">
                            <Link href="#" target="_blank">
                                <SiX className="w-5 h-5" />
                            </Link>
                            <Link href="#" target="_blank">
                                <SiDribbble className="w-5 h-5" />
                            </Link>
                            <Link href="#" target="_blank">
                                <SiTwitch className="w-5 h-5" />
                            </Link>
                            <Link href="#" target="_blank">
                                <SiGithub className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    <span className="text-muted-foreground">
                            Not affiliated with Flock, the company, in any way, shape or form.
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default Footer05Page;
