import Image from "next/image";

const details = [
  "Full-stack developer focused on building real web products and understanding the systems behind them from interface and authentication to database design and deployment.",
  "Currently working with Next.js, React, TypeScript, PostgreSQL and Prisma while learning how production-grade applications are structured, maintained, and shipped.",
  "I enjoy experimenting with product ideas, interaction design, backend architecture, and the small details that make software feel polished and intentional.",
];

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="z-10 isolate relative bg-background px-6 sm:px-8 py-12 sm:py-18 lg:py-22 border-foreground/10 border-t overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)] sm:[background-size:64px_64px]"
      />

      <div className="items-center gap-12 sm:gap-14 md:gap-12 lg:gap-16 grid md:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] mx-auto w-full max-w-6xl">
        <div className="z-10 relative">
          <h2
            id="about-heading"
            className="max-w-3xl font-[family-name:var(--font-depMono)] text-[2.35rem] text-foreground sm:text-[clamp(2.7rem,5.4vw,5rem)] min-[380px]:text-[2.65rem] leading-[0.96] sm:leading-[0.92] tracking-[0.03em] sm:tracking-[0.035em]"
          >
            NIRMAL
            <span className="block">KHARAL</span>
          </h2>

          <ul className="space-y-4 sm:space-y-6 mt-7 sm:mt-9 max-w-2xl">
            {details.map((detail) => (
              <li
                key={detail}
                className="group flex gap-3 sm:gap-4 text-[0.9rem] text-foreground/65 sm:text-[0.95rem] hover:text-foreground/90 leading-6 sm:leading-[1.625rem] transition-colors duration-300"
              >
                <Image
                  src="/arrow/rotated-right-arrow-svgrepo-com.svg"
                  width={24}
                  height={24}
                  alt=""
                  aria-hidden="true"
                  className="opacity-45 dark:invert mt-0.5 size-4 sm:size-5 -rotate-12 transition-transform motion-reduce:transition-none group-hover:translate-x-1 duration-300 ease-out shrink-0"
                />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto md:mx-0 md:ml-auto w-full max-w-[16.5rem] sm:max-w-[19rem]">
          <div className="-top-10 sm:-top-12 md:top-10 left-0 md:-left-28 z-10 absolute flex items-center gap-1">
            <span className="font-[family-name:var(--font-caveat)] text-[1.4rem] text-foreground/70 sm:text-3xl leading-none whitespace-nowrap -rotate-6">
              that&apos;s me
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 76 44"
              className="w-14 sm:w-16 h-9 sm:h-11 text-foreground/50"
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

          <div
            role="img"
            aria-label="Portrait of Nirmal Kharal"
            className="relative bg-foreground/[0.025] border border-foreground/15 aspect-[4/5] overflow-hidden"
          >
            <Image
              src="/profile/white-theme.png"
              alt=""
              fill
              sizes="(max-width: 639px) min(264px, calc(100vw - 48px)), (max-width: 767px) 304px, (max-width: 1279px) 30vw, 304px"
              className="opacity-100 dark:opacity-0 dark:blur-[2px] object-center object-cover dark:scale-[1.015] transition-[opacity,transform,filter] motion-reduce:transition-none duration-500 ease-in-out"
            />
            <Image
              src="/profile/NirmalKHaral.jpg"
              alt=""
              fill
              sizes="(max-width: 639px) min(264px, calc(100vw - 48px)), (max-width: 767px) 304px, (max-width: 1279px) 30vw, 304px"
              className="opacity-0 dark:opacity-100 blur-[2px] dark:blur-none object-center object-cover scale-[1.015] dark:scale-100 transition-[opacity,transform,filter] motion-reduce:transition-none duration-500 ease-in-out"
            />
          </div>

          <span
            aria-hidden="true"
            className="-top-2 -left-2 absolute border-foreground/45 border-t border-l size-6 sm:size-8"
          />
          <span
            aria-hidden="true"
            className="-right-2 -bottom-2 absolute border-foreground/45 border-r border-b size-6 sm:size-8"
          />
        </div>
      </div>
    </section>
  );
}
