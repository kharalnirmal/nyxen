"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import styles from "./InteractiveAsciiFooter.module.css";

const ASCII_CHARACTERS = "01#@%&*+abcxyz?<>/\\";
const SAMPLE_ALPHA_THRESHOLD = 128;
const MAX_DEVICE_PIXEL_RATIO = 2;
const SCATTER_DURATION = 1100;
const DROP_DURATION = 1250;
const HOLD_DURATION = 1400;
const REFORM_DURATION = 1750;

type InteractionPhase =
  | "entrance"
  | "name"
  | "scatter"
  | "drop"
  | "hold"
  | "reform";

type AsciiParticle = {
  char: string;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  startX: number;
  startY: number;
  entranceDelay: number;
  opacity: number;
  velocityX: number;
  velocityY: number;
  phaseStartX: number;
  phaseStartY: number;
  targetX: number;
  targetY: number;
  phaseDelay: number;
  phaseDuration: number;
  characterIndex: number;
  nextCharacterAt: number;
};

type InteractiveAsciiFooterProps = {
  name?: string;
  className?: string;
};

function pickCharacter(x: number, y: number, index: number) {
  const hash = Math.abs((x * 73856093) ^ (y * 19349663) ^ (index * 83492791));

  return ASCII_CHARACTERS[hash % ASCII_CHARACTERS.length];
}

function seededValue(x: number, y: number, salt: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + salt) * 43758.5453;

  return value - Math.floor(value);
}

function createParticles(
  width: number,
  height: number,
  name: string,
  fontFamily: string,
  fontWeight: number,
) {
  const mask = document.createElement("canvas");
  const maskContext = mask.getContext("2d", { willReadFrequently: true });

  if (!maskContext) {
    return { particles: [], sampleGap: 6 };
  }

  mask.width = Math.ceil(width);
  mask.height = Math.ceil(height);

  const referenceSize = 100;
  const isSmallScreen = width <= 640;
  const horizontalPadding = Math.max(12, width * 0.018);
  const availableWidth = Math.max(1, width - horizontalPadding * 2);
  const availableHeight = Math.max(1, height * (isSmallScreen ? 1.08 : 0.64));

  maskContext.font = `${fontWeight} ${referenceSize}px ${fontFamily}`;
  const referenceWidth = maskContext.measureText(name).width;
  const fontSize = Math.max(
    1,
    Math.min(availableHeight, (availableWidth / referenceWidth) * referenceSize),
  );

  maskContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  maskContext.fillStyle = "#000";
  maskContext.textAlign = "center";
  maskContext.textBaseline = "middle";

  if (isSmallScreen && name.length === 2) {
    const letterOffset = availableWidth * 0.16;
    maskContext.fillText(name[0], width / 2 - letterOffset, height / 2);
    maskContext.fillText(name[1], width / 2 + letterOffset, height / 2);
  } else {
    maskContext.fillText(name, width / 2, height / 2);
  }

  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const sampleGap = Math.max(5, Math.min(8, Math.round(width / 180)));
  const particles: AsciiParticle[] = [];

  for (let y = 0; y < mask.height; y += sampleGap) {
    for (let x = 0; x < mask.width; x += sampleGap) {
      const alpha = pixels[(y * mask.width + x) * 4 + 3];

      if (alpha >= SAMPLE_ALPHA_THRESHOLD) {
        const angle = seededValue(x, y, 17) * Math.PI * 2;
        const distance = sampleGap * (4 + seededValue(x, y, 29) * 8);

        particles.push({
          char: pickCharacter(x, y, particles.length),
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance + height * 0.12,
          homeX: x,
          homeY: y,
          startX: x + Math.cos(angle) * distance,
          startY: y + Math.sin(angle) * distance + height * 0.12,
          entranceDelay:
            (y / height) * 0.2 + seededValue(x, y, 43) * 0.18,
          opacity: 0,
          velocityX: 0,
          velocityY: 0,
          phaseStartX: x,
          phaseStartY: y,
          targetX: x,
          targetY: y,
          phaseDelay: 0,
          phaseDuration: 0,
          characterIndex: Math.floor(
            seededValue(x, y, 59) * ASCII_CHARACTERS.length,
          ),
          nextCharacterAt: seededValue(x, y, 71) * 220,
        });
      }
    }
  }

  return { particles, sampleGap };
}

export default function InteractiveAsciiFooter({
  name = "nirmal kharal",
  className,
}: InteractiveAsciiFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorLabelRef = useRef<HTMLDivElement>(null);
  const lowercaseName = name.toLowerCase();

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;
    const cursorLabel = cursorLabelRef.current;

    if (!footer || !canvas || !cursorLabel) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let resizeFrame = 0;
    let animationFrame = 0;
    let disposed = false;
    let isVisible = false;
    let hasEntered = false;
    let phase: InteractionPhase = "entrance";
    let phaseStartedAt = 0;
    let clickIteration = 0;
    let particles: AsciiParticle[] = [];
    let sampleGap = 6;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let cursorActive = false;
    let cursorX = 0;
    let cursorY = 0;
    let cursorTargetX = 0;
    let cursorTargetY = 0;
    let lastFrameTime = performance.now();
    let entranceTween: gsap.core.Tween | undefined;
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const entranceEase = gsap.parseEase("back.out(1.15)");
    const scatterEase = gsap.parseEase("power3.out");
    const dropEase = gsap.parseEase("bounce.out");
    const reformEase = gsap.parseEase("back.out(1.1)");

    const clampProgress = (value: number) => Math.min(1, Math.max(0, value));

    const render = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      for (const particle of particles) {
        context.globalAlpha = particle.opacity;
        context.fillText(particle.char, particle.x, particle.y);
      }

      context.globalAlpha = 1;
    };

    const finishEntrance = () => {
      for (const particle of particles) {
        particle.x = particle.homeX;
        particle.y = particle.homeY;
        particle.opacity = 1;
        particle.velocityX = 0;
        particle.velocityY = 0;
      }

      phase = "name";
      hasEntered = true;
    };

    const playEntrance = () => {
      entranceTween?.kill();
      phase = "entrance";

      if (reducedMotionQuery.matches) {
        finishEntrance();
        return;
      }

      const animation = { progress: 0 };

      entranceTween = gsap.to(animation, {
        progress: 1,
        duration: 1.8,
        ease: "none",
        onUpdate: () => {
          for (const particle of particles) {
            const localProgress = Math.min(
              1,
              Math.max(
                0,
                (animation.progress - particle.entranceDelay) /
                  (1 - particle.entranceDelay),
              ),
            );
            const easedProgress = entranceEase(localProgress);

            particle.x = gsap.utils.interpolate(
              particle.startX,
              particle.homeX,
              easedProgress,
            );
            particle.y = gsap.utils.interpolate(
              particle.startY,
              particle.homeY,
              easedProgress,
            );
            particle.opacity = Math.min(1, localProgress * 2.5);
          }
        },
        onComplete: finishEntrance,
      });
    };

    const finishReform = () => {
      for (const particle of particles) {
        particle.x = particle.homeX;
        particle.y = particle.homeY;
        particle.velocityX = 0;
        particle.velocityY = 0;
      }

      phase = "name";
    };

    const startReform = (now: number) => {
      if (reducedMotionQuery.matches) {
        finishReform();
        return;
      }

      phase = "reform";
      phaseStartedAt = now;

      particles.forEach((particle, index) => {
        particle.phaseStartX = particle.x;
        particle.phaseStartY = particle.y;
        particle.targetX = particle.homeX;
        particle.targetY = particle.homeY;
        particle.phaseDelay = seededValue(
          particle.homeX,
          particle.homeY,
          211 + index,
        ) * 260;
        particle.phaseDuration =
          950 +
          seededValue(particle.homeY, particle.homeX, 223 + index) * 350;
      });
    };

    const startDrop = (now: number) => {
      phase = "drop";
      phaseStartedAt = now;
      const margin = Math.max(10, sampleGap);
      const baseline = canvasHeight - Math.max(16, sampleGap * 1.5);
      const usableWidth = Math.max(1, canvasWidth - margin * 2);

      particles.forEach((particle, index) => {
        particle.x = particle.targetX;
        particle.y = particle.targetY;
        particle.phaseStartX = particle.x;
        particle.phaseStartY = particle.y;
        particle.targetX =
          margin +
          seededValue(index, particle.homeX, 131 + clickIteration) *
            usableWidth;
        particle.targetY = baseline;
        particle.phaseDelay =
          seededValue(particle.homeY, index, 149 + clickIteration) * 140;
        particle.phaseDuration =
          700 +
          seededValue(index, particle.homeY, 163 + clickIteration) * 300;
      });
    };

    const startScatter = (now: number) => {
      if (!hasEntered || phase !== "name") {
        return;
      }

      clickIteration += 1;
      const margin = Math.max(12, sampleGap * 2);
      const usableWidth = Math.max(1, canvasWidth - margin * 2);
      const usableHeight = Math.max(1, canvasHeight - margin * 2);

      phase = "scatter";
      phaseStartedAt = now;

      particles.forEach((particle, index) => {
        particle.phaseStartX = particle.x;
        particle.phaseStartY = particle.y;
        particle.targetX =
          margin +
          seededValue(particle.homeX, index, 83 + clickIteration) *
            usableWidth;
        particle.targetY =
          margin +
          seededValue(index, particle.homeY, 97 + clickIteration) *
            usableHeight;
        particle.phaseDelay =
          seededValue(index, particle.homeX, 109 + clickIteration) * 140;
        particle.phaseDuration =
          700 +
          seededValue(particle.homeY, index, 127 + clickIteration) * 240;
        particle.velocityX = 0;
        particle.velocityY = 0;
      });

      if (reducedMotionQuery.matches) {
        startDrop(now);

        for (const particle of particles) {
          particle.x = particle.targetX;
          particle.y = particle.targetY;
        }

        phase = "hold";
        phaseStartedAt = now;
      }
    };

    const updateSequence = (now: number) => {
      const elapsed = now - phaseStartedAt;

      if (phase === "scatter") {
        for (const particle of particles) {
          const progress = clampProgress(
            (elapsed - particle.phaseDelay) / particle.phaseDuration,
          );
          const easedProgress = scatterEase(progress);
          particle.x = gsap.utils.interpolate(
            particle.phaseStartX,
            particle.targetX,
            easedProgress,
          );
          particle.y = gsap.utils.interpolate(
            particle.phaseStartY,
            particle.targetY,
            easedProgress,
          );
        }

        if (elapsed >= SCATTER_DURATION) {
          startDrop(now);
        }
      } else if (phase === "drop") {
        for (const particle of particles) {
          const progress = clampProgress(
            (elapsed - particle.phaseDelay) / particle.phaseDuration,
          );
          particle.x = gsap.utils.interpolate(
            particle.phaseStartX,
            particle.targetX,
            scatterEase(progress),
          );
          particle.y = gsap.utils.interpolate(
            particle.phaseStartY,
            particle.targetY,
            dropEase(progress),
          );
        }

        if (elapsed >= DROP_DURATION) {
          for (const particle of particles) {
            particle.x = particle.targetX;
            particle.y = particle.targetY;
          }

          phase = "hold";
          phaseStartedAt = now;
        }
      } else if (phase === "hold") {
        const holdDuration = reducedMotionQuery.matches ? 600 : HOLD_DURATION;

        if (elapsed >= holdDuration) {
          startReform(now);
        }
      } else if (phase === "reform") {
        for (const particle of particles) {
          const progress = clampProgress(
            (elapsed - particle.phaseDelay) / particle.phaseDuration,
          );
          const easedProgress = reformEase(progress);
          particle.x = gsap.utils.interpolate(
            particle.phaseStartX,
            particle.targetX,
            easedProgress,
          );
          particle.y = gsap.utils.interpolate(
            particle.phaseStartY,
            particle.targetY,
            easedProgress,
          );
        }

        if (elapsed >= REFORM_DURATION) {
          finishReform();
        }
      }
    };

    const updateCharacters = (now: number) => {
      const minimumDelay = reducedMotionQuery.matches ? 480 : 180;
      const delayRange = reducedMotionQuery.matches ? 620 : 320;

      particles.forEach((particle, index) => {
        if (now < particle.nextCharacterAt) {
          return;
        }

        const step =
          1 +
          Math.floor(
            seededValue(index, particle.characterIndex, now) *
              (ASCII_CHARACTERS.length - 1),
          );
        particle.characterIndex =
          (particle.characterIndex + step) % ASCII_CHARACTERS.length;
        particle.char = ASCII_CHARACTERS[particle.characterIndex];
        particle.nextCharacterAt =
          now +
          minimumDelay +
          seededValue(particle.homeX, particle.homeY, now + index) *
            delayRange;
      });
    };

    const updateNamePhysics = (frameScale: number) => {
      const influenceRadius = Math.max(
        64,
        Math.min(105, canvasWidth * 0.075),
      );
      const collisionRadius = Math.max(28, influenceRadius * 0.36);

      for (const particle of particles) {
        particle.velocityX +=
          (particle.homeX - particle.x) * 0.055 * frameScale;
        particle.velocityY +=
          (particle.homeY - particle.y) * 0.055 * frameScale;

        if (cursorActive) {
          let deltaX = particle.x - cursorX;
          let deltaY = particle.y - cursorY;
          let distance = Math.hypot(deltaX, deltaY);

          if (distance < 0.001) {
            const angle =
              seededValue(particle.homeX, particle.homeY, 251) * Math.PI * 2;
            deltaX = Math.cos(angle);
            deltaY = Math.sin(angle);
            distance = 1;
          }

          if (distance < influenceRadius) {
            const normalX = deltaX / distance;
            const normalY = deltaY / distance;
            const influence = 1 - distance / influenceRadius;
            const force = influence * influence * 4.8 * frameScale;
            particle.velocityX += normalX * force;
            particle.velocityY += normalY * force;
          }
        }

        const damping = Math.pow(0.8, frameScale);
        particle.velocityX *= damping;
        particle.velocityY *= damping;
        particle.x += particle.velocityX * frameScale;
        particle.y += particle.velocityY * frameScale;

        if (cursorActive) {
          const movedX = particle.x - cursorX;
          const movedY = particle.y - cursorY;
          const movedDistance = Math.hypot(movedX, movedY);

          if (movedDistance < collisionRadius) {
            const fallbackAngle =
              seededValue(particle.homeX, particle.homeY, 269) * Math.PI * 2;
            const normalX =
              movedDistance > 0.001
                ? movedX / movedDistance
                : Math.cos(fallbackAngle);
            const normalY =
              movedDistance > 0.001
                ? movedY / movedDistance
                : Math.sin(fallbackAngle);
            particle.x = cursorX + normalX * collisionRadius;
            particle.y = cursorY + normalY * collisionRadius;
          }
        }
      }
    };

    const tick = (now: number) => {
      const frameScale = Math.min(2, Math.max(0.25, (now - lastFrameTime) / 16.667));
      lastFrameTime = now;

      updateCharacters(now);

      const cursorFollow = 1 - Math.pow(0.7, frameScale);
      cursorX += (cursorTargetX - cursorX) * cursorFollow;
      cursorY += (cursorTargetY - cursorY) * cursorFollow;
      cursorLabel.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

      if (phase === "name" && canvasWidth > 640) {
        updateNamePhysics(frameScale);
      } else if (
        phase === "scatter" ||
        phase === "drop" ||
        phase === "hold" ||
        phase === "reform"
      ) {
        updateSequence(now);
      }

      render();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const rebuild = () => {
      const { width, height } = canvas.getBoundingClientRect();

      if (width === 0 || height === 0) {
        return;
      }

      const devicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      );

      canvas.width = Math.round(width * devicePixelRatio);
      canvas.height = Math.round(height * devicePixelRatio);
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      canvasWidth = width;
      canvasHeight = height;

      const computedStyle = window.getComputedStyle(canvas);
      const displayFont =
        computedStyle.getPropertyValue("--font-geist-sans").trim() || "sans-serif";
      const monoFont =
        computedStyle.getPropertyValue("--font-geist-mono").trim() || "monospace";
      const isSmallScreen = width <= 640;
      const displayName = isSmallScreen ? "nk" : lowercaseName;
      const fontWeight = isSmallScreen ? 900 : 500;
      const layout = createParticles(
        width,
        height,
        displayName,
        displayFont,
        fontWeight,
      );

      particles = layout.particles;
      sampleGap = layout.sampleGap;
      context.fillStyle = computedStyle.color;
      context.font = `${fontWeight} ${sampleGap * 0.9}px ${monoFont}`;
      context.textAlign = "center";
      context.textBaseline = "middle";

      if (hasEntered) {
        finishEntrance();
      } else if (isVisible) {
        playEntrance();
      } else {
        render();
      }
    };

    const scheduleRebuild = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(rebuild);
    };

    const updateThemeColor = () => {
      context.fillStyle = window.getComputedStyle(canvas).color;
      render();
    };

    const resizeObserver = new ResizeObserver(scheduleRebuild);
    const themeObserver = new MutationObserver(updateThemeColor);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasEntered) {
          return;
        }

        isVisible = true;
        intersectionObserver.disconnect();
        playEntrance();
      },
      { threshold: 0.2 },
    );
    const handleMotionPreference = () => {
      if (reducedMotionQuery.matches && isVisible && !hasEntered) {
        entranceTween?.kill();
        finishEntrance();
      } else if (
        reducedMotionQuery.matches &&
        phase !== "entrance" &&
        phase !== "name"
      ) {
        finishReform();
      }
    };
    const updateCursorTarget = (event: PointerEvent) => {
      const bounds = footer.getBoundingClientRect();
      cursorTargetX = event.clientX - bounds.left;
      cursorTargetY = event.clientY - bounds.top;
    };
    const handlePointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        return;
      }

      updateCursorTarget(event);
      cursorX = cursorTargetX;
      cursorY = cursorTargetY;
      cursorActive = true;
      cursorLabel.style.opacity = "1";
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        updateCursorTarget(event);
      }
    };
    const handlePointerLeave = () => {
      cursorActive = false;
      cursorLabel.style.opacity = "0";
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button === 0) {
        startScatter(performance.now());
      }
    };

    resizeObserver.observe(canvas);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    intersectionObserver.observe(canvas);
    reducedMotionQuery.addEventListener("change", handleMotionPreference);
    footer.addEventListener("pointerenter", handlePointerEnter);
    footer.addEventListener("pointermove", handlePointerMove);
    footer.addEventListener("pointerleave", handlePointerLeave);
    footer.addEventListener("pointerdown", handlePointerDown);
    rebuild();
    animationFrame = window.requestAnimationFrame(tick);

    document.fonts.ready.then(() => {
      if (!disposed) {
        scheduleRebuild();
      }
    });

    return () => {
      disposed = true;
      entranceTween?.kill();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      footer.removeEventListener("pointerenter", handlePointerEnter);
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      footer.removeEventListener("pointerdown", handlePointerDown);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [lowercaseName]);

  const footerClassName = className
    ? `${styles.footer} ${className}`
    : styles.footer;

  return (
    <footer
      ref={footerRef}
      className={footerClassName}
      aria-label={`${lowercaseName} portfolio footer`}
    >
      <p className={styles.srOnly}>{lowercaseName}</p>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div ref={cursorLabelRef} className={styles.cursorLabel} aria-hidden="true">
        click to interact
      </div>
    </footer>
  );
}
