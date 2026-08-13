const logLines = [
  ["10:42:13.091", "availability.changed", ""],
  ["10:42:13.104", "slot.detected", "+90m"],
  ["10:42:13.137", "candidates.loaded", "18"],
  ["10:42:13.142", "reject.duration", "12"],
  ["10:42:13.149", "reject.provider", "02"],
  ["10:42:13.163", "ready", "03"],
  ["10:42:14.007", "outreach.dispatch", "02"],
  ["10:46:02.318", "response.timeout", "01"],
  ["10:48:31.441", "response.received", "01"],
  ["10:51:08.229", "appointment.write", "ok"],
];

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <header className="nav">
          <a className="brand" href="#top" aria-label="Myrakal home">MYRAKAL</a>
          <nav aria-label="Primary navigation">
            <a href="#operation">How it works</a>
            <a href="#access">Request access</a>
          </nav>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">EXECUTION LAYER / HEALTHCARE OPERATIONS</p>
          <h1>Healthcare work,<br />resolved.</h1>
          <p className="intro">Myrakal finds unresolved operational work in the systems a practice already runs—and keeps acting until the work is finished or needs a human.</p>
        </div>

        <div className="live-readout" aria-label="Current system status">
          <span>MYRA / LIVE</span><span>ACTIVE 14</span><span>WAITING 03</span><span>TERMINAL 11</span>
        </div>
        <a className="scroll-cue" href="#operation">VIEW ONE RESOLUTION ↓</a>
      </section>

      <section className="operation" id="operation">
        <div className="operation-intro">
          <p className="eyebrow dark">AN OPENING APPEARS / THURSDAY, 10:42</p>
          <h2>Ninety minutes<br />back on the schedule.</h2>
          <p>A late cancellation leaves time unfilled. Myrakal evaluates the live schedule, applies the practice’s rules, contacts eligible patients, and records the confirmed appointment in the system of record.</p>
        </div>

        <div className="console" role="log" aria-label="Schedule recovery execution log">
          <div className="console-top"><span>SCHEDULE_RECOVERY / 0418</span><span>STATE / EVALUATING</span></div>
          <div className="console-context"><span>PROVIDER / LEE</span><span>OP / 03</span><span>OPEN / +90m</span></div>
          <div className="log">
            {logLines.map(([time, event, value], index) => (
              <div className="log-line" style={{ "--i": index } as React.CSSProperties} key={event}>
                <time>{time}</time><span>{event}</span><b>{value}</b>
              </div>
            ))}
          </div>
          <div className="console-result">
            <span>TERMINAL / FILLED</span><span>ELAPSED / 08:55</span>
          </div>
        </div>
      </section>

      <section className="resolution">
        <div className="resolution-image" aria-hidden="true" />
        <div className="resolution-copy">
          <p className="eyebrow">10:51 / THE SYSTEM GOES QUIET</p>
          <h2>Work closed.<br />Not watched.</h2>
          <p>The appointment is confirmed. The schedule is updated. The operational case ends with a result—not another item on a dashboard.</p>
          <div className="receipt"><span>OUTCOME</span><b>FILLED</b><span>WRITE</span><b>CONFIRMED</b></div>
        </div>
      </section>

      <section className="principles">
        <p className="eyebrow dark">THE OPERATING MODEL</p>
        <div className="principle-grid">
          <article><span>01</span><h3>Connect</h3><p>Works through the systems a practice already uses. The PMS remains the system of record.</p></article>
          <article><span>02</span><h3>Resolve</h3><p>Detects unfinished operational work, acts within explicit permissions, and observes the result.</p></article>
          <article><span>03</span><h3>Escalate</h3><p>When judgment or authority is required, Myrakal hands the case to a human with its context intact.</p></article>
        </div>
      </section>

      <section className="access" id="access">
        <p className="eyebrow">FOR DENTAL PRACTICES / DESIGN PARTNERS</p>
        <h2>Less work<br />left unresolved.</h2>
        <a href="mailto:hello@myrakal.com?subject=Myrakal%20access">REQUEST ACCESS <span>↗</span></a>
        <footer><span>MYRAKAL</span><span>HEALTHCARE WORK, RESOLVED.</span><span>© 2026</span></footer>
      </section>
    </main>
  );
}
