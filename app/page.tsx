import { DecisionGap } from "./DecisionGap";
import { MissionDocket } from "./MissionDocket";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WaveField } from "./WaveField";

const missionTypes = [
  ["01", "SCHEDULE RECOVERY", "Fill valuable unused capacity.", "slot.detected → candidate.rank → booking.confirmed"],
  ["02", "TREATMENT RECOVERY", "Find accepted or planned treatment that never reached an outcome.", "treatment.accepted → barrier.resolve → outcome"],
  ["03", "BARRIER RESOLUTION", "Work through insurance, financing, scheduling, and unanswered questions.", "barrier.detected → owner.assign → state.observe"],
  ["04", "CARE COMPLETION", "Keep multi-step treatment moving until completion.", "dependency.cleared → next_action → care.complete"],
];

export default function Home() {
  return <main>
    <section className="campaign-hero" id="product">
      <SiteHeader />
      <WaveField className="campaign-wave" interactive />
      <div className="campaign-folio" aria-hidden="true"><span>00</span><span>OPERATING FIELD / ACTIVE</span></div>
      <div className="campaign-wordmark">
        <p className="campaign-kicker">THE OPERATING LAYER / HEALTHCARE</p>
        <h1>MYRAKAL</h1>
      </div>
      <div className="campaign-copy">
        <h2>Healthcare operations, optimized.</h2>
        <p>Myrakal finds where action can create value across your practice, decides what should happen next, and carries the work through to an outcome.</p>
        <div className="campaign-actions"><a className="button-light" href="/request-access">Request access</a><a className="campaign-link" href="#work">See Myrakal work ↓</a></div>
      </div>
      <a className="campaign-stamp" href="#work" aria-label="Open the schedule recovery mission replay">
        <span className="campaign-stamp__head"><b>MISSION / SCHEDULE RECOVERY</b><time>10:18:00</time></span>
        <span className="campaign-stamp__state">DETECTED</span>
        <span className="campaign-stamp__data"><b>OPENING</b><strong>90 MIN</strong></span>
        <span className="campaign-stamp__data"><b>WINDOW</b><strong>TOMORROW / 10:30</strong></span>
        <span className="campaign-stamp__foot"><b>STATE / UNRESOLVED</b><strong>VIEW MISSION ↓</strong></span>
      </a>
      <p className="campaign-resolution">Healthcare work, resolved.</p>
    </section>

    <section className="decision-field" id="decision">
      <div className="editorial-insert">
        <div className="section-heading">
          <p className="section-number">01 / THE EXECUTION PROBLEM</p>
          <h2>Your systems know what happened.<br /><em>Nobody owns what happens next.</em></h2>
          <p>Your PMS records the state. Your team has to notice it, decide what to do, remember to follow up, and keep pushing until something happens.</p>
        </div>
        <DecisionGap />
        <div className="ownership-statement"><span>MYRAKAL OWNS</span><strong>THE NEXT ACTION.</strong><small>SELECT → ACT → OBSERVE → CONTINUE</small></div>
      </div>
    </section>

    <section className="mission-field" id="work">
      <WaveField className="mission-wave" density="quiet" />
      <div className="mission-intro">
        <p className="section-number">02 / SEE MYRAKAL WORK</p>
        <h2>A cancellation just created 90 minutes of unused capacity.</h2>
        <p>One continuous mission. Every decision remains inspectable. The work does not disappear when a barrier appears.</p>
      </div>
      <MissionDocket />
      <div className="mission-proof"><p>Nobody ran a report.</p><p>Nobody remembered to follow up.</p><strong>The work stayed owned until it was done.</strong></div>
    </section>

    <section className="execution-field" id="company">
      <div className="execution-intro">
        <p className="section-number">03 / THE EXECUTION LAYER</p>
        <h2>The schedule is only the beginning.</h2>
        <p>The same execution loop can work anywhere your practice has valuable work stuck between states.</p>
      </div>

      <div className="domain-ledger">
        {missionTypes.map(([number, title, copy, trace], index) => <details key={title} open={index === 0}>
          <summary><span>{number}</span><h3>{title}</h3><p>{copy}</p><b aria-hidden="true">+</b></summary>
          <div className="domain-detail"><span>MISSION SHAPE</span><code>{trace}</code><a href="#work">SEE THE EXECUTION LOOP ↑</a></div>
        </details>)}
      </div>

      <div className="architecture" role="group" aria-label="Myrakal execution architecture">
        <span>YOUR EXISTING SYSTEMS</span><i>→</i><strong>MYRAKAL</strong><b>DETECT → DECIDE → ACT → OBSERVE → RESOLVE</b><i>→</i><span>OUTCOME</span>
      </div>

      <div className="permission-evidence">
        <div><p className="utility-label">EARNED PERMISSION</p><h3>Responsibility expands only when trust is earned.</h3><p>Myrakal observes first, makes its reasoning inspectable, and pauses when a human decision is required.</p></div>
        <div className="permission-table" role="table" aria-label="Myrakal permission states">
          <p role="row"><span role="cell">OBSERVE</span><b role="cell">READ STATE</b><em role="cell">ACTIVE</em></p>
          <p role="row"><span role="cell">PROPOSE</span><b role="cell">EXPLAIN NEXT ACTION</b><em role="cell">ACTIVE</em></p>
          <p role="row"><span role="cell">ACT WITH APPROVAL</span><b role="cell">HUMAN GATE</b><em role="cell">WHEN REQUIRED</em></p>
          <p role="row"><span role="cell">ESCALATE</span><b role="cell">TRANSFER OWNERSHIP</b><em role="cell">TERMINAL</em></p>
        </div>
      </div>

      <div className="campaign-close" id="access">
        <WaveField className="close-wave" density="quiet" />
        <p className="section-number">PUT MYRAKAL TO WORK</p>
        <h2>Give Myrakal an opening.<br /><em>See what it does with it.</em></h2>
        <div><a className="button-light" href="/request-access">Request access ↗</a><a href="mailto:hello@myrakal.com">hello@myrakal.com</a></div>
      </div>
      <SiteFooter />
    </section>
  </main>;
}
