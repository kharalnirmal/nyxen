import About from "@/components/about/About";
import { CinematicFooter } from "@/components/footer/motion-footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import Preloader from "@/components/preloader/Preloader";
import Work from "@/components/work/Work";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Preloader />

      <div className="relative">
        <Hero />
        <About />
      </div>
      <Work />

      <CinematicFooter />
    </main>
  );
}
