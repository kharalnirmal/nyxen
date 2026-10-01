"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export type FluidGradientTextProps = {
  /** Text content rendered inside the SVG. */
  text: string;
  /**
   * SVG viewBox width used to scale the gradient and text layout.
   * @default 1200
   * */
  svgViewBoxWidth?: number;
  /**
   * SVG viewBox height used as the base text size.
   * @default 300
   * */
  svgViewBoxHeight?: number;
};

export function FluidGradientText({
  text,
  svgViewBoxWidth = 1200,
  svgViewBoxHeight = 300,
}: FluidGradientTextProps) {
  const gradientX1Raw = useMotionValue(0.5);
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, svgViewBoxWidth]),
    {
      stiffness: 150,
      damping: 25,
    },
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const containerRect = event.currentTarget.getBoundingClientRect();
    gradientX1Raw.set(
      (event.clientX - containerRect.left) / containerRect.width,
    );
  };

  const handleMouseLeave = () => {
    gradientX1Raw.set(0.5);
  };

  return (
    <div
      className="after:bottom-0 after:absolute relative after:bg-current/15 after:w-full after:h-px size-full overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="size-full translate-y-[37.5%] select-none"
        viewBox={`0 0 ${svgViewBoxWidth} ${svgViewBoxHeight}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          stroke="currentColor"
          strokeOpacity="0.1"
          strokeWidth="2"
          fill="url(#fluid_gradient_text_linear)"
          style={{
            fontFamily: "MyFont,Helvetica",
            fontSize: svgViewBoxHeight,
            fontWeight: "bold",
            letterSpacing: "-0.08em",
          }}
        >
          {text}
        </text>
        <defs>
          <motion.linearGradient
            id="fluid_gradient_text_linear"
            x1={gradientX1}
            y1="0"
            x2={svgViewBoxWidth / 2}
            y2={svgViewBoxHeight}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.625" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" />
          </motion.linearGradient>
        </defs>
      </svg>
    </div>
  );
}
