"use client";

import { useEffect, type CSSProperties } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

const fireflyColors = ["#ffd27a", "#ff85ca", "#8ceaff", "#c9a5ff"];

export function ExperienceLayer({ fairyNight }: { fairyNight: boolean }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    let frame = 0;
    const trackPointer = (event: PointerEvent) => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
        document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", trackPointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", trackPointer);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--pointer-x");
      document.documentElement.style.removeProperty("--pointer-y");
    };
  }, []);

  return (
    <>
      <motion.div className="scroll-progress" style={{ scaleX: progress }} aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      {fairyNight && (
        <div className="fairy-fireflies" aria-hidden="true">
          <span className="fairy-light-wash" />
          {Array.from({ length: 38 }, (_, index) => {
            const drift = (seed: number, range: number) => ((index * seed) % range) - range / 2;
            const style = {
              left: `${((index * 37 + 11) % 96) + 2}%`,
              top: `${((index * 53 + 17) % 92) + 3}%`,
              color: fireflyColors[index % fireflyColors.length],
              "--fly-size": `${3 + (index % 4) * 1.5}px`,
              "--fly-duration": `${9 + (index % 8) * 1.7}s`,
              "--fly-delay": `${-((index * 13) % 31) / 3}s`,
              "--fly-x1": `${drift(29, 150)}px`,
              "--fly-y1": `${drift(41, 120)}px`,
              "--fly-x2": `${drift(47, 190)}px`,
              "--fly-y2": `${drift(23, 160)}px`,
              "--fly-x3": `${drift(61, 130)}px`,
              "--fly-y3": `${drift(31, 180)}px`,
            } as CSSProperties;

            return <i className="fairy-firefly" key={index} style={style} />;
          })}
        </div>
      )}
    </>
  );
}
