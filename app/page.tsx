import { CinematicFooter } from "@/components/footer/motion-footer";

import Preloader from "@/components/preloader/Preloader";
import Work from "@/components/work/Work";

export default function Home() {
  return (
    <main>
      <Preloader />

      <section
        id="selected-work"
        aria-label="Selected work"
        className="bg-background h-full min-h-screen"
      >
        <hr />
      </section>
      <Work />

      <CinematicFooter />
    </main>
  );
}
