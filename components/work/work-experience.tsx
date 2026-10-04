"use client";

import { useCallback, useRef, type ComponentProps } from "react";
import { differenceInMonths, format, parse } from "date-fns";
import { BriefcaseBusinessIcon, InfinityIcon } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { ChevronsUpDownIconHandle } from "@/components/ui/chevrons-up-down-icon";
import { ChevronsUpDownIcon } from "@/components/ui/chevrons-up-down-icon";

export type ExperiencePositionItemType = {
  /** Unique identifier for the position */
  id: string;
  /** The job title or position name */
  title: string;
  /**
   * Employment period of the position.
   * Use "MM.YYYY" or "YYYY" format. Omit `end` for current roles.
   */
  employmentPeriod: {
    /** Start date (e.g., "10.2022" or "2020"). */
    start: string;
    /** End date; leave undefined for "Present". */
    end?: string;
  };
  /** The type of employment (e.g., "Full-time", "Part-time", "Contract") */
  employmentType?: string;
  /** A brief description of the position or responsibilities */
  description?: string;
  /** An icon representing the position */
  icon?: React.ReactElement;
  /** A list of skills associated with the position */
  skills?: string[];
  /** Indicates if the position details are expanded in the UI */
  isExpanded?: boolean;
};

export type ExperienceItemType = {
  /** Unique identifier for the experience item */
  id: string;
  /** Name of the company where the experience was gained */
  companyName: string;
  /** URL or path to the company's logo image */
  companyLogo?: string;
  /** Optional logo used in dark mode */
  companyLogoDark?: string;
  /** URL to the company's website. */
  companyWebsite?: string;
  /**
   * List of positions held at the company
   * @fumadocsHref #experiencepositionitemtype
   * */
  positions: ExperiencePositionItemType[];
  /** Indicates if this is the user's current employer */
  isCurrentEmployer?: boolean;
};

export type WorkExperienceProps = {
  className?: string;
  /** @fumadocsHref #experienceitemtype */
  experiences: ExperienceItemType[];
};

export function WorkExperience({
  className,
  experiences,
}: WorkExperienceProps) {
  return (
    <div className={cn("bg-background px-4 text-foreground", className)}>
      {experiences.map((experience) => (
        <ExperienceItem key={experience.id} experience={experience} />
      ))}
    </div>
  );
}

export type ExperienceItemProps = {
  experience: ExperienceItemType;
};

export function ExperienceItem({ experience }: ExperienceItemProps) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-3 not-prose">
        <div className="flex justify-center items-center bg-muted border border-muted-foreground/15 rounded-lg ring-1 ring-line ring-offset-1 ring-offset-background size-6 text-muted-foreground shrink-0">
          {experience.companyLogo ? (
            <>
              <Image
                src={experience.companyLogo}
                alt={experience.companyName}
                width={40}
                height={40}
                className={cn(
                  "size-5 object-contain",
                  experience.companyLogoDark && "dark:hidden",
                )}
              />
              {experience.companyLogoDark && (
                <Image
                  src={experience.companyLogoDark}
                  alt={experience.companyName}
                  width={40}
                  height={40}
                  className="hidden dark:block size-5 object-contain"
                />
              )}
            </>
          ) : (
            <span className="flex bg-zinc-300 dark:bg-zinc-600 rounded-full size-2" />
          )}
        </div>

        <h3 className="font-semibold text-xl/snug">
          {experience.companyWebsite ? (
            <a
              className="link"
              href={experience.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
            >
              {experience.companyName}
            </a>
          ) : (
            experience.companyName
          )}
        </h3>

        {experience.isCurrentEmployer && (
          <span
            className="relative flex justify-center items-center"
            aria-label="Current Employer"
          >
            <span className="inline-flex absolute bg-sky-500 opacity-50 rounded-full size-3 animate-ping" />
            <span className="inline-flex relative bg-sky-500 rounded-full size-2" />
          </span>
        )}
      </div>

      <div className="before:top-3 before:bottom-3 before:left-3 before:absolute relative space-y-4 before:bg-border before:w-px">
        {experience.positions.map((position, index) => (
          <ExperiencePositionItem
            key={position.id}
            position={position}
            isLastPosition={index === experience.positions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export type ExperiencePositionItemProps = {
  position: ExperiencePositionItemType;
  isLastPosition?: boolean;
};

export function ExperiencePositionItem({
  position,
  isLastPosition = false,
}: ExperiencePositionItemProps) {
  const chevronsUpDownIconRef = useRef<ChevronsUpDownIconHandle>(null);

  const handleOpenChange = useCallback((open: boolean) => {
    const controls = chevronsUpDownIconRef.current;
    if (!controls) return;

    if (open) {
      controls.startAnimation();
    } else {
      controls.stopAnimation();
    }
  }, []);

  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;
  const duration = formatDuration(start, end);

  return (
    <Collapsible
      className="relative"
      defaultOpen={position.isExpanded}
      onOpenChange={handleOpenChange}
      disabled={!position.description}
    >
      <CollapsibleTrigger
        className={cn(
          "group/experience-position block w-full text-left select-none not-prose",
          "relative before:absolute before:-top-1 before:-right-1 before:-bottom-1.5 before:left-7 before:rounded-lg hover:before:bg-muted/30",
          "data-disabled:before:content-none",
        )}
      >
        <div className="z-1 relative flex items-start gap-3 mb-1 text-base">
          <div
            className={cn(
              "flex justify-center items-center rounded-lg size-6 shrink-0",
              "bg-muted text-muted-foreground",
              "border border-muted-foreground/15 ring-1 ring-line ring-offset-1 ring-offset-background",
              "[&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            )}
          >
            {position.icon ?? <BriefcaseBusinessIcon />}
          </div>

          <h4 className="flex-1 font-medium text-foreground text-balance">
            {position.title}
          </h4>

          <div className="group-data-disabled/experience-position:hidden [&_svg]:w-4 [&_svg]:h-lh text-muted-foreground shrink-0">
            <ChevronsUpDownIcon ref={chevronsUpDownIconRef} duration={0.15} />
          </div>
        </div>

        {/* Separators are aria-hidden: a dl may only expose dt/dd groups, and these dividers are decorative. */}
        <dl className="z-1 relative flex items-center gap-2 pl-9 text-muted-foreground text-sm">
          {position.employmentType && (
            <>
              <div>
                <dt className="sr-only">Employment Type</dt>
                <dd>{position.employmentType}</dd>
              </div>

              <Separator
                className="data-vertical:self-center data-vertical:h-4"
                orientation="vertical"
                aria-hidden
              />
            </>
          )}

          <div>
            <dt className="sr-only">Employment Period</dt>
            <dd className="flex items-center gap-0.5 tabular-nums">
              <span>{formatPeriodLabel(start)}</span>
              <span className="font-mono">—</span>
              {isOngoing ? (
                <InfinityIcon
                  className="size-4.5 translate-y-[0.5px]"
                  aria-label="Present"
                />
              ) : (
                <span>{formatPeriodLabel(end)}</span>
              )}
            </dd>
          </div>

          {duration && (
            <>
              <Separator
                className="data-vertical:self-center data-vertical:h-4"
                orientation="vertical"
                aria-hidden
              />
              <div>
                <dt className="sr-only">Duration</dt>
                <dd className="tabular-nums">{duration}</dd>
              </div>
            </>
          )}
        </dl>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden">
        {position.description && (
          <Prose className="pt-2 pl-9">
            <ReactMarkdown>{position.description}</ReactMarkdown>
          </Prose>
        )}
      </CollapsibleContent>

      {Array.isArray(position.skills) && position.skills.length > 0 && (
        <ul
          className={cn(
            "relative flex flex-wrap gap-1.5 pt-3 pl-9 not-prose",
            isLastPosition &&
              "before:absolute before:top-[1.4rem] before:bottom-0 before:left-3 before:w-px before:bg-[color-mix(in_oklab,var(--portfolio-accent)_2.5%,var(--background))] after:absolute after:top-[1.4rem] after:left-3 after:h-px after:w-4 after:bg-border",
          )}
        >
          {position.skills.map((skill, index) => (
            <li key={index} className="flex">
              <Skill>{skill}</Skill>
            </li>
          ))}
        </ul>
      )}
    </Collapsible>
  );
}

function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "dark:prose-invert max-w-none prose prose-ncdai prose-zinc",
        className,
      )}
      {...props}
    />
  );
}

function Skill({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-muted/50 px-1.5 py-0.5 border rounded-md font-mono text-muted-foreground text-xs",
        className,
      )}
      {...props}
    />
  );
}

function formatDuration(start: string, end?: string): string {
  const startHasMonth = start.includes(".");
  const endHasMonth = end ? end.includes(".") : true;

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = parseInt(end, 10) - parseInt(start, 10);
    if (years <= 0) {
      return "";
    }
    return `${years}y`;
  }

  const startDate = parsePeriodDate(start, "first");
  const endDate = end ? parsePeriodDate(end, "last") : new Date();

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1;
  if (totalMonths <= 0) {
    return "";
  }

  if (totalMonths < 12) {
    return `${totalMonths}m`;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (months === 0) {
    return `${years}y`;
  }
  return `${years}y ${months}m`;
}

function formatPeriodLabel(period: string): string {
  if (!period.includes(".")) {
    return period;
  }

  return format(parse(period, "MM.yyyy", new Date()), "MMM yyyy");
}

function parsePeriodDate(str: string, fallbackMonth: "first" | "last"): Date {
  if (str.includes(".")) {
    return parse(str, "MM.yyyy", new Date());
  }
  return parse(
    `${fallbackMonth === "last" ? "12" : "01"}.${str}`,
    "MM.yyyy",
    new Date(),
  );
}
