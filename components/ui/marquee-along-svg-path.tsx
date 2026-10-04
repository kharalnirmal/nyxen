"use client";

import React, {
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
} from "react";
import {
  mix,
  motion,
  type MotionValue,
  type SpringOptions,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax";

interface CSSVariableInterpolation {
  property: string;
  from: number | string;
  to: number | string;
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice";

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`;

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode;
  className?: string;
  path: string;
  pathId?: string;
  preserveAspectRatio?: PreserveAspectRatio;
  showPath?: boolean;
  width?: string | number;
  height?: string | number;
  viewBox?: string;
  baseVelocity?: number;
  direction?: "normal" | "reverse";
  easing?: (value: number) => number;
  slowdownOnHover?: boolean;
  slowDownFactor?: number;
  slowDownSpringConfig?: SpringOptions;
  useScrollVelocity?: boolean;
  scrollAwareDirection?: boolean;
  scrollSpringConfig?: SpringOptions;
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null;
  repeat?: number;
  draggable?: boolean;
  dragSensitivity?: number;
  dragVelocityDecay?: number;
  dragAwareDirection?: boolean;
  grabCursor?: boolean;
  enableRollingZIndex?: boolean;
  zIndexBase?: number;
  zIndexRange?: number;
  cssVariableInterpolation?: CSSVariableInterpolation[];
  responsive?: boolean;
}

interface MarqueeItemProps {
  baseOffset: MotionValue<number>;
  child: React.ReactNode;
  cssVariableInterpolation: CSSVariableInterpolation[];
  draggable: boolean;
  easing?: (value: number) => number;
  enableRollingZIndex: boolean;
  grabCursor: boolean;
  itemIndex: number;
  itemCount: number;
  path: string;
  repeated: boolean;
  zIndexBase: number;
  zIndexRange: number;
}

function MarqueeItem({
  baseOffset,
  child,
  cssVariableInterpolation,
  draggable,
  easing,
  enableRollingZIndex,
  grabCursor,
  itemIndex,
  itemCount,
  path,
  repeated,
  zIndexBase,
  zIndexRange,
}: MarqueeItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const rawDistance = useTransform(baseOffset, (value) =>
    wrap(0, 100, value + (itemIndex * 100) / itemCount),
  );
  const currentDistance = useTransform(rawDistance, (value) =>
    easing ? easing(value / 100) * 100 : value,
  );
  const itemOffset = useTransform(currentDistance, (value) => `${value}%`);
  const zIndex = useTransform(currentDistance, (value) =>
    Math.floor(zIndexBase + (value / 100) * zIndexRange),
  );
  const variableMixers = useMemo(
    () =>
      cssVariableInterpolation.map(({ property, from, to }) => ({
        property,
        mixer: mix(from, to),
      })),
    [cssVariableInterpolation],
  );

  useMotionValueEvent(currentDistance, "change", (value) => {
    for (const { property, mixer } of variableMixers) {
      itemRef.current?.style.setProperty(property, String(mixer(value / 100)));
    }
  });

  return (
    <motion.div
      ref={itemRef}
      className={cn(
        "absolute top-0 left-0",
        draggable && grabCursor && "cursor-grab",
      )}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
        willChange: "offset-distance",
        backfaceVisibility: "hidden",
      }}
      aria-hidden={repeated}
    >
      {child}
    </motion.div>
  );
}

export default function MarqueeAlongSvgPath({
  children,
  className,
  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,
  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,
  repeat = 3,
  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,
  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,
  cssVariableInterpolation = [],
  responsive = false,
}: MarqueeAlongSvgPathProps) {
  const container = useRef<HTMLDivElement>(null);
  const marqueeContainerRef = useRef<HTMLDivElement>(null);
  const baseOffset = useMotionValue(0);
  const generatedId = useId();
  const id = pathId ?? `marquee-path-${generatedId.replaceAll(":", "")}`;
  const directScrollRef = useMemo(
    () => ({
      current:
        scrollContainer && !("current" in scrollContainer)
          ? scrollContainer
          : null,
    }),
    [scrollContainer],
  );
  const scrollTarget = scrollContainer
    ? "current" in scrollContainer
      ? scrollContainer
      : directScrollRef
    : container;

  useEffect(() => {
    if (!responsive) return;

    const [, , viewBoxWidth = 100, viewBoxHeight = 100] = viewBox
      .trim()
      .split(/[\s,]+/)
      .map(Number);

    const updateScale = () => {
      const wrapper = container.current;
      const marqueeContainer = marqueeContainerRef.current;
      if (!wrapper || !marqueeContainer) return;

      const scale = Math.min(
        wrapper.clientWidth / viewBoxWidth,
        wrapper.clientHeight / viewBoxHeight,
      );
      const offsetX = (wrapper.clientWidth - viewBoxWidth * scale) / 2;
      const offsetY = (wrapper.clientHeight - viewBoxHeight * scale) / 2;

      marqueeContainer.style.width = `${viewBoxWidth}px`;
      marqueeContainer.style.height = `${viewBoxHeight}px`;
      marqueeContainer.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      marqueeContainer.style.transformOrigin = "top left";
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, [responsive, viewBox]);

  const items = useMemo(() => {
    const childrenArray = React.Children.toArray(children);

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => ({
        child,
        itemIndex: repeatIndex * childrenArray.length + childIndex,
        key: `${childIndex}-${repeatIndex}`,
        repeated: repeatIndex > 0,
      })),
    );
  }, [children, repeat]);

  const { scrollY } = useScroll({ container: scrollTarget });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig);
  const isHovered = useRef(false);
  const isDragging = useRef(false);
  const dragVelocity = useRef(0);
  const directionFactor = useRef(direction === "normal" ? 1 : -1);
  const hoverFactorValue = useMotionValue(1);
  const defaultVelocity = useMotionValue(1);
  const smoothHoverFactor = useSpring(
    hoverFactorValue,
    slowDownSpringConfig,
  );
  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false },
  );

  useEffect(() => {
    directionFactor.current = direction === "normal" ? 1 : -1;
  }, [direction]);

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current);
      dragVelocity.current *= 0.9;
      if (Math.abs(dragVelocity.current) < 0.01) dragVelocity.current = 0;
      return;
    }

    hoverFactorValue.set(
      isHovered.current && slowdownOnHover ? slowDownFactor : 1,
    );

    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get();

    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) directionFactor.current = -1;
      if (velocityFactor.get() > 0) directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    if (draggable) {
      moveBy += dragVelocity.current;
      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current);
      }
      if (Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay;
      } else {
        dragVelocity.current = 0;
      }
    }

    baseOffset.set(baseOffset.get() + moveBy);
  });

  const lastPointerPosition = useRef({ x: 0, y: 0 });

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggable) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      isDragging.current = true;
      dragVelocity.current = 0;
      lastPointerPosition.current = { x: event.clientX, y: event.clientY };
    },
    [draggable],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggable || !isDragging.current) return;

      const deltaX = event.clientX - lastPointerPosition.current.x;
      const deltaY = event.clientY - lastPointerPosition.current.y;
      const distance = Math.hypot(deltaX, deltaY);
      dragVelocity.current = (deltaX > 0 ? distance : -distance) * dragSensitivity;
      lastPointerPosition.current = { x: event.clientX, y: event.clientY };
    },
    [dragSensitivity, draggable],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggable) return;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      isDragging.current = false;
    },
    [draggable],
  );

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        isHovered.current = true;
      }}
      onMouseLeave={() => {
        isHovered.current = false;
      }}
      className={cn(
        "relative touch-none select-none",
        draggable && grabCursor && "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      <div
        ref={marqueeContainerRef}
        className="relative"
        style={{ contain: "layout style" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox={viewBox}
          preserveAspectRatio={preserveAspectRatio}
          className="h-full w-full"
          aria-hidden="true"
        >
          <path
            id={id}
            d={path}
            stroke={showPath ? "currentColor" : "none"}
            fill="none"
          />
        </svg>

        {items.map(({ child, itemIndex, key, repeated }) => (
          <MarqueeItem
            key={key}
            baseOffset={baseOffset}
            child={child}
            cssVariableInterpolation={cssVariableInterpolation}
            draggable={draggable}
            easing={easing}
            enableRollingZIndex={enableRollingZIndex}
            grabCursor={grabCursor}
            itemCount={items.length}
            itemIndex={itemIndex}
            path={path}
            repeated={repeated}
            zIndexBase={zIndexBase}
            zIndexRange={zIndexRange}
          />
        ))}
      </div>
    </div>
  );
}
