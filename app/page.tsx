import { ProceduralCloth } from "./ProceduralCloth";

const execution = [
  ["10:18:04", "opening.detected", "THU 14:00 / 90m"],
  ["10:18:06", "patients.considered", "14"],
  ["10:18:07", "constraint.duration", "pass 06"],
  ["10:18:08", "constraint.provider", "pass 04"],
  ["10:18:10", "candidates.viable", "03"],
  ["10:20:11", "outreach.started", "maria"],
  ["10:27:42", "response.received", "insurance?"],
  ["10:29:03", "exception.created", "staff"],
  ["10:41:18", "exception.cleared", "resume"],
  ["10:43:51", "patient.accepted", "yes"],
  ["10:44:02", "appointment.write", "ok"],
];

const reasons = [
  ["TREATMENT", "Crown remains active"],
  ["FIT", "90-minute requirement matches"],
  ["PROVIDER", "Correct provider available"],
  ["PREFERENCE", "Previously requested earlier times"],
  ["INSURANCE", "Question requires staff confirmation"],
];

export default function Home() {
  return <main>
    <section className="hero" id="top">
      <ProceduralCloth />
      <header className="nav">
        <a className="brand" href="#top" aria-label="Myrakal home">MYRAKAL</a>
        <nav aria-label="Primary navigation"><a href="#problem">The problem</a><a href="#schedule">See it work</a><a href="#access">Request access</a></nav>
      </header>
      <div className="hero-copy">
        <p className="eyebrow">RESOLUTION LAYER / HEALTHCARE OPERATIONS</p>
        <h1>Healthcare work,<br/>resolved.</h1>
        <p className="intro">Myrakal finds unfinished work across your practice, determines what should happen next, and keeps working until it’s resolved—or needs human judgment.</p>
        <div className="hero-actions"><a href="#schedule">SEE MYRAKAL WORK ↓</a><a href="#difference">HOW IT WORKS</a></div>
      </div>
      <div className="live-readout" aria-label="Live resolution states"><span>MYRA / LIVE</span><span>ACTIVE 14</span><span>WAITING 03</span><span>TERMINAL 11</span></div>
      <div className="hero-trace" aria-label="Current resolution trace"><span>10:18:04 / OPENING.DETECTED</span><span>10:18:10 / CANDIDATES.VIABLE 03</span><b>STATE / ACTING</b></div>
    </section>

    <section className="problem" id="problem">
      <p className="section-number">01 / THE EXECUTION PROBLEM</p>
      <div className="problem-head"><p className="eyebrow dark">YOUR PRACTICE ALREADY KNOWS</p><h2>The work isn’t missing.<br/>The follow-through is.</h2></div>
      <div className="signal-stack">
        <article><span>01</span><p>A 90-minute opening appears tomorrow.</p><b>STATE / OPEN</b></article>
        <article><span>02</span><p>A cancelled crown is never rescheduled.</p><b>STATE / UNRESOLVED</b></article>
        <article><span>03</span><p>A patient is waiting on insurance.</p><b>STATE / BLOCKED</b></article>
      </div>
      <div className="problem-close"><p>Practice software records what happened.</p><strong>Nobody continuously owns what happens next.</strong><p>MYRAKAL DOES.</p></div>
    </section>

    <section className="schedule" id="schedule">
      <div className="schedule-intro">
        <p className="eyebrow dark">02 / SCHEDULE RECOVERY</p>
        <h2>An opening isn’t a list.<br/>It’s a matching problem.</h2>
        <p>Thursday · 2:00 PM · 90 minutes. A cancellation creates unused capacity. Myrakal works the opening from first signal to final outcome.</p>
        <div className="schedule-state"><span>TRIGGER / CANCELLATION</span><span>MISSION / 0418</span><b>STATE / EVALUATING</b></div>
        <div className="comparison"><article><small>TYPICAL SOFTWARE</small><b>127</b><span>patients on a list</span><em>SEND BLAST</em></article><article><small>MYRAKAL</small><b>14 → 3 → 1</b><span>possible · viable · next action</span><em>RESOLVE</em></article></div>
      </div>

      <div className="resolution-run">
        <div className="run-rail" aria-hidden="true"><span>DETECT</span><span>MATCH</span><span>ACT</span><span>OBSERVE</span><span>RESOLVE</span></div>
        <div className="console" role="log" aria-label="Schedule Recovery execution log">
          <div className="console-top"><span>SCHEDULE_RECOVERY / 0418</span><span>STATE / EVALUATING</span></div>
          <div className="console-context"><span>PROVIDER / LEE</span><span>OP / 03</span><span>OPEN / +90m</span></div>
          <div className="log">{execution.slice(0,6).map(([time,event,value],i)=><div className="log-line" style={{"--i":i} as React.CSSProperties} key={event}><time>{time}</time><span>{event}</span><b>{value}</b></div>)}</div>
        </div>

        <div className="case-panels">
          <article className="why-panel">
            <div className="panel-head"><span>WHY MARIA?</span><span>CANDIDATE / 01</span></div>
            {reasons.map(([label,value])=><p key={label}><span>{label}</span><b>{value}</b></p>)}
          </article>
          <article className="barrier-panel">
            <p className="eyebrow">BARRIER DETECTED / 10:27</p><h3>“Has my estimate changed?”</h3><div className="barrier-path"><span>INSURANCE QUESTION</span><b>→</b><strong>HUMAN CONFIRMATION</strong></div><p>Myrakal does not invent an answer. It surfaces one decision with the mission context intact.</p>
          </article>
        </div>

        <div className="exception-strip"><span>10:29</span><b>1 DECISION NEEDS YOU</b><p>Confirm current insurance estimate</p><em>STAFF CONFIRMED / 10:41</em></div>

        <div className="resume-console">
          <div className="resume-head"><span>MISSION / RESUMED</span><span>AUTOMATICALLY</span></div>
          {execution.slice(6).map(([time,event,value])=><div key={event}><time>{time}</time><span>{event}</span><b>{value}</b></div>)}
          <strong><span>TERMINAL / FILLED</span><span>ELAPSED / 25:58</span></strong>
        </div>
        <div className="run-close"><p>Nobody ran a report.</p><p>Nobody remembered to follow up.</p></div>
      </div>
    </section>

    <section className="difference" id="difference">
      <div className="difference-machine" aria-label="Myrakal resolution states"><div><span>MYRA / OPERATIONS</span><span>STATE / ACTIVE</span></div><b>14</b><p>CASES IN MOTION</p><ul><li><span>schedule.recovery</span><strong>acting</strong></li><li><span>insurance.dependency</span><strong>waiting</strong></li><li><span>treatment.followup</span><strong>observing</strong></li><li><span>staff.exception</span><strong>01</strong></li></ul><footer><span>RESOLVED / 11</span><span>ESCALATED / 03</span></footer></div>
      <div className="difference-copy">
        <p className="eyebrow">03 / WHY MYRAKAL</p>
        <h2>Your team handles judgment.<br/>Myrakal handles persistence.</h2>
        <div className="difference-grid">
          <article><span>01</span><h3>Understands context</h3><p>Knows what fits, who makes sense, and the evidence behind the next action.</p></article>
          <article><span>02</span><h3>Works through barriers</h3><p>Insurance, timing, financing, and unanswered questions become part of the resolution—not a dead end.</p></article>
          <article><span>03</span><h3>Escalates judgment</h3><p>Your staff handles the few decisions software should not make. Myrakal continues afterward.</p></article>
        </div>
      </div>
    </section>

    <section className="ghost">
      <div className="ghost-copy"><p className="eyebrow">04 / GHOST MODE · ILLUSTRATIVE DATA</p><h2>Some of your best opportunities already disappeared.</h2><p>Myrakal reviews historical activity for treatment that never reached a terminal outcome, then identifies where a responsible next action may now exist.</p></div>
      <div className="ghost-console"><div className="ghost-head"><span>GHOST_MODE / DEMO</span><span>REVIEW / COMPLETE</span></div><b>$184,300</b><span>unresolved treatment discovered</span><div className="ghost-stats"><p><b>62</b>cases identified</p><p><b>17</b>newly actionable</p><p><b>08</b>high-confidence opportunities</p></div></div>
    </section>

    <section className="platform" id="access">
      <div className="platform-top">
        <div><p className="eyebrow">05 / THE RESOLUTION LAYER</p><h2>Keep your PMS.<br/>Add the layer that gets things done.</h2><p>Your practice-management system remains the system of record. Myrakal reads what happened, works the next action, and returns the outcome.</p></div>
        <div className="system-flow"><span>PRACTICE-MANAGEMENT SYSTEM</span><i>RECORDED STATE ↓</i><b>MYRAKAL / RESOLUTION LAYER</b><i>↓ ACTION · OBSERVATION · OUTCOME</i><span>PRACTICE OPERATIONS</span></div>
      </div>
      <div className="trust-grid">
        <article><span>01</span><h3>Practice-defined</h3><p>Your practice controls permissions, pathways, and communication behavior.</p></article>
        <article><span>02</span><h3>Human when it matters</h3><p>Sensitive situations, clinical questions, and policy decisions escalate.</p></article>
        <article><span>03</span><h3>No invented answers</h3><p>No fabricated insurance details, discounts, or clinic policies.</p></article>
        <article><span>04</span><h3>Explainable</h3><p>Staff can understand what happened, what evidence was used, and why.</p></article>
      </div>
      <div className="final-cta">
        <p className="eyebrow">FOR DENTAL PRACTICES / DESIGN PARTNERS</p><h2>Give Myrakal<br/>an opening.</h2>
        <a href="mailto:hello@myrakal.com?subject=See%20Myrakal%20work">SEE WHAT HAPPENS <span>↗</span></a>
        <footer><span>MYRAKAL</span><span>HEALTHCARE WORK, RESOLVED.</span><span>© 2026</span></footer>
      </div>
    </section>
  </main>;
}
