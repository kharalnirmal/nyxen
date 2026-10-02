import { FluidGradientText } from "@/components/fluid-gradient-text";

import InteractiveAsciiFooter from "@/components/InteractiveAsciiFooter/InteractiveAsciiFooter";
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
      <div className="flex-1">
        <FluidGradientText
          text="NirmalKharal"
          svgViewBoxHeight={300}
          svgViewBoxWidth={2000}
        />
      </div>
      <InteractiveAsciiFooter />
    </main>
  );
}
