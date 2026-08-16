"use client";

import { useRef, useState, type KeyboardEvent } from "react";

const steps = [
  { id: "observe", label: "OBSERVE", copy: "A case diverges from its expected path." },
  { id: "understand", label: "UNDERSTAND", copy: "Myrakal reconstructs its history, constraints, and known blocker." },
  { id: "value", label: "VALUE", copy: "It determines whether intervention is justified now." },
  { id: "act", label: "ACT", copy: "Contact the patient. Match capacity. Request information. Prepare a handoff." },
  { id: "observe-result", label: "OBSERVE", copy: "Did anything change?" },
  { id: "learn", label: "LEARN", copy: "The intervention and outcome become part of the case history." },
  { id: "resolve", label: "RESOLVE", copy: "Completed. Declined. Deferred. Escalated. Otherwise terminal." },
] as const;

export function MethodFlow() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = steps[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + steps.length) % steps.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return <div className="method-flow">
    <p className="method-flow__instruction"><span>INTERACTIVE METHOD</span><span>SELECT A STEP / USE ARROW KEYS</span></p>
    <div className="method-flow__grid">
      <div className="method-flow__tabs" role="tablist" aria-label="Myrakal mission method">
        {steps.map((step, index) => <button
          key={step.id}
          ref={(element) => { refs.current[index] = element; }}
          type="button"
          role="tab"
          id={`method-tab-${step.id}`}
          aria-selected={active === index}
          aria-controls="method-panel"
          tabIndex={active === index ? 0 : -1}
          className={active === index ? "is-active" : ""}
          onClick={() => setActive(index)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span>0{index + 1}</span>
          <strong>{step.label}</strong>
          <b aria-hidden="true">{active === index ? "SELECTED" : "VIEW →"}</b>
        </button>)}
      </div>
      <div id="method-panel" role="tabpanel" aria-labelledby={`method-tab-${selected.id}`} className="method-flow__panel" key={selected.id}>
        <p><span>STEP {active + 1} / {steps.length}</span><span>MISSION / ACTIVE</span></p>
        <strong>{selected.label}</strong>
        <blockquote>{selected.copy}</blockquote>
      </div>
    </div>
  </div>;
}
