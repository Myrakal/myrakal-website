"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Stage = "DETECTED" | "CONSTRAINED" | "SELECTED" | "JUDGMENT" | "TERMINAL";
type Outcome = "FILLED" | "ESCALATED" | null;

const stages: Stage[] = ["DETECTED", "CONSTRAINED", "SELECTED", "JUDGMENT", "TERMINAL"];

export function MissionDocket() {
  const [activeStage, setActiveStage] = useState<Stage>("DETECTED");
  const [outcome, setOutcome] = useState<Outcome>(null);
  const tabRefs = useRef<Partial<Record<Stage, HTMLButtonElement | null>>>({});

  function selectStage(stage: Stage, focus = false) {
    const next = stage === "TERMINAL" && outcome === null ? "JUDGMENT" : stage;
    setActiveStage(next);
    if (focus) window.requestAnimationFrame(() => tabRefs.current[next]?.focus());
  }

  function moveStage(event: KeyboardEvent<HTMLButtonElement>) {
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    const index = stages.indexOf(activeStage);
    let next = stages[(index + direction + stages.length) % stages.length];
    if (next === "TERMINAL" && outcome === null) next = "JUDGMENT";
    selectStage(next, true);
  }

  function decide(nextOutcome: Exclude<Outcome, null>) {
    setOutcome(nextOutcome);
    setActiveStage("TERMINAL");
    window.requestAnimationFrame(() => tabRefs.current.TERMINAL?.focus());
  }

  return <div className="md-docket" aria-label="Schedule Recovery mission replay">
    <p className="md-replay"><span>MISSION REPLAY / SCHEDULE RECOVERY</span><span>RECORDED 10:18–10:44</span></p>

    <div className="md-tabs" role="tablist" aria-label="Mission stages">
      {stages.map((stage, index) => {
        const locked = stage === "TERMINAL" && outcome === null;
        return <button
          key={stage}
          ref={(element) => { tabRefs.current[stage] = element; }}
          type="button"
          role="tab"
          id={`md-tab-${stage.toLowerCase()}`}
          aria-controls={`md-panel-${stage.toLowerCase()}`}
          aria-selected={activeStage === stage}
          aria-disabled={locked}
          tabIndex={activeStage === stage ? 0 : -1}
          className={`md-tab${activeStage === stage ? " md-tab--active" : ""}${locked ? " md-tab--locked" : ""}`}
          onClick={() => selectStage(stage)}
          onKeyDown={moveStage}
        ><span>0{index + 1}</span>{stage}</button>;
      })}
    </div>

    <div className="md-stage">
      <article role="tabpanel" id="md-panel-detected" aria-labelledby="md-tab-detected" hidden={activeStage !== "DETECTED"} className="md-panel md-panel--detected">
        <div className="md-panel__top"><span>10:18 / OPENING DETECTED</span><span>OPERATORY 02</span></div>
        <div className="md-detected-grid"><strong>90</strong><div><span>MINUTES</span><span>TOMORROW</span><span>$1,840 AT RISK</span></div></div>
        <p className="md-editorial">A cancellation just created 90 minutes of unused capacity.</p>
        <button className="md-next" type="button" onClick={() => selectStage("CONSTRAINED", true)}>Constrain the mission →</button>
      </article>

      <article role="tabpanel" id="md-panel-constrained" aria-labelledby="md-tab-constrained" hidden={activeStage !== "CONSTRAINED"} className="md-panel md-panel--constrained">
        <div className="md-panel__top"><span>10:18 / CANDIDATES EVALUATED</span><span>CONSTRAINT PASS</span></div>
        <div className="md-funnel" aria-label="127 patients narrowed to one best next action">
          <p><strong>127</strong><span>PATIENTS</span></p><i>↓</i><p><strong>14</strong><span>POSSIBLE</span></p><i>↓</i><p><strong>3</strong><span>VIABLE</span></p><i>↓</i><p><strong>1</strong><span>BEST NEXT ACTION</span></p>
        </div>
        <ul className="md-constraint-list"><li>PROCEDURE FIT <b>PASS</b></li><li>PROVIDER FIT <b>PASS</b></li><li>TREATMENT READINESS <b>PASS</b></li><li>CONTACT FATIGUE <b>CONSIDER</b></li></ul>
        <button className="md-next" type="button" onClick={() => selectStage("SELECTED", true)}>Inspect selection →</button>
      </article>

      <article role="tabpanel" id="md-panel-selected" aria-labelledby="md-tab-selected" hidden={activeStage !== "SELECTED"} className="md-panel md-panel--selected">
        <div className="md-panel__top"><span>10:19 / CANDIDATE SELECTED</span><span>01 / MARIA</span></div>
        <div className="md-selected-grid"><h3>WHY<br />MARIA?</h3><dl><div><dt>TREATMENT</dt><dd>Crown still unscheduled</dd></div><div><dt>FIT</dt><dd>90 minutes</dd></div><div><dt>PROVIDER</dt><dd>Correct provider</dd></div><div><dt>PREFERENCE</dt><dd>Wants earlier availability</dd></div></dl></div>
        <button className="md-next" type="button" onClick={() => selectStage("JUDGMENT", true)}>Replay outreach →</button>
      </article>

      <article role="tabpanel" id="md-panel-judgment" aria-labelledby="md-tab-judgment" hidden={activeStage !== "JUDGMENT"} className="md-panel md-panel--judgment">
        <div className="md-panel__top"><span>10:27 / PATIENT RESPONSE</span><span>JUDGMENT REQUIRED</span></div>
        <blockquote>“Has my estimate changed?”</blockquote>
        <div className="md-held">ACTION HELD — AWAITING HUMAN APPROVAL</div>
        <p className="md-editorial">Myrakal doesn&rsquo;t guess. It asks your team for the one decision it needs.</p>
        <fieldset className="md-choices"><legend>Choose how this mission replay ends</legend><button type="button" onClick={() => decide("FILLED")}>Approve estimate discussion</button><button type="button" onClick={() => decide("ESCALATED")}>Hold for front desk</button></fieldset>
      </article>

      <article role="tabpanel" id="md-panel-terminal" aria-labelledby="md-tab-terminal" hidden={activeStage !== "TERMINAL"} className="md-panel md-panel--terminal">
        <div className="md-terminal-head"><span>MISSION / TERMINAL</span><span>ELAPSED / {outcome === "FILLED" ? "26 MIN" : "23 MIN"}</span></div>
        <strong>TERMINAL / {outcome ?? "PENDING"}</strong>
        <ol className="md-log">
          <li><time>10:18</time><span>OPENING DETECTED</span><b>OK</b></li>
          <li><time>10:27</time><span>JUDGMENT REQUIRED</span><b>HELD</b></li>
          <li><time>10:41</time><span>STAFF {outcome === "FILLED" ? "CONFIRMED" : "ESCALATION ACCEPTED"}</span><b>OK</b></li>
          {outcome === "FILLED" && <><li><time>10:43</time><span>PATIENT ACCEPTED</span><b>YES</b></li><li><time>10:44</time><span>BOOKING CONFIRMED</span><b>OK</b></li></>}
        </ol>
        <p>{outcome === "FILLED" ? "The opening is filled. The work stayed owned until the booking was confirmed." : "The mission is escalated. Ownership transferred to the front desk with the decision recorded."}</p>
        <button className="md-restart" type="button" onClick={() => { setOutcome(null); selectStage("DETECTED", true); }}>Replay mission ↺</button>
      </article>
    </div>
  </div>;
}
