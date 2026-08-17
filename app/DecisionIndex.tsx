"use client";

import { useRef, useState, type KeyboardEvent } from "react";

const factors = [
  { label: "VALUE", question: "What is the case worth if resolved?", signal: "CASE VALUE / $3,200" },
  { label: "PROBABILITY", question: "Will the next intervention work?", signal: "SIGNAL / BENEFITS RENEWED" },
  { label: "TIMING", question: "Is the opportunity improving or waiting?", signal: "WINDOW / OPEN NOW" },
  { label: "COST", question: "Should practice attention be spent here?", signal: "DECISION / ACT" },
] as const;

export function DecisionIndex() {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const selected = factors[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + factors.length) % factors.length;
    setActive(next);
    refs.current[next]?.focus();
  }

  return <div className="decision-index">
    <p className="decision-index__instruction"><span>INTERACTIVE / SELECT A FACTOR</span><span>01—04</span></p>
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
          onClick={() => setActive(index)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span>0{index + 1}</span><strong>{factor.label}</strong><b>{active === index ? "OPEN" : "SELECT →"}</b>
        </button>)}
      </div>
      <div className="decision-index__panel" id="factor-panel" role="tabpanel" aria-labelledby={`factor-${selected.label.toLowerCase()}`} key={selected.label}>
        <p><span>FACTOR / {selected.label}</span><span>EVALUATING</span></p>
        <blockquote>{selected.question}</blockquote>
        <code>{selected.signal}</code>
      </div>
    </div>
  </div>;
}
