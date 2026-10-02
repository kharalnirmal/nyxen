import { CinematicFooter } from "@/components/footer/motion-footer";
import Hero from "@/components/hero/Hero";
import Preloader from "@/components/preloader/Preloader";
import Work from "@/components/work/Work";

export default function Home() {
  return (
    <main>
      <Preloader />

      <Hero />
      <Work />

      <CinematicFooter />
    </main>
  );
}
