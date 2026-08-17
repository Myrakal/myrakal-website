"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

const stages = [
  { state: "STATE / DEFERRED", detail: "Benefits exhausted", time: "JAN 18" },
  { state: "EVENT / BENEFITS_RENEWED", detail: "Source state changed", time: "AUG 01" },
  { state: "STATE / ACTIONABLE", detail: "Estimate re-evaluated", time: "AUG 01" },
  { state: "MISSION / ACTIVE", detail: "Patient contact authorized", time: "AUG 02" },
  { state: "TERMINAL / SCHEDULED", detail: "Patient accepted", time: "AUG 04" },
] as const;

export function CaseLifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [manual, setManual] = useState(false);
  const complete = stage === stages.length - 1;
  const inView = useInView(ref, 0.3);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView || !pageVisible || reducedMotion || manual) return;
    const interval = window.setInterval(() => setStage((current) => (current + 1) % stages.length), 2600);
    return () => window.clearInterval(interval);
  }, [inView, manual, pageVisible, reducedMotion]);

  function advance() {
    setManual(true);
    setStage((current) => current === stages.length - 1 ? 0 : current + 1);
  }

  return <div ref={ref} className={`case-run ${complete ? "is-resolved" : ""}`} aria-label="Interactive case lifecycle">
    <p className="case-run__instruction"><span>INTERACTIVE / CASE 01847</span><span>MODE / {manual || reducedMotion ? "MANUAL" : "AUTO"} · STEP {stage + 1} / {stages.length}</span></p>
    <div className="case-run__identity"><code>CROWN / $3,200</code><span>PATIENT / AUTHORIZED</span></div>
    <ol className="case-run__events" aria-live={manual ? "polite" : "off"}>
      {stages.map((item, index) => <li key={item.state} className={index === stage ? "is-active" : index < stage ? "is-past" : ""} aria-current={index === stage ? "step" : undefined}>
        <span>0{index + 1}</span><code>{item.state}</code><b>{item.detail}</b><time>{item.time}</time>
      </li>)}
    </ol>
    <p className="sr-only" aria-live={manual ? "polite" : "off"}>{manual ? `${stages[stage].state}. ${stages[stage].detail}.` : ""}</p>
    <div className="case-run__footer">
      <strong>{complete ? <em>resolved.</em> : "CASE / UNFINISHED"}</strong>
      <button type="button" onClick={advance}><span>{complete ? "REPLAY CASE" : "ADVANCE CASE"}</span><b aria-hidden="true">{complete ? "↺" : "→"}</b></button>
    </div>
  </div>;
}
