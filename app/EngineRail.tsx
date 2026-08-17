"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

const steps = [
  ["Detect", "DETECTING"],
  ["Reconstruct", "RECONSTRUCTING"],
  ["Evaluate", "EVALUATING"],
  ["Act", "ACTING"],
  ["Observe", "OBSERVING"],
  ["Resolve", "RESOLVED"],
] as const;

export function EngineRail() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const inView = useInView(ref, 0.1);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || !pageVisible || reducedMotion) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % steps.length), 1500);
    return () => window.clearInterval(interval);
  }, [inView, pageVisible, reducedMotion]);

  return <div ref={ref} className="hero-engine" aria-label="Myrakal execution engine">
    <div className="hero-engine__status">
      <span>ENGINE / ACTIVE</span>
      <span>CASE / 01847</span>
      <span>STATE / {steps[active][1]}</span>
    </div>
    <ol className="hero-engine__cycle" aria-label="Execution cycle">
      {steps.map(([label], index) => <li key={label} className={active === index ? "is-live" : ""} aria-current={active === index ? "step" : undefined}>
        <b>0{index + 1}</b>{label}
        {active === index && <i key={active} aria-hidden="true" />}
      </li>)}
    </ol>
    <a href="#memory">Open engine <span aria-hidden="true">↓</span></a>
  </div>;
}
