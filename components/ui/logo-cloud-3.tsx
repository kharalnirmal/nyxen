"use client";

import {
  SiBetterauth,
  SiMongodb,
  SiNextdotjs,
  SiOpencode,
  SiPrisma,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const logos = [
  {
    name: "TypeScript",
    Icon: SiTypescript,
    darkColor: "dark:text-[#3178c6]",
  },
  {
    name: "Next.js",
    Icon: SiNextdotjs,
    darkColor: "dark:text-white",
  },
  {
    name: "Tailwind CSS",
    Icon: SiTailwindcss,
    darkColor: "dark:text-[#38bdf8]",
  },
  {
    name: "Prisma",
    Icon: SiPrisma,
    darkColor: "dark:text-white",
  },
  {
    name: "MongoDB",
    Icon: SiMongodb,
    darkColor: "dark:text-[#00ed64]",
  },
  {
    name: "Better Auth",
    Icon: SiBetterauth,
    darkColor: "dark:text-white",
  },
  {
    name: "OpenCode",
    Icon: SiOpencode,
    darkColor: "dark:text-white",
  },
];

export default function LogoCloudBlock() {
  return (
    <section
      aria-label="Technology stack"
      className="isolate relative flex flex-col items-center bg-background px-6 sm:px-8 pt-3 sm:pt-4 pb-6 lg:pb-0 2xl:pb-8 border-foreground/10 border-b w-full overflow-hidden text-foreground"
    >
      <style>{`
        @keyframes logo-cloud-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .logo-cloud-track {
          animation: logo-cloud-marquee 30s linear infinite;
        }
        .logo-cloud-mask:hover .logo-cloud-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-cloud-track {
            animation: none;
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px)] [background-size:48px_100%] [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]"
      />

      <div className="relative flex justify-start mb-4 sm:mb-6 w-full max-w-6xl">
        <div className="flex items-end -translate-y-1 sm:-translate-y-2">
          <span className="max-w-28 sm:max-w-none font-[family-name:var(--font-caveat)] text-foreground/65 text-lg sm:text-3xl leading-[0.9] -rotate-4">
            the tools I use most
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 76 44"
            className="w-14 sm:w-16 h-9 sm:h-11 text-foreground/50 translate-y-2 sm:translate-y-3"
            fill="none"
          >
            <path
              d="M4 9c20-3 43 4 62 25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="m57 31 10 4-1-10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="relative py-4 sm:py-5 border-foreground/10 border-x w-full max-w-6xl overflow-hidden logo-cloud-mask">
        <span
          aria-hidden="true"
          className="left-0 z-10 absolute inset-y-0 bg-gradient-to-r from-background via-background/80 to-transparent w-[18%] sm:w-[14%] pointer-events-none"
        />
        <span
          aria-hidden="true"
          className="right-0 z-10 absolute inset-y-0 bg-gradient-to-l from-background via-background/80 to-transparent w-[18%] sm:w-[14%] pointer-events-none"
        />
        <div className="flex items-center w-max logo-cloud-track">
          {[...logos, ...logos].map(({ name, Icon, darkColor }, index) => (
            <div
              key={`${name}-${index}`}
              className="group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 w-40 sm:w-48 text-foreground/55 hover:text-foreground transition-colors duration-200 shrink-0"
              aria-hidden={index >= logos.length ? true : undefined}
            >
              <Icon
                aria-hidden="true"
                className={`size-8 shrink-0 text-black transition-transform duration-300 group-hover:scale-110 sm:size-9 ${darkColor}`}
              />
              <span className="flex items-center h-10 font-[family-name:var(--font-clash)] font-medium text-sm sm:text-base leading-none tracking-tight whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
