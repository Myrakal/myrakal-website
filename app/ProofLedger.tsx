"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

function quantizedPhase(progress: number, start: number, end: number) {
  const phase = clamp((progress - start) / (end - start));
  return Math.floor(phase * 14) / 14;
}

function currency(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export function ProofLedger() {
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);
  const [progress, setProgress] = useState(1);
  const [started, setStarted] = useState(false);
  const inView = useInView(ref, 0.35);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || !pageVisible || animated.current) return;
    animated.current = true;
    let startedAt = 0;
    let beginFrame = 0;
    let frame = 0;
    const tick = (time: number) => {
      const next = clamp((time - startedAt) / 1800);
      setProgress(next);
      if (next < 1) frame = requestAnimationFrame(tick);
    };
    beginFrame = requestAnimationFrame((time) => {
      setStarted(true);
      if (reducedMotion) {
        setProgress(1);
        return;
      }
      setProgress(0);
      startedAt = time;
      frame = requestAnimationFrame(tick);
    });
    return () => {
      cancelAnimationFrame(beginFrame);
      cancelAnimationFrame(frame);
    };
  }, [inView, pageVisible, reducedMotion]);

  const first = quantizedPhase(progress, 0, 0.34);
  const second = quantizedPhase(progress, 0.34, 0.7);
  const third = quantizedPhase(progress, 0.7, 1);

  return <div ref={ref} className={`proof-ledger ${started ? "is-running" : ""}`} aria-label="Example practice audit">
    <p><strong><span aria-hidden="true">{currency(183400 * first)}</span><span className="sr-only">$183,400</span></strong><span>UNRESOLVED TREATMENT IDENTIFIED</span></p>
    <i className={progress >= 0.32 ? "is-visible" : ""} aria-hidden="true">→</i>
    <p><strong><span aria-hidden="true">{currency(71200 * second)}</span><span className="sr-only">$71,200</span></strong><span>REALISTICALLY RECOVERABLE NOW</span></p>
    <i className={progress >= 0.68 ? "is-visible" : ""} aria-hidden="true">→</i>
    <p><strong><span aria-hidden="true">{Math.round(23 * third)}</span><span className="sr-only">23</span></strong><span>CASES WITH A NEXT ACTION</span></p>
  </div>;
}
