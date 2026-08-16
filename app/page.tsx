import { CaseLifecycle } from "./CaseLifecycle";
import { MethodFlow } from "./MethodFlow";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WaveField } from "./WaveField";

const memoryQuestions = [
  "What was supposed to happen?",
  "What actually happened?",
  "What stopped it?",
  "Is that blocker still true?",
  "What should happen now?",
];

const caseExamples = [
  { number: "0412", treatment: "Two crowns", value: "$3,200", state: "BLOCKER / BENEFITS EXHAUSTED", change: "Benefits renewed", action: "REOPEN" },
  { number: "0731", treatment: "Root canal", value: "$1,700", state: "BLOCKER / WORK SCHEDULE", change: "Earlier availability appears", action: "REOPEN" },
  { number: "1028", treatment: "Implant restoration", value: "", state: "STATE / CLINICAL VALIDATION REQUIRED", change: "Prepared for provider", action: "ESCALATE" },
];

const decisionFactors = [
  ["01", "VALUE", "What is the case worth if resolved?"],
  ["02", "PROBABILITY", "How likely is the next intervention to work?"],
  ["03", "TIMING", "Is the opportunity improving, decaying, or waiting on something?"],
  ["04", "COST", "How much staff time, patient attention, and operational effort should be spent pursuing it?"],
];

export default function Home() {
  return <main>
    <section className="rev-hero" id="product">
      <SiteHeader />
      <WaveField className="rev-hero__wave" interactive />
      <div className="rev-hero__index" aria-hidden="true">01</div>
      <div className="rev-hero__copy">
        <p className="rev-eyebrow">CARE COMPLETION / DENTAL</p>
        <h1>Healthcare work,<br /><em>resolved.</em></h1>
        <div className="rev-hero__body">
          <p className="rev-hero__lede">Care gets diagnosed. Then life happens.</p>
          <p>Insurance changes. Schedules move. Patients hesitate. Calls end with “not right now.” Treatment disappears into reports, notes, and somebody&rsquo;s memory.</p>
          <p><strong>Myrakal reconstructs what is still unfinished, remembers what is standing in the way, and keeps working the case until there is an outcome.</strong></p>
        </div>
        <div className="rev-actions">
          <a className="rev-button rev-button--light" href="/request-access">Request access <span aria-hidden="true">↗</span></a>
          <a className="rev-text-link" href="#method">See how it works <span aria-hidden="true">↓</span></a>
        </div>
      </div>
      <CaseLifecycle />
    </section>

    <section className="memory-section" id="memory">
      <div className="section-shell">
        <header className="editorial-heading">
          <p className="rev-eyebrow">02 / THE MEMORY</p>
          <div>
            <span className="editorial-overline">YOUR PMS REMEMBERS THE TREATMENT.</span>
            <h2>Myrakal remembers<br /><em>what happened next.</em></h2>
          </div>
        </header>

        <div className="memory-intro">
          <div className="memory-intro__copy">
            <p>An unscheduled-treatment report can tell you <strong>what never got scheduled.</strong></p>
            <p className="editorial-callout">That isn&rsquo;t enough.</p>
            <p>Myrakal builds a living record of the unresolved case:</p>
          </div>
          <ol className="memory-questions">
            {memoryQuestions.map((question, index) => <li key={question}><span>0{index + 1}</span><strong>{question}</strong></li>)}
          </ol>
        </div>

        <div className="memory-distinctions">
          <p>A patient who said “not this year” is different from one waiting on insurance.</p>
          <p>A patient who cancelled because of work is different from one who stopped responding.</p>
          <p>A case waiting on provider judgment is different from a case nobody remembered to call.</p>
          <strong>Myrakal keeps those distinctions.</strong>
        </div>

        <div className="memory-case-heading"><span>CASE MEMORY / EXAMPLES</span><span>03 UNRESOLVED CASES</span></div>
        <div className="memory-cases">
          {caseExamples.map((item) => <article key={item.number}>
            <div className="memory-case__top"><code>CASE {item.number}</code><span>UNFINISHED</span></div>
            <h3>{item.treatment}</h3>
            {item.value && <strong>{item.value}</strong>}
            <code className="memory-case__state">{item.state}</code>
            <p>{item.change} <span aria-hidden="true">→</span> <b>{item.action.toLowerCase()}</b></p>
          </article>)}
        </div>

        <p className="memory-close">Not another stale list.<br /><em>A memory of unfinished care.</em></p>
      </div>
    </section>

    <section className="method-section" id="method">
      <WaveField className="method-wave" density="quiet" />
      <div className="section-shell">
        <header className="editorial-heading editorial-heading--light">
          <p className="rev-eyebrow">03 / THE METHOD</p>
          <div>
            <span className="editorial-overline">NOT A QUEUE. A DECISION SYSTEM.</span>
            <h2>Every case competes<br /><em>for the next action.</em></h2>
          </div>
        </header>

        <div className="method-intro">
          <p className="method-intro__lead">Practices do not have unlimited attention.</p>
          <div><p>Every call spends patient goodwill.<br />Every staff handoff costs time.<br />Every empty chair hour expires.<br />And not every open treatment plan is equally recoverable.</p><strong>Myrakal evaluates the work before it acts.</strong></div>
        </div>

        <div className="factor-grid">
          {decisionFactors.map(([number, title, copy]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>

        <p className="method-decision">Then Myrakal decides what deserves action now — <em>and what should be left alone.</em></p>

        <div className="method-subhead"><p className="rev-eyebrow">A MISSION, NOT A REMINDER</p><h3>The work moves through a complete loop.</h3></div>
        <MethodFlow />

        <div className="human-judgment">
          <div>
            <p className="rev-eyebrow">HUMAN JUDGMENT STAYS HUMAN.</p>
            <h3>One prepared decision.<br /><em>The relevant context attached.</em></h3>
          </div>
          <div className="human-judgment__copy">
            <p>Clinical decisions, unusual financial exceptions, sensitive conversations, and permissions your practice has withheld are not Myrakal&rsquo;s call.</p>
            <p>When judgment is required, Myrakal surfaces <strong>one prepared decision with the relevant context attached.</strong></p>
            <p>Your team answers.<br /><strong>Myrakal takes the work back.</strong></p>
          </div>
          <div className="prepared-decision" aria-label="Example prepared decision">
            <p><span>CASE / 1028</span><span>JUDGMENT / REQUIRED</span></p>
            <strong>CLINICAL VALIDATION</strong>
            <dl><div><dt>CONTEXT</dt><dd>ATTACHED</dd></div><div><dt>RECOMMENDATION</dt><dd>PREPARED</dd></div><div><dt>ACTION</dt><dd>HELD</dd></div></dl>
          </div>
        </div>
      </div>
    </section>

    <section className="proof-section" id="proof">
      <div className="section-shell">
        <header className="editorial-heading">
          <p className="rev-eyebrow">04 / PROOF</p>
          <div>
            <span className="editorial-overline">NO SAAS ROI MATH.</span>
            <h2>Know what is actually<br /><em>recoverable.</em></h2>
          </div>
        </header>

        <div className="proof-intro"><p>A stale treatment plan is not automatically lost revenue.</p><strong>So Myrakal separates the numbers.</strong></div>

        <div className="audit-example">
          <p className="audit-example__head"><span>PRACTICE AUDIT / EXAMPLE</span><span>EVIDENCE / ATTACHED</span></p>
          <div className="audit-metrics">
            <article><strong>$183,400</strong><span>Unresolved treatment identified</span></article>
            <i aria-hidden="true">↓</i>
            <article><strong>$71,200</strong><span>Realistically recoverable now</span></article>
            <i aria-hidden="true">↓</i>
            <article><strong>23 cases</strong><span>With a clear next action</span></article>
          </div>
        </div>

        <div className="proof-evidence">
          <div><p>And underneath every number:</p><ul><li>the patient,</li><li>the treatment,</li><li>the evidence,</li><li>the blocker,</li><li>and the reason Myrakal believes the case deserves attention.</li></ul></div>
          <div><p>No mystery score.<br />No invented “revenue saved.”<br />No dashboard number your team cannot inspect.</p><strong>Just unresolved work, its realistic value, and what should happen next.</strong></div>
        </div>

        <div className="audit-cta" id="access">
          <p className="rev-eyebrow">LIMITED PILOT / DENTAL PRACTICES ONLY</p>
          <h2>Find out what your practice<br />has left <em>unfinished.</em></h2>
          <div><p>We are onboarding a small number of dental practices to evaluate unresolved treatment, recoverable production, and the workflows required to move that care forward.</p><div className="audit-cta__action"><a className="rev-button rev-button--dark" href="/request-access">Request a practice audit <span aria-hidden="true">↗</span></a><small>Limited pilot access · Dental practices only</small></div></div>
        </div>
      </div>
      <SiteFooter />
    </section>
  </main>;
}
