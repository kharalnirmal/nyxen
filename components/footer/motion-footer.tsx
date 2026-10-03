"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { caveat } from "@/app/font";
import { clashDisplay } from "@/app/font";

import { cn } from "@/lib/utils";
import { Highlighter } from "../ui/highlighter";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;
  --pill-bg-1: color-mix(in oklch, var(--card) 88%, var(--foreground) 12%);
  --pill-bg-2: color-mix(in oklch, var(--card) 96%, var(--foreground) 4%);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 14%, transparent);
  --pill-bg-1-hover: color-mix(in oklch, var(--card) 82%, var(--foreground) 18%);
  --pill-bg-2-hover: color-mix(in oklch, var(--card) 92%, var(--foreground) 8%);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.animate-footer-breathe { animation: footer-breathe 8s ease-in-out infinite alternate; }
.animate-footer-scroll-marquee { animation: footer-scroll-marquee 40s linear infinite; }

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 15%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 15%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
    0 10px 30px -10px var(--pill-shadow),
    inset 0 1px 1px var(--pill-highlight),
    inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
    0 20px 40px -10px var(--pill-shadow-hover),
    inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: clamp(7rem, 22vw, 25rem);
  line-height: 0.75;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-indent: 0.40em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 5%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 10%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}

@media (prefers-reduced-motion: reduce) {
  .animate-footer-breathe,
  .animate-footer-scroll-marquee { animation: none; }
}
`;

type MagneticButtonProps = React.HTMLAttributes<HTMLElement> & {
  as?: "a" | "button";
  href?: string;
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  rel?: string;
  type?: "button" | "submit" | "reset";
};

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  (
    { className, children, as: Component = "button", ...props },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = localRef.current;

      if (
        !element ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const handleMouseMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.4,
          y: y * 0.4,
          rotationX: -y * 0.15,
          rotationY: x * 0.15,
          scale: 1.05,
          ease: "power2.out",
          duration: 0.4,
          overwrite: "auto",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.3)",
          duration: 1.2,
          overwrite: "auto",
        });
      };

      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(element);
      };
    }, []);

    const setRef = (node: HTMLElement | null) => {
      localRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const Element = Component as React.ElementType;

    return (
      <Element
        ref={setRef}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Element>
    );
  },
);
MagneticButton.displayName = "MagneticButton";

const MarqueeItem = () => (
  <div className={cn("flex items-center space-x-12 px-6", caveat.className)}>
    <span>Full-stack development</span>
    <span className="text-primary/60">✦</span>
    <span>Thoughtful interfaces</span>
    <span className="text-secondary/60">✦</span>
    <span>Creative engineering</span>
    <span className="text-primary/60">✦</span>
    <span>Robust systems</span>
    <span className="text-secondary/60">✦</span>
    <span>Built with purpose</span>
    <span className="text-primary/60">✦</span>
  </div>
);

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/kharalnirmal/",
    icon: FaLinkedinIn,
  },
  {
    label: "GitHub",
    href: "https://github.com/kharalnirmal",
    icon: FaGithub,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nirmalkharal/",
    icon: FaInstagram,
  },
  {
    label: "Discord",
    href: "https://discord.com/users/744494586705084426",
    icon: FaDiscord,
  },
];

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set([giantTextRef.current, headingRef.current, linksRef.current], {
          clearProps: "all",
        });
        return;
      }

      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 60%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        id="contact"
        ref={wrapperRef}
        className="relative w-full h-[100svh]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer
          aria-label="Nirmal Kharal portfolio footer"
          className="bottom-0 left-0 fixed flex flex-col justify-between bg-background w-full h-[100svh] overflow-hidden text-foreground cinematic-footer-wrapper"
        >
          <div className="top-1/2 left-1/2 z-0 absolute blur-[80px] rounded-[50%] w-[80vw] h-[60vh] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe pointer-events-none footer-aurora" />
          <div className="z-0 absolute inset-0 footer-bg-grid pointer-events-none" />

          <div
            ref={giantTextRef}
            className={cn(
              "bottom-[-2vh] z-0 absolute inset-x-0 footer-giant-bg-text w-full text-center whitespace-nowrap pointer-events-none select-none",
              clashDisplay.className,
            )}
            aria-hidden="true"
          >
            NIRMAL
          </div>

          <div className="top-10 md:top-12 left-0 z-10 absolute bg-background/60 shadow-2xl backdrop-blur-md py-3 md:py-4 border-border/50 border-y w-full overflow-hidden -rotate-2 scale-110">
            <div className="flex w-max font-bold text-[0.65rem] text-muted-foreground md:text-sm uppercase tracking-[0.3em] animate-footer-scroll-marquee">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="z-10 relative flex flex-col flex-1 justify-center items-center mx-auto mt-20 px-6 w-full max-w-5xl">
            <p
              className={cn(
                "mb-4 font-semibold text-muted-foreground text-xs md:text-sm uppercase tracking-[0.35em]",
                caveat.className,
              )}
            >
              <Highlighter
                action="underline"
                strokeWidth={0.8}
                color="#8200db"
                isView
              >
                Have an idea in mind?
              </Highlighter>
            </p>

            <h2
              ref={headingRef}
              className={cn(
                "mb-8 md:mb-12 max-w-4xl font-black footer-text-glow text-4xl sm:text-6xl md:text-8xl text-center tracking-tight",
                clashDisplay.className,
              )}
            >
              Let&apos;s make it memorable.
            </h2>

            <div
              ref={linksRef}
              className="flex flex-col items-center gap-5 md:gap-6 w-full"
            >
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 w-full">
                <MagneticButton
                  as="a"
                  href="#work"
                  className="group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-foreground text-sm md:text-base footer-glass-pill"
                >
                  Explore my work
                  <span
                    className="transition-transform group-hover:translate-x-1 duration-300"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="mailto:nirmalkharal40@gmail.com"
                  className="px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-foreground text-sm md:text-base footer-glass-pill"
                >
                  Contact me
                </MagneticButton>
              </div>

              <div
                className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full"
                aria-label="Social profiles"
              >
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <MagneticButton
                    key={label}
                    as="a"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit Nirmal Kharal on ${label}`}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-semibold text-muted-foreground hover:text-foreground text-xs sm:text-sm footer-glass-pill"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{label}</span>
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          <div className="z-20 relative flex md:flex-row flex-col justify-between items-center gap-4 md:gap-6 px-6 md:px-12 pb-6 md:pb-8 w-full">
            <div className="font-semibold text-[10px] text-muted-foreground md:text-xs uppercase tracking-widest">
              © 2026 Nirmal Kharal. All rights reserved.
            </div>

            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group hidden md:flex justify-center items-center rounded-full size-12 text-muted-foreground hover:text-foreground footer-glass-pill"
            >
              <svg
                className="size-5 transition-transform group-hover:-translate-y-1.5 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 10l7-7m0 0 7 7M12 3v18"
                />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
