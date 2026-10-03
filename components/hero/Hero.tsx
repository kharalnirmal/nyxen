import Image from "next/image";

import { SpotlightLogo } from "@/components/spotlight-logo";
import { Highlighter } from "@/components/ui/highlighter";

export default function Hero() {
  return (
    <section
      id="selected-work"
      aria-label="Introduction"
      className="relative flex flex-col bg-background px-5 sm:px-8 pt-24 sm:pt-28 lg:pt-32 pb-12 min-h-svh overflow-hidden"
    >
      <div className="flex flex-1 justify-center items-center">
        <div className="relative flex justify-center items-center w-full max-w-6xl -translate-y-[10rem] sm:-translate-y-16">
          <div className="relative w-full sm:max-w-[32rem] lg:max-w-[42rem]">
            <SpotlightLogo />

            <div className="top-[24%] sm:top-[28%] -right-8 sm:-right-12 md:-right-24 lg:right-[-10rem] absolute flex items-end gap-1 pointer-events-none">
              <Image
                src="/arrow/rotated-right-arrow-svgrepo-com.svg"
                width={96}
                height={96}
                alt=""
                loading="eager"
                className="opacity-55 dark:invert w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 rotate-[380]"
              />
              <div className="font-[family-name:var(--font-caveat)] text-xl sm:text-2xl lg:text-4xl text-center leading-none whitespace-nowrap -rotate-40">
                <Highlighter
                  action="underline"
                  color="#8200db"
                  isView
                  padding={-55}
                >
                  <span>About Me</span>
                </Highlighter>
                <span className="block -mt-0.5 text-muted-foreground text-xs sm:text-sm lg:text-xl lowercase tracking-wide">
                  Scroll Down
                </span>
              </div>
            </div>

            <div className="relative flex justify-center mt-3 pt-7 sm:pt-10 min-h-24 sm:min-h-32">
              <a
                href="/resume/NirmalKharal-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="z-10 relative flex flex-col items-center focus-visible:outline-none font-[family-name:var(--font-caveat)] text-3xl sm:text-5xl leading-none -rotate-6 transition-transform translate-x-8 sm:translate-x-12 hover:-translate-y-1"
              >
                <Highlighter
                  action="underline"
                  color="#8200db"
                  isView
                  padding={-8}
                >
                  {" "}
                  <span>Resume</span>
                </Highlighter>
                <span className="text-muted-foreground text-xs sm:text-sm lowercase tracking-wide">
                  click it
                </span>
              </a>

              <div className="top-[-2.5rem] sm:top-[-3rem] left-[calc(50%-1.5rem)] sm:left-[calc(50%-2rem)] absolute pointer-events-none">
                <Image
                  src="/arrow/scribble-svgrepo-com.svg"
                  width={112}
                  height={112}
                  alt=""
                  className="opacity-55 dark:invert w-16 sm:w-20 h-16 sm:h-20 rotate-240 -scale-x-100"
                />
              </div>
            </div>
          </div>

          <div className="bottom-[calc(100%-3rem)] sm:bottom-[calc(100%-6.5rem)] left-0 sm:left-[12%] absolute flex items-end gap-1">
            <div className="font-[family-name:var(--font-caveat)] text-muted-foreground text-lg sm:text-3xl text-right leading-tight whitespace-nowrap -rotate-6">
              <p>Follows your cursor</p>
              <p>Click for sound</p>
            </div>
            <Image
              src="/arrow/rotated-right-arrow-svgrepo-com.svg"
              width={96}
              height={96}
              alt=""
              loading="eager"
              className="opacity-55 dark:invert w-12 sm:w-24 h-12 sm:h-24 rotate-[18deg]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
