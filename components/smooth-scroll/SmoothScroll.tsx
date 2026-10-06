"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LenisOptions } from "lenis";
import { ReactLenis, useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const lenisOptions: LenisOptions = {
  anchors: true,
  autoRaf: false,
  respectReducedMotion: true,
  smoothWheel: true,
};

function ScrollTriggerSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) {
      return;
    }

    const updateLenis = (time: number) => lenis.raf(time * 1000);
    const unsubscribe = lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      unsubscribe();
      gsap.ticker.remove(updateLenis);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={lenisOptions}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
