import { CaseLifecycle } from "./CaseLifecycle";
import { DecisionIndex } from "./DecisionIndex";
import { EngineRail } from "./EngineRail";
import { MaterialField } from "./MaterialField";
import { ProofLedger } from "./ProofLedger";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WordmarkMaterial } from "./WordmarkMaterial";

const cases = [
  ["0412", "TWO CROWNS / $3,200", "BENEFITS EXHAUSTED", "REOPEN"],
  ["0731", "ROOT CANAL / $1,700", "WORK SCHEDULE", "REOPEN"],
  ["1028", "IMPLANT RESTORATION", "CLINICAL VALIDATION", "ESCALATE"],
] as const;

export default function Home() {
  return <main>
    <section className="plate-hero" id="product">
      <SiteHeader />
      <div className="plate-hero__frame">
        <p className="plate-hero__kicker">CARE COMPLETION / DENTAL</p>
        <WordmarkMaterial />
        <div className="plate-hero__statement">
          <h1>Healthcare work,<br /><em>resolved.</em></h1>
          <p>Care gets diagnosed. Then life happens. Myrakal keeps working the case until there is an outcome.</p>
        </div>
        <div className="plate-hero__actions">
          <a className="plate-button" href="/request-access">Request access <span aria-hidden="true">↗</span></a>
          <a className="plate-link" href="#memory">Open a case <span aria-hidden="true">↓</span></a>
        </div>
        <EngineRail />
      </div>
    </section>

    <section className="system-memory" id="memory">
      <div className="system-shell">
        <header className="system-heading">
          <p>02 / CASE MEMORY</p>
          <h2><span>YOUR PMS RECORDS THE TREATMENT.</span>MYRAKAL RECORDS WHAT HAPPENED NEXT.</h2>
        </header>

        <div className="case-ledger" role="table" aria-label="Examples of unresolved cases">
          <div className="case-ledger__head" role="row">
            <span role="columnheader">CASE</span><span role="columnheader">TREATMENT</span><span role="columnheader">LAST KNOWN BLOCKER</span><span role="columnheader">NEXT</span>
          </div>
          {cases.map(([number, treatment, blocker, next]) => <div className="case-ledger__row" role="row" key={number}>
            <code role="cell">{number}</code><strong role="cell">{treatment}</strong><span role="cell">{blocker}</span><b role="cell">{next}</b>
          </div>)}
        </div>

        <p className="system-thesis">Waiting on insurance is not saying no.<br />The distinction changes the next action.</p>
        <CaseLifecycle />
      </div>
    </section>

    <section className="decision-section" id="decision">
      <div className="decision-sheet">
        <div className="system-shell">
          <header className="system-heading system-heading--decision">
            <p>03 / DECISION</p>
            <h2><span>NOT A QUEUE.</span>A DECISION SYSTEM.</h2>
          </header>
          <p className="decision-intro">Every case competes for the next action.</p>
          <DecisionIndex />
        </div>
      </div>

      <div className="resolution-plate">
        <MaterialField variant="judgment" />
        <p className="resolution-plate__label">PLATE / JUDGMENT</p>
        <h2>Human judgment<br /><em>stays human.</em></h2>
        <div>
          <p>One prepared decision. Context attached.</p>
          <p>Your team answers.<br /><strong>Myrakal takes the case back.</strong></p>
        </div>
      </div>
    </section>

    <section className="proof-section" id="proof">
      <div className="evidence-sheet">
        <div className="system-shell">
          <header className="proof-heading">
            <p>04 / PROOF</p>
            <h2>KNOW WHAT IS ACTUALLY RECOVERABLE.</h2>
          </header>

          <ProofLedger />

          <p className="proof-note"><span>EVERY NUMBER OPENS TO</span>THE PATIENT / THE EVIDENCE / THE BLOCKER</p>
          <p className="proof-close">No mystery score. No invented revenue saved.</p>
        </div>
      </div>

      <div className="closing-plate" id="access">
        <MaterialField variant="closing" />
        <p>LIMITED PILOT / DENTAL PRACTICES ONLY</p>
        <h2>Find what your practice<br />left <em>unfinished.</em></h2>
        <a className="closing-button" href="/request-access">Request a practice audit <span aria-hidden="true">↗</span></a>
      </div>
      <SiteFooter />
    </section>
  </main>;
}
