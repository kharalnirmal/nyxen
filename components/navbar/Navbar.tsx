"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useReducedMotion } from "motion/react";
import { FaGithub } from "react-icons/fa";

import { MobiusLoopIcon } from "@/components/mobius-loop-icon";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Navbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 8) {
        setIsCollapsed(false);
      } else if (Math.abs(currentScrollY - lastScrollY.current) > 4) {
        setIsCollapsed(true);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      const nav = navRef.current;
      const container = containerRef.current;
      const name = nameRef.current;
      const controls = controlsRef.current;
      if (!nav || !container || !name || !controls) return;

      const duration = reduceMotion ? 0 : 0.28;
      const controlDuration = reduceMotion ? 0 : 0.12;
      const expandedHeight = window.innerWidth >= 640 ? 64 : 56;
      const expandedPadding = window.innerWidth >= 640 ? 32 : 20;
      const timeline = gsap.timeline({
        defaults: { overwrite: "auto" },
      });

      if (isCollapsed) {
        timeline
          .to(
            name,
            {
              autoAlpha: 0,
              x: -10,
              duration: controlDuration,
              ease: "power2.in",
            },
            0,
          )
          .to(
            controls,
            {
              autoAlpha: 0,
              x: 10,
              duration: controlDuration,
              ease: "power2.in",
            },
            0,
          )
          .to(
            nav,
            {
              width: 48,
              height: 48,
              paddingLeft: 0,
              paddingRight: 0,
              borderRadius: 999,
              duration,
              ease: "power3.inOut",
            },
            0,
          );
      } else {
        timeline
          .set([name, controls], { visibility: "visible" })
          .to(
            nav,
            {
              width: container.clientWidth,
              height: expandedHeight,
              paddingLeft: expandedPadding,
              paddingRight: expandedPadding,
              borderRadius: 18,
              duration,
              ease: "power3.out",
            },
            0,
          )
          .to(
            name,
            {
              autoAlpha: 1,
              x: 0,
              duration: controlDuration,
              ease: "power2.out",
            },
            duration * 0.52,
          )
          .to(
            controls,
            {
              autoAlpha: 1,
              x: 0,
              duration: controlDuration,
              ease: "power2.out",
            },
            duration * 0.52,
          );
      }
    },
    { dependencies: [isCollapsed, reduceMotion], scope: containerRef },
  );

  return (
    <header className="sticky top-0 z-50 flex w-full justify-center px-4 py-4 sm:px-8 sm:py-6">
      <div ref={containerRef} className="relative h-14 w-full max-w-4xl sm:h-16">
        <nav
          ref={navRef}
          aria-label="Primary navigation"
          className="absolute top-0 left-1/2 flex h-14 w-full -translate-x-1/2 items-center justify-between overflow-hidden rounded-[1.1rem] border border-foreground/10 bg-background px-5 shadow-[0_12px_40px_-24px_rgb(0_0_0/0.4)] sm:h-16 sm:px-8 dark:shadow-[0_12px_40px_-24px_rgb(0_0_0/0.8)]"
        >
          <a
            ref={nameRef}
            href="#selected-work"
            aria-label="Nirmal Kharal, back to introduction"
            tabIndex={isCollapsed ? -1 : undefined}
            className="justify-self-start font-[family-name:var(--font-depMono)] text-2xl font-black tracking-[-0.14em] text-foreground transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-3xl"
          >
            NK
          </a>

          <button
            type="button"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            title={isCollapsed ? "Expand navigation" : "Collapse navigation"}
            className={`absolute left-1/2 grid -translate-x-1/2 place-items-center rounded-full text-foreground/80 transition-[width,height,color,background-color] duration-200 hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isCollapsed ? "size-10" : "size-12"}`}
          >
            <MobiusLoopIcon
              className={`transition-[width,height] duration-200 ${isCollapsed ? "size-7" : "size-9 sm:size-10"}`}
            />
          </button>

          <div
            ref={controlsRef}
            inert={isCollapsed}
            className="ml-auto flex items-center gap-2 sm:gap-3"
          >
            <AnimatedThemeToggler
              variant="circle"
              aria-label="Toggle color theme"
              title="Toggle color theme"
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-[1.1rem]"
            />
            <span className="h-6 w-px bg-border" aria-hidden="true" />
            <a
              href="https://github.com/kharalnirmal"
              target="_blank"
              rel="noreferrer"
              aria-label="Visit Nirmal Kharal on GitHub"
              title="GitHub"
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <FaGithub className="size-5" aria-hidden="true" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
