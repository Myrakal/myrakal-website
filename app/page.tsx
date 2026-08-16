import { WaveField } from "./WaveField";

const liveReadout = [["ACTIVE", "14"], ["WAITING", "03"], ["RESOLVED", "11"]];
const gapExamples = [["A 90-minute opening tomorrow afternoon", "UNUSED CAPACITY"], ["A crown accepted, never scheduled", "UNRESOLVED TREATMENT"], ["An insurance question, unanswered", "BLOCKED CASE"], ["A cancelled hygiene visit, unrebooked", "LOST RECALL"], ["A multi-step case stalled mid-plan", "INCOMPLETE CARE"]];
const missionPanel = [["MISSION", "042"], ["OBJECTIVE", "RECOVER 90M OPENING"], ["STATUS", "MATCHING"], ["CANDIDATES", "04"], ["EXPECTED PRODUCTION", "$1,860"], ["NEXT ACTION", "OFFER SLOT"]];
const manifestations = [
  ["SCHEDULE RECOVERY", "Openings and cancellations become recovered production, not blank space on tomorrow's book."],
  ["TREATMENT RESOLUTION", "Accepted and planned treatment is carried forward until it is scheduled, completed, or deliberately closed."],
  ["CASE COMPLETION", "Multi-step care keeps moving through every appointment, authorization, and follow-up until the case is done."],
];
const engine = ["DETECT", "UNDERSTAND", "DECIDE", "ACT", "WAIT", "RESOLVE"];

export default function Home() {
  return <main>
    <section className="hero" id="top">
      <header className="nav"><a className="brand" href="#top" aria-label="Myrakal home">MYRAKAL</a><nav aria-label="Primary navigation"><a href="#gap">The execution gap</a><a href="#work">See Myrakal work</a><a href="#system">Request access</a></nav></header>
      <div className="hero-wordmark"><h1>MYRAKAL</h1></div>
      <div className="hero-copy"><p className="hero-statement">Healthcare work, resolved.</p><p className="intro">Myrakal finds unfinished work across your practice, determines what should happen next, and keeps working until it is resolved—or needs human judgment.</p><div className="hero-actions"><a className="cta-primary" href="#system">Request access</a><a className="cta-secondary" href="#work">See Myrakal work</a></div></div>
      <aside className="hero-panel" aria-label="Live system status"><WaveField className="hero-wave" density="quiet" /><p className="panel-title">MYRA / LIVE</p><dl className="live-readout">{liveReadout.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><p className="panel-trace"><time>10:44:02</time><span>SCHEDULE.RECOVERY</span><strong>SLOT FILLED</strong></p></aside>
    </section>

    <section className="gap" id="gap">
      <p className="section-number">01 / THE EXECUTION GAP</p><h2>The work isn&rsquo;t missing.<br />The follow-through is.</h2>
      <div className="gap-copy"><p>Your practice management system records everything: the opening, the unscheduled crown, the pending claim. Recording a state is not the same as owning the next action. Between what is written down and what actually happens sits a gap your team fills by noticing, remembering, and pushing—until something else demands their attention.</p></div>
      <div className="gap-composition"><ul className="gap-examples">{gapExamples.map(([state,classification]) => <li key={classification}><p>{state}</p><b>{classification}</b></li>)}</ul><aside className="mission-panel" aria-label="Unresolved mission"><dl>{missionPanel.map(([label,value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></aside></div>
      <p className="gap-close">Myrakal owns the next action.</p>
    </section>

    <section className="work" id="work">
      <WaveField className="section-wave work-wave" density="quiet" /><p className="section-number">02 / SEE MYRAKAL WORK</p><h2>A cancellation just opened 90 minutes on tomorrow&rsquo;s schedule.</h2>
      <ol className="timeline" aria-label="Mission 042 resolution timeline">
        <li><time>11:30</time><div><h3>OPENING DETECTED</h3><p>Thursday, 2:00 PM. 90 minutes. Dr. Hale&rsquo;s column.</p></div></li>
        <li><time>11:30</time><div><h3>FIT / SEARCH / CONSTRAINTS</h3><p>Myrakal searches the practice for treatment that fits the slot: right duration, right provider, right clinical priority, patients who have asked for earlier availability.</p></div></li>
        <li><time>11:31</time><div><h3>FOUR CANDIDATES</h3><ul className="candidates"><li><b>Sarah M.</b><span>Crown, 90 minutes, accepted six weeks ago. On the earlier-availability list.</span></li><li><b>Michael R.</b><span>Root canal completion, 90 minutes. Insurance authorization cleared Tuesday.</span></li></ul><p>Ranked by fit, value, and likelihood to accept. Offers sent in order.</p></div></li>
        <li><time>11:34</time><div><h3>ACCEPTED</h3><p>Sarah M. confirms. The appointment is written back to the schedule.</p></div></li>
      </ol>
      <div className="work-terminal" role="group" aria-label="Terminal state"><p className="terminal-line"><time>11:34:18</time> / <span>APPOINTMENT.WRITE</span> / <b>OK</b></p><p className="terminal-status">MISSION 042 / <b>TERMINAL</b></p><p className="resolved">RESOLVED.</p></div>
      <p className="work-close">Myrakal doesn&rsquo;t merely tell the practice what is wrong. It gets the work done.</p>
    </section>

    <section className="system" id="system">
      <p className="section-number">03 / THE SYSTEM</p><h2>One system. Every unfinished outcome.</h2><p className="system-copy">Myrakal becomes the execution layer between your systems, your staff, and your patients. The same engine runs every mission.</p>
      <div className="manifestations">{manifestations.map(([title,description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="engine" role="group" aria-label="Execution engine loop">{engine.map((phase,index) => <span key={phase}>{phase}{index < engine.length - 1 && <i aria-hidden="true"> → </i>}</span>)}</div>
      <div className="system-close"><p className="closing-statement">Your software records the practice. Myrakal runs the follow-through.</p><div className="final-cta"><a className="cta-primary" href="mailto:hello@myrakal.com?subject=Request%20access">Request access</a><a className="email" href="mailto:hello@myrakal.com">hello@myrakal.com</a></div><footer className="footer"><span>MYRAKAL</span><span>The execution layer for healthcare operations.</span></footer></div>
    </section>
  </main>;
}
