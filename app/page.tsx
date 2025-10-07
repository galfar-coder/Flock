import Navbar04Page from "@/components/navbar-04/navbar-04";
import { Hero } from "@/components/hero";
import Footer05Page from "@/components/footer-05/footer-05";
export default function Home() {
    return (
        <>
            <Navbar04Page />
            <section className="flex justify-center items-center min-h-screen overflow-hidden">
                <Hero />
            </section>
            <Footer05Page />
        </>
    );
}
