import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./navigation-sheet";

const Navbar04Page = () => {
    return (
        <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-(--breakpoint-xl) mx-auto rounded-full">
            <div className="flex justify-between items-center mx-auto px-4 h-full">
                <Logo />

                {/* Desktop Menu */}
                <NavMenu className="hidden md:block" />

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="hidden sm:inline-flex rounded-full cursor-pointer"
                    >
                        Log In
                    </Button>
                    <Button className="rounded-full cursor-pointer">
                        Get Started
                    </Button>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <NavigationSheet />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar04Page;
