import About from "@/components/about/About";
import Experience from "@/components/experience/Experience";
import { CinematicFooter } from "@/components/footer/motion-footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/navbar/Navbar";
import Preloader from "@/components/preloader/Preloader";
import LogoCloudBlock from "@/components/ui/logo-cloud-3";
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
      <LogoCloudBlock />
      <Work />
      <Experience />

      <CinematicFooter />
    </main>
  );
}
