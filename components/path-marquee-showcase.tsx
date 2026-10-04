import Image from "next/image";

import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";

const path =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const projects = [
  {
    name: "GTA VI",
    image: "/projects/gta.webp",
    href: "https://gta-vi-landing-page-cyan.vercel.app/",
  },
  {
    name: "Smart Fridge",
    image: "/projects/fridge.png",
    href: "https://fridgehub.vercel.app/",
  },
  {
    name: "Kairo",
    image: "/projects/kairo.png",
    href: "https://pomo-kairo.vercel.app/",
  },
  {
    name: "Zentry",
    image: "/projects/zentry.webp",
    href: "https://zentry-the-metagame-3a86.vercel.app/",
  },
];

export default function PathMarqueeShowcase() {
  return (
    <section
      aria-label="Project preview carousel"
      className="relative isolate overflow-hidden border-t border-foreground/10 bg-background"
    >
      <div className="absolute inset-x-0 top-8 z-20 mx-auto flex max-w-6xl items-end justify-between px-6 sm:top-12 sm:px-8">
        <p className="font-[family-name:var(--font-clash)] text-xs font-medium uppercase tracking-[0.24em] text-foreground/55 sm:text-sm">
          Selected builds
        </p>
        <p className="font-[family-name:var(--font-caveat)] text-xl text-foreground/55 -rotate-3 sm:text-2xl">
          drag the orbit
        </p>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.04] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:20px_20px]"
      />

      <MarqueeAlongSvgPath
        path={path}
        viewBox="0 0 996 330"
        baseVelocity={8}
        slowdownOnHover
        draggable
        repeat={2}
        dragSensitivity={0.1}
        className="h-[26rem] w-full sm:h-[34rem] lg:h-[40rem]"
        responsive
        grabCursor
      >
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${project.name} project`}
            className="group block w-24 overflow-hidden border border-foreground/20 bg-background p-1 shadow-xl shadow-background/30 transition-transform duration-300 hover:scale-125 focus-visible:scale-125 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:w-32"
          >
            <Image
              src={project.image}
              alt=""
              width={320}
              height={200}
              sizes="128px"
              draggable={false}
              className="aspect-[8/5] w-full object-cover grayscale transition duration-300 group-hover:grayscale-0 group-focus-visible:grayscale-0"
            />
            <span className="block truncate px-1 pt-1 font-mono text-[0.6rem] uppercase tracking-wider text-foreground/70 sm:text-[0.68rem]">
              {project.name}
            </span>
          </a>
        ))}
      </MarqueeAlongSvgPath>
    </section>
  );
}
