import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { WaveField } from "./WaveField";

const opportunities = [
  ["A", "90-minute opening tomorrow", "$1,840 potential production"],
  ["B", "$4,200 treatment plan inactive", "Insurance uncertainty / 73 days"],
  ["C", "Specialist referral unfinished", "Promise overdue / 2 days"],
  ["D", "Recall backlog", "26 reachable patients"],
];
const constraints = ["PROCEDURE FIT", "PROVIDER FIT", "PATIENT ELIGIBILITY", "TREATMENT READINESS", "EXPECTED ATTENDANCE", "CONTACT FATIGUE"];
const landscape = [
  ["CAPACITY", "Which chair-hour to recover, protect, or leave open.", "RECOVER"],
  ["TREATMENT", "Which unresolved case needs attention now—and what blocks it.", "RESOLVE"],
  ["PATIENT ATTENTION", "Who to contact, through which channel, and who to leave alone.", "WAIT"],
  ["COMMITMENTS", "Which promises to patients and staff still need an outcome.", "REMEMBER"],
  ["WORKFLOW", "Which cleared dependency should trigger the next action.", "ACT"],
];

export default function Home() {
  return <main>
    <section className="hero" id="product">
      <SiteHeader />
      <div className="hero-cream">
        <p className="hero-kicker">THE OPERATING LAYER / HEALTHCARE</p>
        <h1>MYRAKAL</h1>
        <h2>Healthcare operations, optimized.</h2>
        <p className="hero-intro">Your systems record what happened. Myrakal understands the state of your practice, decides what should happen next, and drives the work toward resolution.</p>
        <div className="hero-actions"><a className="button-dark" href="/request-access">Request access</a><a className="text-link" href="#work">See Myrakal work ↓</a></div>
      </div>
      <div className="hero-oxblood" aria-label="Myrakal active operating state">
        <WaveField className="hero-wave" />
        <div className="hero-orbit" aria-hidden="true"><span>STATE</span><span>DECIDE</span><span>ACT</span><span>OBSERVE</span></div>
        <div className="hero-console">
          <p className="console-head"><span>MYRA / ACTIVE</span><span>10:44:07</span></p>
          <dl><div><dt>CAPACITY</dt><dd>WATCHING</dd></div><div><dt>MISSIONS</dt><dd>14</dd></div><div><dt>WAITING</dt><dd>03</dd></div><div><dt>RESOLVED</dt><dd>11</dd></div></dl>
          <ol><li><time>10:44:02</time><span>CAPACITY DETECTED</span></li><li><time>10:44:04</time><span>OPTIONS EVALUATED</span></li><li className="active"><time>10:44:07</time><span>ACTION SELECTED</span></li></ol>
        </div>
        <p className="hero-question">What should<br />happen next?</p>
      </div>
    </section>

    <section className="decision" id="decision">
      <p className="section-number">01 / THE DECISION GAP</p>
      <h2>Your software knows what happened.<br /><em>Myrakal decides what happens next.</em></h2>
      <div className="practice-state">
        <p className="machine-head"><span>PRACTICE STATE / 10:42 AM</span><span>04 OPPORTUNITIES</span></p>
        <div className="opportunity-list">{opportunities.map(([id,title,detail]) => <article key={id} className={id === "A" ? "opportunity-selected" : ""}><b>{id}</b><h3>{title}</h3><p>{detail}</p><i aria-hidden="true" /></article>)}</div>
        <div className="allocation"><span>NEXT BEST ALLOCATION</span><strong>A / RECOVER TOMORROW&rsquo;S CAPACITY</strong><small>DECISION CONFIDENCE / HIGH</small></div>
      </div>
      <div className="decision-loop" role="group" aria-label="Continuous operational decision loop">{["UNDERSTAND", "CONSTRAIN", "PREDICT", "DECIDE", "ACT", "OBSERVE", "REPEAT"].map((step,index) => <span key={step}>{step}{index < 6 && <i aria-hidden="true">→</i>}</span>)}</div>
      <p className="decision-close">Not another dashboard.<br /><b>An operating layer.</b></p>
    </section>

    <section className="work" id="work">
      <WaveField className="work-wave" density="quiet" />
      <p className="section-number">02 / SEE IT DECIDE</p><h2>An opening appears tomorrow.</h2>
      <div className="decision-sheet">
        <p className="sheet-head"><span>MISSION SHEET / 02</span><span>OPERATORY 02 / DR. PATEL</span></p>
        <div className="sheet-grid">
          <article className="sheet-col col-detected"><p className="col-label"><span>DETECTED</span><time>10:44:02</time></p><strong className="big-ninety">90</strong><span className="ninety-unit">MINUTES / TOMORROW</span><dl><div><dt>PRODUCTION AT RISK</dt><dd>$1,840</dd></div></dl></article>
          <article className="sheet-col col-constrained"><p className="col-label"><span>CONSTRAINED</span><time>10:44:03</time></p><ul className="ledger">{constraints.map((item,index) => <li key={item}><span>{item}</span><b>{index === 5 ? "CONSIDER" : "PASS"}</b></li>)}</ul><p className="ledger-total"><span>POSSIBLE / 17</span><b>VIABLE / 04</b></p></article>
          <article className="sheet-col col-selected"><p className="col-label"><span>SELECTED</span><time>10:44:07</time></p><h3>Sarah M.</h3><ul className="facts">{["CROWN","90 MIN","HIGH READINESS","EARLIER SLOT / YES","BARRIER / RESOLVED","ATTENDANCE / HIGH"].map((fact) => <li key={fact}>{fact}</li>)}</ul></article>
        </div>
        <div className="sheet-filled"><strong>FILLED.</strong><span>CAPACITY / RECOVERED · PATIENT / ACCEPTED</span></div>
      </div>
      <div className="work-statement"><h3>It doesn&rsquo;t find a list.<br />It decides what to do with the opening.</h3></div>
    </section>

    <section className="operating" id="company">
      <p className="section-number">03 / THE OPERATING LAYER</p><h2>One practice.<br />Thousands of competing decisions.</h2>
      <div className="operational-landscape">{landscape.map(([title,copy,state],index) => <article key={title} className={state === "WAIT" ? "landscape-wait" : ""}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><b>{state}</b></article>)}</div>
      <div className="attention-panel"><div><p className="machine-head"><span>PATIENT ATTENTION</span><span>CONSTRAINT / ACTIVE</span></p><dl><div><dt>LAST CONTACT</dt><dd>18H</dd></div><div><dt>RECENT ATTEMPTS</dt><dd>02</dd></div><div><dt>URGENCY</dt><dd>LOW</dd></div><div><dt>DECISION</dt><dd>WAIT</dd></div></dl></div><blockquote><strong>Contacting patients matters. Knowing when to matters more.</strong><p>Myrakal treats patient attention like every other scarce resource: deliberately.</p></blockquote></div>
      <div className="autonomy"><p className="utility-label">EARNED AUTONOMY</p><h3>Observe first. Earn trust. Take responsibility.</h3><div>{["OBSERVE", "RECOMMEND", "ACT WITH APPROVAL", "ACT", "ESCALATE"].map((item) => <span key={item}>{item}</span>)}</div></div>
      <div className="closing"><h3>Every new state creates a new best decision.</h3><a className="button-light" href="/request-access">Request access →</a></div>
      <SiteFooter />
    </section>
  </main>;
}
