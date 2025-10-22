import Navbar04Page from "@/components/navbar-04/navbar-04";
import { Hero } from "@/components/hero";
import Aurora from "@/components/Aurora";
import Footer05Page from "@/components/footer-05/footer-05";
export default function Home() {
    return (
        <>
            <div className="-z-10 absolute inset-0">
                <Aurora
                    colorStops={["#46aec5", "#005f8e", "#0081c1"]}
                    amplitude={1.7}
                    blend={2}
                    speed={0.2}
                />
            </div>
            <Navbar04Page />
            <section className="flex justify-center items-center min-h-screen overflow-hidden">
                <Hero />
            </section>
            <Footer05Page />
        </>
    );
}
