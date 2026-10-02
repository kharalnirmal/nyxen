import Image from "next/image";

import { CinematicFooter } from "@/components/footer/motion-footer";
import Preloader from "@/components/preloader/Preloader";
import { SpotlightLogo } from "@/components/spotlight-logo";
import Work from "@/components/work/Work";

export default function Home() {
  return (
    <main>
      <Preloader />

      <section
        id="selected-work"
        aria-label="Introduction"
        className="relative flex min-h-svh flex-col overflow-hidden bg-background px-5 pb-12 pt-24 sm:px-8 sm:pt-28 lg:pt-32"
      >
        <div className="flex flex-1 items-center justify-center">
          <div className="relative flex w-full max-w-6xl -translate-y-12 items-center justify-center sm:-translate-y-16">
            <div className="w-full max-w-[42rem]">
              <SpotlightLogo />
            </div>

            <div className="absolute bottom-[calc(100%-5rem)] left-[5%] flex items-end gap-1 sm:bottom-[calc(100%-6.5rem)] sm:left-[12%]">
              <div className="-rotate-6 whitespace-nowrap text-right font-[family-name:var(--font-caveat)] text-xl leading-tight text-muted-foreground sm:text-3xl">
                <p>Follows your cursor</p>
                <p>Click for sound</p>
              </div>
              <Image
                src="/arrow/rotated-right-arrow-svgrepo-com.svg"
                width={96}
                height={96}
                alt=""
                className="h-16 w-16 rotate-[18deg] opacity-55 dark:invert sm:h-24 sm:w-24"
              />
            </div>
          </div>
        </div>
      </section>
      <Work />

      <CinematicFooter />
    </main>
  );
}
