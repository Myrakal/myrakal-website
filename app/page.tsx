import { WaveField } from "./WaveField";

const mariaReasons = [
  ["TREATMENT", "Crown still unscheduled"],
  ["FIT", "90 minutes"],
  ["PROVIDER", "Correct provider"],
  ["PREFERENCE", "Wants earlier availability"],
];

const missionTypes = [
  ["SCHEDULE RECOVERY", "Fill valuable unused capacity."],
  ["TREATMENT RECOVERY", "Find accepted or planned treatment that never reached an outcome."],
  ["BARRIER RESOLUTION", "Work through insurance, financing, scheduling, and unanswered questions."],
  ["CARE COMPLETION", "Keep multi-step treatment moving until completion."],
];

export default function Home() {
  return <main>
    <section className="hero" id="top">
      <WaveField className="hero-wave" />
      <header className="nav">
        <a className="brand" href="#top" aria-label="Myrakal home">MYRAKAL</a>
        <nav aria-label="Primary navigation"><a href="#problem">The problem</a><a href="#work">See it work</a><a href="#access">Request access</a></nav>
      </header>
      <div className="hero-wordmark"><h1>MYRAKAL</h1><p>Healthcare work, resolved.</p></div>
      <div className="live-readout" aria-label="Live Myra status"><span>MYRA / LIVE</span><span>ACTIVE 14</span><span>WAITING 03</span><span>TERMINAL 11</span></div>
      <div className="hero-terminal" aria-label="Current resolution trace"><strong>TERMINAL / FILLED</strong><span>10:44 / BOOKING CONFIRMED</span></div>
      <div className="hero-copy">
        <p className="intro">Myrakal finds where action can create value across your practice, decides what should happen next, and carries the work through to an outcome.</p>
        <div className="hero-actions"><a href="#work">SEE MYRAKAL WORK ↓</a><a href="#access">REQUEST ACCESS ↗</a></div>
      </div>
    </section>

    <section className="problem" id="problem">
      <WaveField className="section-wave problem-wave" density="quiet" />
      <p className="section-number">01 / THE EXECUTION PROBLEM</p>
      <div className="problem-head"><h2>Your systems know what happened.<br/>Nobody owns what happens next.</h2></div>
      <div className="problem-signals">
        <article><p>90-minute opening tomorrow</p><span>→</span><b>UNUSED CAPACITY</b></article>
        <article><p>Cancelled crown</p><span>→</span><b>UNRESOLVED TREATMENT</b></article>
        <article><p>Insurance question</p><span>→</span><b>BLOCKED CASE</b></article>
      </div>
      <p className="problem-explainer">Your PMS records the state. Your team has to notice it, decide what to do, remember to follow up, and keep pushing until something happens.</p>
      <div className="problem-terminal">MYRAKAL OWNS THE NEXT ACTION.</div>
    </section>

    <section className="work" id="work">
      <WaveField className="section-wave work-wave" density="quiet" />
      <div className="work-intro">
        <p className="eyebrow">02 / SEE MYRAKAL WORK</p>
        <h2>A cancellation just created 90 minutes of unused capacity.</h2>
      </div>

      <div className="mission" aria-label="Schedule Recovery mission">
        <div className="mission-detected"><span>10:18 / OPENING DETECTED</span><strong>THU / 2:00 PM / 90 MIN</strong></div>

        <div className="mission-funnel" aria-label="Candidate matching funnel">
          <div><b>127</b><span>patients</span></div><i>↓</i>
          <div><b>14</b><span>possible</span></div><i>↓</i>
          <div><b>3</b><span>viable</span></div><i>↓</i>
          <div className="selected"><b>1</b><span>best next action</span></div>
        </div>

        <article className="why-maria">
          <div className="panel-title"><span>WHY MARIA?</span><span>CANDIDATE / 01</span></div>
          {mariaReasons.map(([label, value]) => <p key={label}><span>{label}</span><b>{value}</b></p>)}
        </article>

        <article className="mission-barrier">
          <span>10:27</span>
          <h3>“Has my estimate changed?”</h3>
          <b>JUDGMENT REQUIRED</b>
          <p>Myrakal doesn’t guess. It asks your team for the one decision it needs.</p>
        </article>

        <div className="staff-confirmed"><span>STAFF CONFIRMED</span><time>10:41</time></div>

        <div className="mission-resumed">
          <div className="panel-title"><span>MISSION RESUMED</span><span>AUTOMATICALLY</span></div>
          <p><time>10:43</time><span>PATIENT ACCEPTED</span><b>YES</b></p>
          <p><time>10:44</time><span>BOOKING CONFIRMED</span><b>OK</b></p>
          <strong><span>TERMINAL / FILLED</span><span>ELAPSED / 26 MIN</span></strong>
        </div>
      </div>

      <div className="work-close"><p>Nobody ran a report.</p><p>Nobody remembered to follow up.</p><p>The work stayed owned until it was done.</p></div>
    </section>

    <section className="execution-layer" id="access">
      <WaveField className="section-wave execution-wave" />
      <div className="layer-intro">
        <p className="eyebrow">03 / THE EXECUTION LAYER</p>
        <h2>The schedule is only the beginning.</h2>
        <p>The same execution loop can work anywhere your practice has valuable work stuck between states.</p>
      </div>

      <div className="mission-types">
        {missionTypes.map(([title, description], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}
      </div>

      <div className="architecture" aria-label="Myrakal execution architecture">
        <span>YOUR EXISTING SYSTEMS</span>
        <i>↓</i>
        <b>MYRAKAL</b>
        <strong>DETECT → DECIDE → ACT → OBSERVE → RESOLVE</strong>
        <i>↓</i>
        <span>OUTCOME</span>
      </div>

      <div className="final-cta">
        <h2>Give Myrakal an opening.</h2>
        <p>See what it does with it.</p>
        <a href="mailto:hello@myrakal.com?subject=Put%20Myrakal%20to%20work">PUT MYRAKAL TO WORK <span>↗</span></a>
        <a className="email" href="mailto:hello@myrakal.com">hello@myrakal.com</a>
      </div>
    </section>
  </main>;
}
