"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Opportunity = {
  id: string;
  code: string;
  title: string;
  detail: string;
  state: string;
  signal: string;
  action: string;
};

const opportunities: Opportunity[] = [
  {
    id: "capacity",
    code: "A",
    title: "90-minute opening tomorrow",
    detail: "$1,840 potential production",
    state: "UNRESOLVED CAPACITY",
    signal: "slot.detected / +90m / tomorrow",
    action: "RANK COMPATIBLE PATIENTS",
  },
  {
    id: "treatment",
    code: "B",
    title: "$4,200 treatment plan inactive",
    detail: "Insurance uncertainty / 73 days",
    state: "TREATMENT STALLED",
    signal: "treatment.accepted / no outcome / +73d",
    action: "RESOLVE ESTIMATE BARRIER",
  },
  {
    id: "referral",
    code: "C",
    title: "Specialist referral unfinished",
    detail: "Promise overdue / 2 days",
    state: "OPEN COMMITMENT",
    signal: "referral.sent / completion missing",
    action: "REQUEST STATUS",
  },
  {
    id: "recall",
    code: "D",
    title: "Recall backlog",
    detail: "26 reachable patients",
    state: "CARE DUE",
    signal: "recall.overdue / reachable 26",
    action: "PRIORITIZE OUTREACH",
  },
];

export function DecisionGap() {
  const [selected, setSelected] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = opportunities[selected];

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const direction = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const next = (index + direction + opportunities.length) % opportunities.length;
    setSelected(next);
    buttonRefs.current[next]?.focus();
  }

  return <div className="dg-layout">
    <ol className="dg-list" aria-label="Unresolved operational opportunities">
      {opportunities.map((opportunity, index) => <li key={opportunity.id}>
        <button
          ref={(element) => { buttonRefs.current[index] = element; }}
          type="button"
          className={`dg-item${selected === index ? " dg-item--active" : ""}`}
          aria-pressed={selected === index}
          aria-controls="dg-receipt"
          onClick={() => setSelected(index)}
          onKeyDown={(event) => moveFocus(event, index)}
        >
          <span className="dg-code">{opportunity.code}</span>
          <span className="dg-copy"><strong>{opportunity.title}</strong><small>{opportunity.detail}</small></span>
          <span className="dg-state">{opportunity.state}</span>
        </button>
      </li>)}
    </ol>

    <div className="dg-receipt-wrap">
      <p className="dg-caption">SELECT AN OPPORTUNITY / USE ARROW KEYS</p>
      <div id="dg-receipt" className="dg-receipt" role="status" aria-live="polite" key={active.id}>
        <p className="dg-receipt__head"><span>NEXT BEST ALLOCATION</span><span>{active.code} / ACTIVE</span></p>
        <strong className="dg-receipt__state">{active.state}</strong>
        <dl>
          <div><dt>SIGNAL</dt><dd>{active.signal}</dd></div>
          <div><dt>NEXT ACTION</dt><dd>{active.action}</dd></div>
          <div><dt>OWNERSHIP</dt><dd>MYRAKAL / UNTIL TERMINAL</dd></div>
        </dl>
      </div>
    </div>
  </div>;
}
