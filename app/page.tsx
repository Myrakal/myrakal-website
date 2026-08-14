const scheduleLog = [
  ["10:18:04", "opening.detected", "THU 14:00 / 90m"],
  ["10:18:06", "patients.considered", "14"],
  ["10:18:07", "constraint.duration", "pass 06"],
  ["10:18:08", "constraint.provider", "pass 04"],
  ["10:18:09", "barrier.review", "pass 03"],
  ["10:18:10", "candidates.viable", "03"],
  ["10:20:11", "outreach.started", "01"],
  ["10:27:42", "response.received", "insurance?"],
  ["10:29:03", "exception.created", "staff"],
  ["10:41:18", "exception.cleared", "resume"],
  ["10:43:51", "patient.accepted", "yes"],
  ["10:44:02", "appointment.write", "ok"],
];

const mission = [
  ["10:18", "Trigger", "Crown cancellation detected"],
  ["10:18", "Understand", "Opening and constraints identified"],
  ["10:19", "Act", "Three viable patients found"],
  ["10:20", "Observe", "Best candidate contacted"],
  ["10:27", "Continue", "Insurance question surfaced"],
  ["10:29", "Escalate", "One staff decision requested"],
  ["10:41", "Resume", "Staff confirms; mission continues"],
  ["10:44", "Resolve", "Patient accepts; opening recovered"],
];

export default function Home() {
  return <main>
    <section className="hero" id="top">
      <div className="hero-material" aria-hidden="true" />
      <div className="studio-light" aria-hidden="true" />
      <header className="nav">
        <a className="brand" href="#top" aria-label="Myrakal home">MYRAKAL</a>
        <nav aria-label="Primary navigation"><a href="#work">The problem</a><a href="#schedule">See it work</a><a href="#access">Request access</a></nav>
      </header>
      <div className="hero-copy">
        <p className="eyebrow">RESOLUTION LAYER / HEALTHCARE OPERATIONS</p>
        <h1>Healthcare work,<br/>resolved.</h1>
        <p className="intro">Myrakal continuously finds unfinished work across your practice, figures out what needs to happen next, and keeps working until it’s resolved.</p>
        <div className="hero-actions"><a href="#schedule">SEE MYRAKAL WORK ↓</a><a href="#model">HOW IT WORKS</a></div>
      </div>
      <div className="live-readout"><span>MYRA / LIVE</span><span>ACTIVE 14</span><span>WAITING 03</span><span>TERMINAL 11</span></div>
    </section>

    <section className="problem paper" id="work">
      <div className="section-label">01 / THE EXECUTION PROBLEM</div>
      <div className="problem-title"><p className="eyebrow dark">YOUR PRACTICE ALREADY KNOWS</p><h2>The work isn’t missing.<br/>The follow-through is.</h2></div>
      <div className="signals">
        <p>A 90-minute opening appears tomorrow.</p><p>A crown was cancelled and never rescheduled.</p><p>A patient is waiting on insurance.</p><p>A treatment plan has sat untouched for six months.</p>
      </div>
      <div className="argument"><p>Practice software records what happened.</p><strong>Nobody continuously owns what happens next.</strong><p>Myrakal does.</p></div>
    </section>

    <section className="schedule paper" id="schedule">
      <div className="schedule-copy">
        <p className="eyebrow dark">02 / SCHEDULE RECOVERY</p>
        <h2>An opening isn’t a list.<br/>It’s a matching problem.</h2>
        <p>Thursday · 2:00 PM · 90 minutes. Myrakal understands the opening, applies the practice’s constraints, finds who actually makes sense, and takes the next action.</p>
        <div className="funnel"><div><small>TYPICAL SOFTWARE</small><b>127</b><span>patients on a list</span><em>SEND BLAST</em></div><div><small>MYRAKAL</small><b>14 → 3 → 1</b><span>possible · viable · next action</span><em>RESOLVE</em></div></div>
      </div>
      <div className="console" role="log" aria-label="Schedule recovery execution log">
        <div className="console-top"><span>SCHEDULE_RECOVERY / 0418</span><span>STATE / EVALUATING</span></div>
        <div className="console-context"><span>PROVIDER / LEE</span><span>OP / 03</span><span>OPEN / +90m</span></div>
        <div className="log">{scheduleLog.map(([time,event,value],i)=><div className="log-line" style={{"--i":i} as React.CSSProperties} key={event}><time>{time}</time><span>{event}</span><b>{value}</b></div>)}</div>
        <div className="console-result"><span>TERMINAL / FILLED</span><span>ELAPSED / 25:58</span></div>
      </div>
    </section>

    <section className="barriers oxblood">
      <div className="section-label light">03 / BARRIER RESOLUTION</div>
      <div className="barrier-lead"><p className="eyebrow">THE REAL QUESTION</p><h2>Filling the schedule isn’t always a scheduling problem.</h2><p>Automated outreach asks, “Would you like to schedule?” Myrakal asks what has to become true for this patient to move forward.</p></div>
      <div className="branch-list">
        <div><span>INSURANCE UNCERTAINTY</span><b>→</b><strong>Resolve the dependency</strong></div>
        <div><span>CLINICAL QUESTION</span><b>→</b><strong>Bring in the provider</strong></div>
        <div><span>TIMING CONFLICT</span><b>→</b><strong>Wait for the right opening</strong></div>
        <div><span>FINANCIAL BARRIER</span><b>→</b><strong>Use an approved pathway</strong></div>
        <div><span>NOT READY</span><b>→</b><strong>Defer—and remember why</strong></div>
      </div>
    </section>

    <section className="mission black" id="model">
      <div className="mission-copy"><p className="eyebrow">04 / RESOLUTION MISSIONS</p><h2>Myrakal doesn’t create tasks.<br/>It completes missions.</h2><p>A mission survives the first reply, a changed circumstance, or a required human decision. It owns the thread until there is a terminal outcome.</p><div className="mission-flow">TRIGGER → UNDERSTAND → ACT → OBSERVE → CONTINUE → RESOLVE</div></div>
      <div className="mission-timeline">{mission.map(([time,stage,text])=><div key={stage}><time>{time}</time><b>{stage}</b><span>{text}</span></div>)}<strong className="terminal">MISSION COMPLETE / OPENING RECOVERED</strong></div>
    </section>

    <section className="exceptions paper">
      <p className="eyebrow dark">05 / HUMAN INTERVENTION</p><h2>Your team handles judgment.<br/>Myrakal handles persistence.</h2>
      <div className="contrast"><div className="without"><small>WITHOUT MYRAKAL</small><p><b>147</b> follow-ups</p><p><b>23</b> patients to call</p><p><b>11</b> schedule gaps</p><p><b>08</b> insurance issues</p></div><div className="with"><small>WITH MYRAKAL</small><b>3</b><strong>decisions need you</strong><p>Everything else keeps moving.</p></div></div>
    </section>

    <section className="material-interlude" aria-label="Myrakal continuously owns unfinished work">
      <div className="cloth-panel" aria-hidden="true" />
      <div className="interlude-type"><p className="eyebrow">ALWAYS ON / QUIETLY WORKING</p><h2>Unfinished work<br/>doesn’t stay still.</h2><div className="interlude-status"><span>NOTICE</span><span>UNDERSTAND</span><span>ACT</span><span>OBSERVE</span><b>CONTINUE</b></div></div>
    </section>

    <section className="ghost oxblood">
      <div className="ghost-copy"><p className="eyebrow">06 / GHOST MODE · ILLUSTRATIVE DATA</p><h2>Some of your best opportunities already disappeared.</h2><p>Myrakal reviews historical activity for treatment that never reached a terminal outcome—then uses the available evidence to decide whether there is a responsible next action.</p></div>
      <div className="ghost-ui"><div className="ghost-head"><span>GHOST_MODE / DEMO</span><span>HISTORICAL REVIEW</span></div><b>$184,300</b><span>unresolved treatment discovered</span><div className="ghost-stats"><p><b>62</b> cases identified</p><p><b>17</b> newly actionable</p><p><b>08</b> high-confidence opportunities</p></div><div className="evidence"><span>CONFIRMED BARRIER</span><span>PROBABLE BARRIER</span><span>UNKNOWN BARRIER</span><span>NEW TRIGGER</span></div></div>
    </section>

    <section className="memory paper editorial-grid">
      <div><p className="eyebrow dark">07 / OPERATIONAL MEMORY</p><h2>Every conversation starts where the last one ended.</h2><p>The point is not to sound human. The point is that the practice remembers.</p></div>
      <div className="message-compare"><article><small>GENERIC SOFTWARE</small><p>“Hi Sarah, you’re due to schedule your treatment. Reply YES to schedule.”</p></article><article><small>MYRAKAL</small><p>“Hi Sarah—you mentioned evenings were easiest. A Thursday 5:10 opening just came up for the crown Dr. Patel discussed with you. Want me to see if it still works?”</p></article></div>
      <div className="context-strip"><span>Prefers evenings</span><span>Earlier openings / yes</span><span>Benefits verified</span><span>Crown / active</span><span>Last contact / 18d</span></div><div className="memory-index" aria-hidden="true">07</div>
    </section>

    <section className="reason black">
      <div><p className="eyebrow">08 / EXPLAINABILITY</p><h2>Every action has a reason.</h2><p>No unexplained score. No magic. Just the evidence behind the next action.</p></div>
      <div className="reason-table"><h3>WHY MARIA?</h3><p><span>TREATMENT</span><b>Crown remains active</b></p><p><span>FIT</span><b>90-minute requirement matches</b></p><p><span>PROVIDER</span><b>Correct provider available</b></p><p><span>PREFERENCE</span><b>Previously requested earlier times</b></p><p><span>INSURANCE</span><b>No unresolved prerequisite</b></p><p><span>TIMING</span><b>Prefers afternoons</b></p></div>
    </section>

    <section className="full-story paper story-stage">
      <p className="eyebrow dark">09 / ONE OPENING · 26 MINUTES</p><h2>One thread.<br/>Owned end to end.</h2>
      <div className="story-line">{mission.map(([time,stage,text])=><div key={stage}><time>{time}</time><span>{text}</span></div>)}</div>
      <div className="story-close"><p>Nobody ran a report.</p><p>Nobody remembered to follow up.</p></div>
    </section>

    <section className="systems oxblood">
      <div><p className="eyebrow">10 / EXISTING SYSTEMS</p><h2>Keep your PMS.<br/>Add the layer that gets things done.</h2><p>Your practice-management system remains the system of record. Myrakal becomes the resolution layer: reading what happened, coordinating the next action, and returning the outcome.</p></div>
      <div className="system-diagram"><span>PRACTICE-MANAGEMENT SYSTEM</span><i>RECORDED STATE ↓</i><b>MYRAKAL / RESOLUTION LAYER</b><i>↓ ACTION · OBSERVATION · OUTCOME</i><span>PRACTICE OPERATIONS</span></div>
    </section>

    <section className="control paper">
      <p className="eyebrow dark">11 / TRUST + CONTROL</p><h2>Autonomy where it helps.<br/>Judgment where it matters.</h2>
      <div className="control-grid"><p><b>Practice-defined behavior</b><span>The practice controls permissions, pathways, and communication rules.</span></p><p><b>Sensitive situations escalate</b><span>Clinical questions and policy decisions go to the right human.</span></p><p><b>No invented answers</b><span>Myrakal does not fabricate insurance details, discounts, or clinic policy.</span></p><p><b>Actions stay legible</b><span>Staff can understand what happened, what evidence was used, and why.</span></p></div>
    </section>

    <section className="category black"><p>NOT ANOTHER DASHBOARD.</p><p>NOT ANOTHER MASS-TEXTING TOOL.</p><p>NOT A REPLACEMENT PMS.</p><p>NOT A CHATBOT IN THE CORNER.</p><h2>Myrakal is the layer that notices unfinished work and gets it resolved.</h2></section>

    <section className="outcomes paper"><p className="eyebrow dark">12 / THE MEASURE</p><h2>Measure outcomes.<br/>Not automation.</h2><div className="outcome-list"><span><b>01</b>SCHEDULE HOURS RECOVERED</span><span><b>02</b>CASES RESOLVED</span><span><b>03</b>TREATMENT MOVED FORWARD</span><span><b>04</b>STAFF TOUCHES AVOIDED</span><span><b>05</b>TIME TO RESOLUTION</span></div></section>

    <section className="vision oxblood"><p className="eyebrow">13 / THE LARGER SYSTEM</p><h2>From recovering appointments<br/>to orchestrating the clinic.</h2><div className="vision-questions"><span>WHAT NEEDS TO HAPPEN?</span><span>WHAT CAPACITY EXISTS?</span><span>WHAT IS PREVENTING PROGRESS?</span><span>WHAT SHOULD HAPPEN NEXT?</span></div><blockquote>Every clinic has thousands of small things that have to go right. Appointments move. Patients hesitate. Insurance changes. Rooms open. Staff get busy. Cases disappear into lists.<br/><br/>Software records all of it.<br/><strong>Myrakal acts on it.</strong></blockquote></section>

    <section className="access" id="access"><p className="eyebrow">FOR DENTAL PRACTICES / DESIGN PARTNERS</p><h2>Give Myrakal<br/>an opening.</h2><a href="mailto:hello@myrakal.com?subject=See%20Myrakal%20work">SEE WHAT HAPPENS <span>↗</span></a><footer><span>MYRAKAL</span><span>HEALTHCARE WORK, RESOLVED.</span><span>© 2026</span></footer></section>
  </main>;
}
