import { FluidGradientText } from "@/components/fluid-gradient-text";
import { CinematicFooter } from "@/components/ui/motion-footer";

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
