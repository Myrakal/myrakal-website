"use client";

import { useState } from "react";

const stages = [
  { state: "STATE / DEFERRED", detail: "Benefits exhausted", time: "JAN 18" },
  { state: "EVENT / BENEFITS_RENEWED", detail: "Source state changed", time: "AUG 01" },
  { state: "STATE / ACTIONABLE", detail: "Estimate re-evaluated", time: "AUG 01" },
  { state: "MISSION / ACTIVE", detail: "Patient contact authorized", time: "AUG 02" },
  { state: "TERMINAL / SCHEDULED", detail: "Patient accepted", time: "AUG 04" },
] as const;

export function CaseLifecycle() {
  const [stage, setStage] = useState(0);
  const complete = stage === stages.length - 1;

  function advance() {
    setStage((current) => complete ? 0 : current + 1);
  }

  return <div className={`case-run ${complete ? "is-resolved" : ""}`} aria-label="Interactive case lifecycle">
    <p className="case-run__instruction"><span>INTERACTIVE / CASE 01847</span><span>STEP {stage + 1} / {stages.length}</span></p>
    <div className="case-run__identity"><code>CROWN / $3,200</code><span>PATIENT / AUTHORIZED</span></div>
    <ol className="case-run__events" aria-live="polite">
      {stages.map((item, index) => <li key={item.state} className={index === stage ? "is-active" : index < stage ? "is-past" : ""}>
        <span>0{index + 1}</span><code>{item.state}</code><b>{item.detail}</b><time>{item.time}</time>
      </li>)}
    </ol>
    <div className="case-run__footer">
      <strong>{complete ? <em>resolved.</em> : "CASE / UNFINISHED"}</strong>
      <button type="button" onClick={advance}><span>{complete ? "REPLAY CASE" : "ADVANCE CASE"}</span><b aria-hidden="true">{complete ? "↺" : "→"}</b></button>
    </div>
  </div>;
}
