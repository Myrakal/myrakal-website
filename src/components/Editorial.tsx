import './Editorial.css'

export function Editorial() {
  return (
    <section id="editorial" className="care-editorial" aria-labelledby="editorial-title">
      <div className="care-editorial__folio">
        <span>Myrakal journal</span><span>Care, considered.</span><span>Volume 01</span>
      </div>
      <h2 id="editorial-title" className="care-editorial__masthead">CARE</h2>
      <div className="care-editorial__intro">
        <p>A new perspective<br />on care, everywhere.</p>
        <p>Choose a destination. Explore specialists. Bring the details of your journey together, with room to consider what matters to you.</p>
      </div>
      <div className="care-editorial__covers">
        <article className="care-cover care-cover--art" aria-labelledby="care-art-title">
          <img src="/images/care-object.webp" alt="A sculptural pearl medical emblem arranged on oxblood velvet" loading="lazy" width="1024" height="1536" />
          <div className="care-cover__top"><span>Myrakal</span><span>01 / Perspective</span></div>
          <div className="care-cover__caption">
            <span className="care-cover__eyebrow">Personal. Considered. Connected.</span>
            <h3 id="care-art-title">The art<br />of care.</h3>
            <p>Find the specialist and destination that fit your plans.</p>
          </div>
        </article>
        <article className="care-cover care-cover--journey" aria-labelledby="care-journey-title">
          <img src="/images/journey-object.webp" alt="A polished silver compass with folded cream papers in an editorial travel still life" loading="lazy" width="1024" height="1536" />
          <div className="care-cover__top"><span>Myrakal</span><span>02 / The journey</span></div>
          <div className="care-cover__caption">
            <span className="care-cover__eyebrow">Your next chapter</span>
            <h3 id="care-journey-title">A world of<br /><em>possibility.</em></h3>
            <p>From the first question to the journey ahead. Make space for a plan.</p>
          </div>
        </article>
      </div>
      <div className="care-editorial__closing">
        <p>Every journey begins with a little curiosity.</p>
        <a href="#how-it-works">Explore the journey <span aria-hidden="true">↗</span></a>
      </div>
    </section>
  )
}
