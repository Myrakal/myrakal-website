"use client";

import { useState } from "react";

const stages = [
  "DEFERRED",
  "BENEFITS RENEWED",
  "ACTIONABLE",
  "MISSION ACTIVE",
] as const;

export function CaseLifecycle() {
  const [stage, setStage] = useState(0);
  const isComplete = stage === stages.length - 1;

  function advance() {
    setStage((current) => current === stages.length - 1 ? 0 : current + 1);
  }

  return <aside className="case-live" aria-label="Interactive case lifecycle">
    <div className="case-live__utility">
      <span>INTERACTIVE CASE</span>
      <span>STEP {stage + 1} / {stages.length}</span>
    </div>
    <div className="case-live__head">
      <code>CASE / 01847</code>
      <strong>CROWN · $3,200</strong>
    </div>
    <ol className="case-live__timeline" aria-live="polite">
      <li className={stage === 0 ? "is-active" : stage > 0 ? "is-past" : ""}>
        <code>STATE / DEFERRED</code>
        <span>Insurance maximum exhausted</span>
        <time>January 18</time>
      </li>
      <li className={stage === 1 ? "is-active" : stage > 1 ? "is-past" : ""}>
        <span>Benefits renewed</span>
        <time>August 01</time>
      </li>
      <li className={stage === 2 ? "is-active" : stage > 2 ? "is-past" : ""}>
        <code>STATE / ACTIONABLE</code>
        <span>Estimate re-evaluated</span>
        <span>Patient contact authorized</span>
      </li>
      <li className={stage === 3 ? "is-active" : ""}>
        <code>MISSION / ACTIVE</code>
      </li>
    </ol>
    <button className="case-live__control" type="button" onClick={advance}>
      <span>{isComplete ? "REPLAY CASE" : "ADVANCE CASE"}</span>
      <b aria-hidden="true">{isComplete ? "↺" : "→"}</b>
    </button>
  </aside>;
}
