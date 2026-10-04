"use client";

import { useEffect, useId, useRef } from "react";
import type { Transition } from "motion/react";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { metalClickSound } from "@/lib/metal-click";
import { useSound } from "@/hooks/use-sound";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
};

/* -------------------------------------------------------------------------- */
/*  Isometric letter geometry                                                  */
/*                                                                            */
/*  Edit WORD / GLYPHS to change the lettering. Every letter is a 7x7 pixel   */
/*  bitmap ("X" = solid cell). Each cell is extruded into an isometric block, */
/*  and the "normal" and "pressed" path data are generated together so they   */
/*  always have the same structure (required for Motion to morph `d`).        */
/* -------------------------------------------------------------------------- */

// geometry:start
const WORD = ["N", "K"];

const GLYPHS: Record<string, string[]> = {
  N: [
    "XX...XX",
    "XXX..XX",
    "XXXX.XX",
    "XX.XXXX",
    "XX..XXX",
    "XX...XX",
    "XX...XX",
  ],
  K: [
    "XX...XX",
    "XX..XX.",
    "XX.XX..",
    "XXXX...",
    "XX.XX..",
    "XX..XX.",
    "XX...XX",
  ],
};

const GLYPH_WIDTH = 7;
const LETTER_GAP = 1;

const SCALE = 0.45; // overall size of the mark
const A = 55.4256 * SCALE; // horizontal step of one cell (true 30° isometric)
const B = 32 * SCALE; // vertical step of one cell
const H = 32 * SCALE; // block height
const PRESS = H / 2; // how far the top sinks when pressed
const PAD = 0.5;

type Pt = [number, number];
type Cell = { i: number; j: number };

function buildGeometry() {
  // Text runs along +j (up-right on screen), the top of a letter points
  // along -i (up-left), so the word reads naturally on the isometric floor.
  const cells: Cell[] = [];
  WORD.forEach((char, letter) => {
    const rows = GLYPHS[char];
    rows.forEach((row, i) => {
      [...row].forEach((ch, col) => {
        if (ch === "X") {
          cells.push({ i, j: letter * (GLYPH_WIDTH + LETTER_GAP) + col });
        }
      });
    });
  });

  const filled = new Set(cells.map((c) => `${c.i},${c.j}`));
  const has = (i: number, j: number) => filled.has(`${i},${j}`);

  // Bounds so the viewBox hugs the artwork.
  let minDiff = Infinity;
  let maxDiff = -Infinity;
  let maxSum = -Infinity;
  for (const { i, j } of cells) {
    for (const di of [0, 1]) {
      for (const dj of [0, 1]) {
        const d = i + di - (j + dj);
        minDiff = Math.min(minDiff, d);
        maxDiff = Math.max(maxDiff, d);
        maxSum = Math.max(maxSum, i + di + j + dj);
      }
    }
  }
  const X0 = PAD;
  const Y0 = PAD + H - minDiff * B;
  const width = X0 + maxSum * A + PAD;
  const height = Y0 + maxDiff * B + PAD;

  const f = (n: number) => n.toFixed(2);
  const p = ([x, y]: Pt) => `${f(x)} ${f(y)}`;
  const bottom = (i: number, j: number): Pt => [
    X0 + (i + j) * A,
    Y0 + (i - j) * B,
  ];
  const top = (i: number, j: number, drop: number): Pt => {
    const [x, y] = bottom(i, j);
    return [x, y - H + drop];
  };
  const seg = (a: Pt, b: Pt) => `M${p(a)} L${p(b)}`;

  // Back-to-front so nearer blocks cover farther ones.
  const ordered = [...cells].sort((a, b) => a.i - a.j - (b.i - b.j));

  function build(drop: number) {
    // Top faces: one path so neighbouring cells merge without seams.
    const tops = cells
      .map(({ i, j }) =>
        [
          `M${p(top(i, j, drop))}`,
          `L${p(top(i + 1, j, drop))}`,
          `L${p(top(i + 1, j + 1, drop))}`,
          `L${p(top(i, j + 1, drop))}`,
          "Z",
        ].join(" "),
      )
      .join(" ");

    // Outline of the top surface: only edges that border an empty cell.
    const outline: string[] = [];
    for (const { i, j } of cells) {
      if (!has(i - 1, j))
        outline.push(seg(top(i, j, drop), top(i, j + 1, drop)));
      if (!has(i, j + 1))
        outline.push(seg(top(i, j + 1, drop), top(i + 1, j + 1, drop)));
      if (!has(i + 1, j))
        outline.push(seg(top(i + 1, j, drop), top(i + 1, j + 1, drop)));
      if (!has(i, j - 1))
        outline.push(seg(top(i, j, drop), top(i + 1, j, drop)));
    }

    const perCell = ordered.map(({ i, j }) => {
      const fills: string[] = [];
      const strokes: string[] = [];
      const verticals = new Map<string, string>();
      const vertical = (vi: number, vj: number) =>
        verticals.set(`${vi},${vj}`, seg(top(vi, vj, drop), bottom(vi, vj)));

      // Face towards +i (lower right on screen).
      if (!has(i + 1, j)) {
        fills.push(
          [
            `M${p(top(i + 1, j, drop))}`,
            `L${p(top(i + 1, j + 1, drop))}`,
            `L${p(bottom(i + 1, j + 1))}`,
            `L${p(bottom(i + 1, j))}`,
            "Z",
          ].join(" "),
        );
        strokes.push(seg(bottom(i + 1, j), bottom(i + 1, j + 1)));
        // Skip the vertical when the same flat wall continues next door.
        if (!(has(i, j - 1) && !has(i + 1, j - 1))) vertical(i + 1, j);
        if (!(has(i, j + 1) && !has(i + 1, j + 1))) vertical(i + 1, j + 1);
      }

      // Face towards -j (lower left on screen).
      if (!has(i, j - 1)) {
        fills.push(
          [
            `M${p(top(i, j, drop))}`,
            `L${p(top(i + 1, j, drop))}`,
            `L${p(bottom(i + 1, j))}`,
            `L${p(bottom(i, j))}`,
            "Z",
          ].join(" "),
        );
        strokes.push(seg(bottom(i, j), bottom(i + 1, j)));
        if (!(has(i - 1, j) && !has(i - 1, j - 1))) vertical(i, j);
        if (!(has(i + 1, j) && !has(i + 1, j - 1))) vertical(i + 1, j);
      }

      return {
        fill: fills.join(" "),
        stroke: [...strokes, ...verticals.values()].join(" "),
      };
    });

    return { tops, outline: outline.join(" "), perCell };
  }

  const normal = build(0);
  const pressed = build(PRESS);

  return {
    width,
    height,
    tops: { normal: normal.tops, pressed: pressed.tops },
    outline: { normal: normal.outline, pressed: pressed.outline },
    cells: normal.perCell
      .map((c, n) => ({
        fill: { normal: c.fill, pressed: pressed.perCell[n].fill },
        stroke: { normal: c.stroke, pressed: pressed.perCell[n].stroke },
      }))
      .filter((c) => c.fill.normal !== ""),
  };
}

const GEOMETRY = buildGeometry();
// geometry:end

/**
 * An isometric "NK" mark whose outline is traced by a gradient highlight that
 * follows the cursor, paired with a springy press effect and a tactile click.
 *
 * - A `radialGradient` whose center springs toward the pointer (the spotlight)
 *   is layered as a second stroke over the base outline.
 * - `whileTap="pressed"` morphs every path `d` between two states.
 *
 * Based on the original spotlight logo by ncdai, inspired by tailwindcss.com.
 */
export function SpotlightLogo() {
  const id = useId();
  const ids = {
    facePattern: `spotlight-logo-face-pattern-${id}`,
    faceFill: `spotlight-logo-face-fill-${id}`,
    topStroke: `spotlight-logo-top-stroke-${id}`,
    cellStroke: `spotlight-logo-cell-stroke-${id}`,
    radialGradient: `spotlight-logo-radial-gradient-${id}`,
  };

  const ref = useRef<SVGSVGElement>(null);

  const [play] = useSound(metalClickSound);

  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { margin: "80px" });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const cx = useSpring(useTransform(mouseX, [0, 1], [0, GEOMETRY.width]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  });

  const cy = useSpring(useTransform(mouseY, [0, 1], [0, GEOMETRY.height]), {
    stiffness: 300,
    damping: 30,
    mass: 0.1,
  });

  useEffect(() => {
    if (shouldReduceMotion || !isInView) {
      return;
    }

    if (window.matchMedia("(hover: none)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [shouldReduceMotion, isInView, mouseX, mouseY]);

  return (
    <motion.svg
      ref={ref}
      className="h-auto w-full cursor-pointer touch-manipulation outline-none focus:outline-none focus-visible:opacity-75 focus-visible:outline-none [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]"
      viewBox={`0 0 ${GEOMETRY.width.toFixed(2)} ${GEOMETRY.height.toFixed(2)}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interactive NK logo. Click for sound."
      role="button"
      tabIndex={0}
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
      onPointerDown={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          play();
        }
      }}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        {/* Top faces of every block, merged into one shape. */}
        <motion.path
          id={ids.faceFill}
          variants={{
            normal: { d: GEOMETRY.tops.normal },
            pressed: { d: GEOMETRY.tops.pressed },
          }}
          transition={transition}
        />

        {/* Outline of the top surface. */}
        <motion.path
          id={ids.topStroke}
          variants={{
            normal: { d: GEOMETRY.outline.normal },
            pressed: { d: GEOMETRY.outline.pressed },
          }}
          transition={transition}
        />

        {/* Bottom edges and vertical edges of each block's visible walls. */}
        {GEOMETRY.cells.map((cell, n) => (
          <motion.path
            key={n}
            id={`${ids.cellStroke}-${n}`}
            variants={{
              normal: { d: cell.stroke.normal },
              pressed: { d: cell.stroke.pressed },
            }}
            transition={transition}
          />
        ))}

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      {/* Walls, drawn back to front so nearer blocks cover farther ones. */}
      {GEOMETRY.cells.map((cell, n) => (
        <g key={n} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            className="fill-background"
            variants={{
              normal: { d: cell.fill.normal },
              pressed: { d: cell.fill.pressed },
            }}
            transition={transition}
          />
          <use href={`#${ids.cellStroke}-${n}`} stroke="var(--stroke)" />
          <use
            href={`#${ids.cellStroke}-${n}`}
            stroke={`url(#${ids.radialGradient})`}
          />
        </g>
      ))}

      {/* Top faces always sit above the walls. */}
      <use href={`#${ids.faceFill}`} className="fill-background" />
      <use href={`#${ids.faceFill}`} fill={`url(#${ids.facePattern})`} />

      <g strokeLinecap="round" strokeLinejoin="round">
        <use href={`#${ids.topStroke}`} stroke="var(--stroke)" />
        <use
          href={`#${ids.topStroke}`}
          stroke={`url(#${ids.radialGradient})`}
        />
      </g>
    </motion.svg>
  );
}
