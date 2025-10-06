import Navbar04Page from "@/components/navbar-04/navbar-04";
import { Hero } from "@/components/hero";
export default function Home() {
    return (
        <section className="flex justify-center items-center min-h-screen overflow-hidden cs-container">
            <Navbar04Page />
            <Hero />
        </section>
    );
}
