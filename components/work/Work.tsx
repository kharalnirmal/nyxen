"use client";

import { useRef } from "react";
import styles from "./work.module.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clashDisplay, Vibes } from "@/app/font";
import { MdArrowOutward } from "react-icons/md";
import { Highlighter } from "../ui/highlighter";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Project {
  name: string;
  category: string;
  tools: string;
  image: string;
  alt: string;
  video?: string;
  link?: string;
}

const projects: Project[] = [
  {
    name: "GTA VI",
    category: "Landing Page",
    tools: "Next.js, TypeScript, GSAP",
    image: "/projects/gta.webp",
    alt: "GTA VI landing page",
    link: "https://gta-vi-landing-page-cyan.vercel.app/",
  },
  {
    name: "Smart Fridge",
    category: "Web Application",
    tools: "React, TypeScript, 3js, MealDb",
    image: "/projects/fridge.png",
    alt: "Smart Fridge recipe application",
    link: "https://fridgehub.vercel.app/",
  },
  {
    name: "Kairo",
    category: "Productivity App",
    tools: "React, TypeScript",
    image: "/projects/kairo.png",
    alt: "Kairo productivity application",
    link: "https://pomo-kairo.vercel.app/",
  },
  {
    name: "Zentry",
    category: "Gaming Website",
    tools: "React , Gsap , Tailwind",
    image: "/projects/zentry.webp",
    alt: "Zentry gaming website",
    link: "https://zentry-the-metagame-3a86.vercel.app/",
  },
];

const Work = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const workFlexRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const getScrollDistance = () =>
        Math.max(
          0,
          (workFlexRef.current?.scrollWidth ?? 0) - window.innerWidth,
        );

      gsap.to(workFlexRef.current, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      className={`${styles.workSection} ${clashDisplay.variable}`}
      id="work"
      ref={sectionRef}
    >
      <div className={`${styles.workContainer} `}>
        <h2 className="text-center">
          My{" "}
          <span className={Vibes.className}>
            {" "}
            <Highlighter
              isView
              animationDuration={800}
              action="underline"
              padding={-10}
            >
              Work
            </Highlighter>
          </span>
        </h2>

        <div className={styles.workFlex} ref={workFlexRef}>
          {projects.map((project, index) => (
            <article className={styles.workBox} key={project.name}>
              <div className={styles.workInfo}>
                <div className={styles.workTitle}>
                  <h3>{String(index + 1).padStart(2, "0")}</h3>

                  <div>
                    <h4>{project.name}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.tools}</p>
              </div>
              <WorkImage
                image={project.image}
                alt={project.alt}
                video={project.video}
                link={project.link}
              />
            </article>
          ))}
          <article className={`${styles.workBox} ${styles.connectBox}`}>
            <h3 className={styles.connectHeading}>
              <span>Let&apos;s</span>
              <span className={`${styles.connectScript} ${Vibes.className}`}>
                connect !
              </span>
            </h3>
            <p className={styles.connectCopy}>
              Tell me what you are building, and let&apos;s make it memorable.
            </p>
            <a className={styles.connectButton} href="#contact">
              Get in touch
              <span className={styles.connectArrow} aria-hidden="true">
                <MdArrowOutward />
                <MdArrowOutward />
              </span>
            </a>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Work;
