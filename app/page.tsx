import { FluidGradientText } from "@/components/fluid-gradient-text";

import InteractiveAsciiFooter from "@/components/InteractiveAsciiFooter/InteractiveAsciiFooter";
import Preloader from "@/components/preloader/Preloader";

export default function Home() {
  return (
    <main>
      <Preloader />

      <section
        id="selected-work"
        aria-label="Selected work"
        className="bg-background h-[clamp(13rem,28vw,25rem)] scroll-mt-0"
      >
        <FluidGradientText
          text="NirmalKharal"
          svgViewBoxHeight={300}
          svgViewBoxWidth={2000}
        />
      </section>
      <InteractiveAsciiFooter />
    </main>
  );
}
