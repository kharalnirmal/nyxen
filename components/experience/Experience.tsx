"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Code2, Globe2, Handshake, Users2, WalletCards } from "lucide-react";

import {
  WorkExperience,
  type ExperienceItemType,
} from "@/components/work-experience";
import { Highlighter } from "../ui/highlighter";

gsap.registerPlugin(useGSAP);

const experiences: ExperienceItemType[] = [
  {
    id: "aiesec-nepal",
    companyName: "AIESEC in Nepal",
    companyLogo: "/company/Aiesec-blue.png",
    companyLogoDark: "/company/aiesec-white.png",
    positions: [
      {
        id: "aiesec-nst-dev",
        title: "Frontend Developer — National Support Team",
        employmentPeriod: { start: "2.2026", end: "7.2026" },
        employmentType: "Part-time",
        icon: <Code2 />,
        isExpanded: false,
        description:
          "Selected for the National Support Team to contribute to the AIESEC in Nepal website through frontend implementation and product development.\n\n- Worked on the AIESEC in Nepal website as part of the National Support Team.\n- Contributed to frontend development, interface implementation, and product features.\n- Built responsive interfaces and supported feature development.\n- Collaborated with the NST team during development and iteration of the platform.",
        skills: [
          "Frontend Development",
          "React",
          "Next.js",
          "UI Development",
          "Team Collaboration",
        ],
      },
    ],
  },
];

const volunteering: ExperienceItemType[] = [
  {
    id: "aiesec-lumbini",
    companyName: "AIESEC in Lumbini",
    companyLogo: "/company/Aiesec-blue.png",
    companyLogoDark: "/company/aiesec-white.png",
    positions: [
      {
        id: "aiesec-lumbini-bd",
        title: "Vice President — Business Development",
        employmentPeriod: { start: "2.2026", end: "2.2027" },
        employmentType: "Leadership",
        icon: <Users2 />,
        description:
          "Leading business development for AIESEC in Lumbini, focusing on partnerships, outreach, stakeholder relationships, and team execution.\n\n- Lead the Business Development function for the local chapter.\n- Work on partnerships, outreach, and stakeholder relationship building.\n- Coordinate with the executive board and team members on local chapter initiatives.\n- Support strategy, execution, and business development activities throughout the term.",
        skills: [
          "Leadership",
          "Business Development",
          "Partnerships",
          "Stakeholder Management",
          "Team Management",
          "Communication",
        ],
      },
      {
        id: "aiesec-lumbini-ir-manager",
        title: "International Relations Manager",
        employmentPeriod: { start: "08.2025", end: "02.2026" },
        employmentType: "Leadership",
        icon: <Globe2 />,
        description:
          "Managed international relations for AIESEC in Lumbini, connecting with AIESEC members in other countries to promote Lumbini as an exchange destination.\n\n- Built relationships with AIESEC members and entities in other countries.\n- Promoted Lumbini and its local opportunities to international exchange partners.\n- Supported communication and coordination for exchange opportunities.\n- Helped strengthen international partnerships and outreach.",
        skills: [
          "International Relations",
          "Exchange Promotion",
          "Partnerships",
          "Cross-Cultural Communication",
          "Outreach",
        ],
      },
    ],
  },
  {
    id: "csitan-rupandehi",
    companyName: "CSITAN Rupandehi",
    companyLogo: "/company/Csitan-colorful.png",
    companyLogoDark: "/company/csitan-invert.png",
    companyWebsite: "https://rupandehi.csitan.org.np",
    positions: [
      {
        id: "csitan-vp",
        title: "Vice President",
        employmentPeriod: { start: "4.2026", end: "4.2027" },
        employmentType: "Leadership",
        icon: <Handshake />,
        description:
          "Serving as Vice President of CSITAN Rupandehi, leading student-focused technology initiatives, events, and community activities.\n\n- Help lead the chapter and contribute to its overall direction and execution.\n- Plan and support technology-focused events and initiatives for students.\n- Work with teams to organize impactful learning and community programs.\n- Coordinate with students, partners, and external stakeholders around chapter activities.\n- Support leadership, collaboration, and growth across the local tech community.",
        skills: [
          "Leadership",
          "Community Building",
          "Event Management",
          "Technology Events",
          "Coordination",
          "Stakeholder Communication",
        ],
      },
      {
        id: "csitan-treasurer",
        title: "Treasurer",
        employmentPeriod: { start: "05.2025", end: "05.2026" },
        employmentType: "Leadership",
        icon: <WalletCards />,
        description:
          "Served as Treasurer of CSIT Association of Nepal - Rupandehi, supporting the chapter's financial planning and accountability.\n\n- Managed financial records and tracked chapter expenses.\n- Supported budgeting for events and community initiatives.\n- Coordinated with the executive team on financial decisions.\n- Helped maintain transparent and responsible use of chapter funds.",
        skills: [
          "Financial Management",
          "Budgeting",
          "Record Keeping",
          "Team Coordination",
          "Accountability",
        ],
      },
    ],
  },
];

export default function Experience() {
  const [activeView, setActiveView] = useState<"experience" | "volunteering">(
    "experience",
  );
  const tabListRef = useRef<HTMLDivElement>(null);
  const activePillRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useGSAP(
    () => {
      const activeButton = tabListRef.current?.querySelector<HTMLElement>(
        `[data-view="${activeView}"]`,
      );
      const activePill = activePillRef.current;

      if (!activeButton || !activePill) return;

      const movePill = (duration: number) => {
        gsap.to(activePill, {
          autoAlpha: 1,
          x: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
          duration,
          ease: "power3.out",
        });
      };

      movePill(isFirstRender.current ? 0 : 0.45);
      gsap.fromTo(
        panelRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" },
      );
      isFirstRender.current = false;

      const handleResize = () => movePill(0);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    },
    { dependencies: [activeView] },
  );

  const switchView = (view: "experience" | "volunteering") => {
    if (view === activeView) return;

    gsap.to(panelRef.current, {
      autoAlpha: 0,
      y: -8,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => setActiveView(view),
    });
  };

  return (
    <section
      id="experience"
      className="isolate relative bg-[color-mix(in_oklab,var(--portfolio-accent)_2.5%,var(--background))] px-4 sm:px-8 py-16 sm:py-24 border-foreground/10 border-y overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="-z-10 absolute inset-0 opacity-60 pointer-events-none [background-image:repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,color-mix(in_oklab,var(--foreground)_6%,transparent)_32px)] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      />
      <h2 className="font-[family-name:var(--font-clash)] font-semibold text-4xl sm:text-6xl text-center tracking-tight">
        <Highlighter action="underline" isView color="var(--portfolio-accent)">
          Experience &amp; Volunteering
        </Highlighter>
      </h2>

      <div className="relative mx-auto mt-10 sm:mt-16 mb-10 lg:pt-10 w-fit">
        <div className="lg:top-0 lg:left-0 lg:absolute flex justify-center items-end gap-1 mb-3 lg:mb-0 -translate-x-4 sm:-translate-x-8 lg:-translate-x-[88%]">
          <span className="font-[family-name:var(--font-caveat)] text-foreground/65 text-xl sm:text-3xl whitespace-nowrap -rotate-3 sm:-rotate-6">
            What do you want to see?
          </span>
          <svg
            viewBox="0 0 62 44"
            fill="none"
            aria-hidden="true"
            className="w-11 sm:w-14 h-8 sm:h-10 text-foreground/55 shrink-0"
          >
            <path
              d="M4 5c15 1 34 9 49 29"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="m44 31 10 4-1-10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Experience categories"
          className="relative flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          <span
            ref={activePillRef}
            aria-hidden="true"
            className="top-0 bottom-0 left-0 absolute bg-foreground opacity-0 rounded-full pointer-events-none"
          />
          {(["experience", "volunteering"] as const).map((view) => (
            <button
              key={view}
              data-view={view}
              id={`${view}-tab`}
              type="button"
              role="tab"
              aria-selected={activeView === view}
              aria-controls="experience-panel"
              onClick={() => switchView(view)}
              className={`z-10 relative rounded-full border px-5 py-2.5 text-base font-medium capitalize transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-8 sm:text-lg ${
                activeView === view
                  ? "border-transparent text-background"
                  : "border-foreground/20 text-foreground/60 hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={panelRef}
        id="experience-panel"
        role="tabpanel"
        aria-labelledby={`${activeView}-tab`}
        className="mx-auto max-w-3xl"
      >
        <WorkExperience
          className="bg-transparent"
          experiences={activeView === "experience" ? experiences : volunteering}
        />
      </div>
    </section>
  );
}
