"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Lottie } from "lottie-react";

import { caveat } from "@/app/font";
import { Highlighter } from "@/components/ui/highlighter";

import styles from "./Preloader.module.css";

const PRELOADER_SESSION_KEY = "portfolio-preloader-played";

gsap.registerPlugin(useGSAP);

export default function Preloader() {
  const overlayRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showStrike, setShowStrike] = useState(false);

  useGSAP(
    () => {
      if (sessionStorage.getItem(PRELOADER_SESSION_KEY)) {
        setIsVisible(false);
        return;
      }

      const previousOverflow = document.body.style.overflow;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      document.body.style.overflow = "hidden";

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          sessionStorage.setItem(PRELOADER_SESSION_KEY, "true");
          document.body.style.overflow = previousOverflow;
          setIsVisible(false);
        },
      });

      timeline
        .fromTo(
          lottieRef.current,
          {
            autoAlpha: 0,
            scale: reduceMotion ? 1 : 0.86,
            y: reduceMotion ? 0 : 18,
          },
          {
            autoAlpha: 1,
            scale: 1,
            y: 0,
            duration: reduceMotion ? 0.15 : 0.75,
          },
        )
        .fromTo(
          textRef.current,
          { autoAlpha: 0, y: reduceMotion ? 0 : 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0.15 : 0.55,
          },
          reduceMotion ? ">" : "-=0.3",
        )
        .call(() => setShowStrike(true))
        .to({}, { duration: reduceMotion ? 0.25 : 2 })
        .to(contentRef.current, {
          autoAlpha: 0,
          scale: reduceMotion ? 1 : 0.96,
          y: reduceMotion ? 0 : -20,
          duration: reduceMotion ? 0.15 : 0.4,
          ease: "power2.in",
        })
        .to(
          overlayRef.current,
          {
            yPercent: -100,
            y: -96,
            duration: reduceMotion ? 0.2 : 1.35,
            ease: reduceMotion ? "power1.inOut" : "power3.inOut",
          },
          "-=0.1",
        );

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    },
    { scope: overlayRef },
  );

  if (!isVisible) {
    return null;
  }

  return (
    <section
      ref={overlayRef}
      className={styles.overlay}
      aria-label="Loading portfolio"
      aria-live="polite"
    >
      <div ref={contentRef} className={styles.content}>
        <div ref={lottieRef} className={styles.lottie} aria-hidden="true">
          <Lottie src="/lottie/Money.json" loop={false} autoplay />
        </div>

        <p ref={textRef} className={`${styles.tagline} ${caveat.className}`}>
          just{" "}
          {showStrike ? (
            <Highlighter
              action="strike-through"
              color="#8200db"
              strokeWidth={5}
              animationDuration={700}
              iterations={3}
              padding={1}
              offsetY={7}
            >
              another
            </Highlighter>
          ) : (
            <span>another</span>
          )}{" "}
          developer
        </p>
      </div>
    </section>
  );
}
