"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

const factors = [
  { label: "VALUE", question: "What is the case worth if resolved?", signal: "CASE VALUE / $3,200" },
  { label: "PROBABILITY", question: "Will the next intervention work?", signal: "SIGNAL / BENEFITS RENEWED" },
  { label: "TIMING", question: "Is the opportunity improving or waiting?", signal: "WINDOW / OPEN NOW" },
  { label: "COST", question: "Should practice attention be spent here?", signal: "DECISION / ACT" },
] as const;

export function DecisionIndex() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState(false);
  const [visibleSignal, setVisibleSignal] = useState(factors[0].signal);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = factors[active];
  const inView = useInView(rootRef, 0.3);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || !pageVisible || reducedMotion || manual) return;
    const interval = window.setInterval(() => setActive((current) => (current + 1) % factors.length), 4200);
    return () => window.clearInterval(interval);
  }, [inView, manual, pageVisible, reducedMotion]);

  useEffect(() => {
    let position = 0;
    let interval = 0;
    const reset = window.setTimeout(() => setVisibleSignal(reducedMotion ? selected.signal : ""), 0);
    if (reducedMotion) return () => window.clearTimeout(reset);
    const delay = window.setTimeout(() => {
      interval = window.setInterval(() => {
        position = Math.min(selected.signal.length, position + 3);
        setVisibleSignal(selected.signal.slice(0, position));
        if (position >= selected.signal.length) window.clearInterval(interval);
      }, 36);
    }, 220);
    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(delay);
      window.clearInterval(interval);
    };
  }, [reducedMotion, selected.signal]);

  function select(index: number) {
    setManual(true);
    setActive(index);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    setManual(true);
    const next = (index + direction + factors.length) % factors.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return <div ref={rootRef} className="decision-index">
    <p className="decision-index__instruction"><span>INTERACTIVE / SELECT A FACTOR</span><span>MODE / {manual || reducedMotion ? "MANUAL" : "AUTO"} · 01—04</span></p>
    <div className="decision-index__grid">
      <div className="decision-index__tabs" role="tablist" aria-label="Decision factors">
        {factors.map((factor, index) => <button
          key={factor.label}
          ref={(element) => { refs.current[index] = element; }}
          type="button"
          role="tab"
          id={`factor-${factor.label.toLowerCase()}`}
          aria-controls="factor-panel"
          aria-selected={active === index}
          tabIndex={active === index ? 0 : -1}
          className={active === index ? "is-active" : ""}
          onClick={() => select(index)}
          onFocus={() => setManual(true)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span>0{index + 1}</span><strong>{factor.label}</strong><b>{active === index ? "OPEN" : "SELECT →"}</b>
        </button>)}
      </div>
      <div className="decision-index__panel" id="factor-panel" role="tabpanel" aria-labelledby={`factor-${selected.label.toLowerCase()}`} key={selected.label}>
        <p><span>FACTOR / {selected.label}</span><span>EVALUATING</span></p>
        <blockquote>{selected.question}</blockquote>
        <code className={`decision-index__signal ${visibleSignal.length < selected.signal.length ? "is-writing" : ""}`} aria-hidden="true">{visibleSignal}</code>
        <span className="sr-only">{selected.signal}</span>
      </div>
    </div>
  </div>;
}
