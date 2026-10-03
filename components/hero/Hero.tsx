import Image from "next/image";

import { SpotlightLogo } from "@/components/spotlight-logo";
import { Highlighter } from "@/components/ui/highlighter";

export default function Hero() {
  return (
    <section
      id="selected-work"
      aria-label="Introduction"
      className="sticky top-0 flex min-h-[calc(100svh-5.5rem)] flex-col overflow-hidden bg-background px-6 py-5 sm:min-h-svh sm:px-8 sm:pt-28 sm:pb-12 lg:pt-32"
    >
      <div className="flex flex-1 justify-center items-center">
        <div className="relative flex w-full max-w-6xl items-center justify-center sm:-translate-y-16">
          <div className="relative w-full max-w-[19rem] min-[400px]:max-w-[21rem] sm:max-w-[32rem] lg:max-w-[42rem]">
            <SpotlightLogo />

            <div className="top-[38%] right-0 absolute flex items-end gap-1 pointer-events-none sm:top-[28%] sm:-right-12 md:-right-24 lg:right-[-10rem]">
              <Image
                src="/arrow/rotated-right-arrow-svgrepo-com.svg"
                width={96}
                height={96}
                alt=""
                loading="eager"
                className="size-9 rotate-[380] opacity-55 sm:size-14 lg:size-20 dark:invert"
              />
              <div className="font-[family-name:var(--font-caveat)] text-lg text-center leading-none whitespace-nowrap -rotate-40 sm:text-2xl lg:text-4xl">
                <Highlighter
                  action="underline"
                  color="#8200db"
                  isView
                  padding={-58}
                >
                  <span>About Me</span>
                </Highlighter>
                <span className="block -mt-0.5 text-[0.65rem] text-muted-foreground lowercase tracking-wide sm:text-sm lg:text-xl">
                  Scroll Down
                </span>
              </div>
            </div>

            <div className="relative mt-2 flex min-h-20 justify-center pt-6 sm:mt-3 sm:min-h-32 sm:pt-10">
              <a
                href="/resume/NirmalKharal-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="relative z-10 flex translate-x-6 -rotate-6 flex-col items-center font-[family-name:var(--font-caveat)] text-3xl leading-none transition-transform hover:-translate-y-1 focus-visible:outline-none sm:translate-x-12 sm:text-5xl"
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
                <span className="text-muted-foreground text-xs sm:text-xl lowercase tracking-wide">
                  click it
                </span>
              </a>

              <div className="top-[-2.5rem] sm:top-[-3rem] left-[calc(50%-1.5rem)] sm:left-[calc(50%-2rem)] absolute pointer-events-none">
                <Image
                  src="/arrow/scribble-svgrepo-com.svg"
                  width={112}
                  height={112}
                  alt=""
                  className="size-14 rotate-240 -scale-x-100 opacity-55 sm:size-20 dark:invert"
                />
              </div>
            </div>
          </div>

          <div className="absolute -top-12 left-0 flex items-end gap-1 sm:bottom-[calc(100%-6.5rem)] sm:top-auto sm:left-[12%]">
            <div className="font-[family-name:var(--font-caveat)] text-base text-right leading-tight whitespace-nowrap text-muted-foreground -rotate-6 sm:text-3xl">
              <p>Follows your cursor</p>
              <p>Click for sound</p>
            </div>
            <Image
              src="/arrow/rotated-right-arrow-svgrepo-com.svg"
              width={96}
              height={96}
              alt=""
              loading="eager"
              className="size-10 rotate-[18deg] opacity-55 sm:size-24 dark:invert"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
