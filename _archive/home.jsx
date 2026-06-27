/* global React, Marigold, Icon, useReveal, CTABanner */
const { useEffect: useEffectHome } = React;

/* ============================================================
   Home page
   ============================================================ */

const HERO_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop", label: "Lab · Koblenz" },
  { src: "https://images.unsplash.com/photo-1543051932-6ef9fecfbc80?w=900&q=80&auto=format&fit=crop", label: "Diwali Night" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&q=80&auto=format&fit=crop", label: "Welcome Day" },
];

const EVENTS = [
  {
    cat: "Cultural",
    title: "Diwali Night 2026",
    desc: "An evening of light, dance, food and music — open to all in Koblenz.",
    date: { d: "07", m: "Nov" },
    when: "Nov 7, 19:00",
    where: "Audimax, RAC",
    img: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=900&q=80&auto=format&fit=crop",
  },
  {
    cat: "Welcome",
    title: "Winter Semester Welcome",
    desc: "Meet your seniors, get bureaucracy tips, and find your people on day one.",
    date: { d: "12", m: "Oct" },
    when: "Oct 12, 16:00",
    where: "RheinMoselCampus",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop",
  },
  {
    cat: "Career",
    title: "German CV Workshop",
    desc: "A hands-on session with career coaches on writing Lebensläufe that land interviews.",
    date: { d: "21", m: "Oct" },
    when: "Oct 21, 18:00",
    where: "Online · Zoom",
    img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop",
  },
];

const FEATURES = [
  { ico: <Icon.Heart/>, title: "Soft landing", desc: "Pickup from airport, first-week SIM, residence permit walkthroughs.", n: "01" },
  { ico: <Icon.Sparkle/>, title: "Festivals & culture", desc: "Diwali, Holi, Independence Day, Onam — celebrated loudly, together.", n: "02" },
  { ico: <Icon.Globe/>, title: "Career & networks", desc: "Alumni, partner companies, CV labs and German-language meetups.", n: "03" },
  { ico: <Icon.Hands/>, title: "Mentorship", desc: "Seniors who've been through it. Real advice on housing, exams, taxes.", n: "04" },
];

const BLOGS = [
  {
    tag: "Survival Guide",
    title: "Your first 14 days in Koblenz: a step-by-step",
    desc: "Anmeldung, blocked accounts, semester ticket and the SIM that won't break you. Real talk from students who just did it.",
    meta: "8 min read · Updated Oct 2026",
    img: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&q=80&auto=format&fit=crop",
  },
  {
    tag: "Housing",
    title: "Renting in Koblenz without losing your mind",
    desc: "WG-Gesucht decoded, Schufa, Bürge, deposit rules.",
    meta: "6 min read",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80&auto=format&fit=crop",
  },
  {
    tag: "Career",
    title: "From Werkstudent to full-time: a roadmap",
    desc: "How to convert a student job into a Blue Card offer.",
    meta: "9 min read",
    img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop",
  },
];

const PARTNERS = [
  "Hochschule Koblenz",
  "AOK · Krankenkasse",
  "Sparkasse Koblenz",
  "Stadt Koblenz",
  "AStA",
  "Indian Embassy · Berlin",
];

function Hero({ navigate }) {
  return (
    <section className="hero">
      <div className="marigold m1"><Marigold size={120} /></div>
      <div className="marigold m2"><Marigold size={84} hue="var(--saffron)" inner="var(--marigold)" /></div>
      <div className="marigold m3"><Marigold size={48} /></div>

      <div className="wrap">
        <div className="hero-grid">
          <div data-reveal>
            <div className="hero-tag">
              <span className="pulse"></span>
              Winter Semester 2026 · Open for new members
            </div>
            <h1 className="h-display hero-title">
              Indian students.
              <br/>
              <em>Building futures</em> in Koblenz.
            </h1>
            <p className="hero-sub">
              ISAK is the Indian Students Association at Hochschule Koblenz — a home for students from across India, building community, careers and culture along the Rhine since 2014.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#join" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>
                Become a Member <Icon.ArrowUR/>
              </a>
              <a className="btn btn-ghost" href="#events" onClick={(e) => { e.preventDefault(); navigate("events"); }}>
                See upcoming events
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat"><div className="num"><em>340</em>+</div><div className="label">Members</div></div>
              <div className="stat"><div className="num"><em>28</em></div><div className="label">Events / year</div></div>
              <div className="stat"><div className="num"><em>2014</em></div><div className="label">Est. in Koblenz</div></div>
              <div className="stat"><div className="num"><em>17</em></div><div className="label">Indian states</div></div>
            </div>
          </div>

          <div className="collage" data-reveal>
            <div className="coll-card coll-1">
              <img src={HERO_PHOTOS[0].src} alt="Students at Hochschule Koblenz"/>
              <span className="label">{HERO_PHOTOS[0].label}</span>
            </div>
            <div className="coll-card coll-2">
              <img src={HERO_PHOTOS[1].src} alt="Diwali celebration"/>
              <span className="label">{HERO_PHOTOS[1].label}</span>
            </div>
            <div className="coll-card coll-3">
              <img src={HERO_PHOTOS[2].src} alt="ISAK welcome day"/>
              <span className="label">{HERO_PHOTOS[2].label}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Diwali", "Holi", "Onam", "Independence Day", "Cricket Night", "German Tandem", "Career Fair", "Welcome Days"];
  const all = [...items, ...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {all.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  );
}

function WhyUs() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow"><span className="dot"></span>Why ISAK</div>
            <h2 className="h-1 serif" style={{ marginTop: 18 }}>A community, not<br/><span className="serif-i" style={{ color: "var(--accent)" }}>a paperwork desk.</span></h2>
          </div>
          <div className="right">
            <p className="lede">
              Moving across continents is hard. ISAK exists to make Koblenz feel less foreign — from your first Anmeldung to your last Bachelorarbeit, and every Diwali in between.
            </p>
          </div>
        </div>

        <div className="features" data-reveal>
          {FEATURES.map((f) => (
            <div key={f.n} className="feature">
              <div className="num-bg">{f.n}</div>
              <div className="ico">{f.ico}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection({ navigate }) {
  return (
    <section className="section" style={{ background: "var(--paper)" }}>
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow"><span className="dot"></span>What's on</div>
            <h2 className="h-1 serif" style={{ marginTop: 18 }}>Upcoming<br/><span className="serif-i" style={{ color: "var(--peacock)" }}>gatherings.</span></h2>
          </div>
          <div className="right">
            <p className="lede">A mix of culture, career and just-because. All members get early access; non-members are welcome at most.</p>
            <a className="btn btn-ghost" href="#events" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); navigate("events"); }}>
              View full calendar <Icon.Arrow/>
            </a>
          </div>
        </div>

        <div className="events-grid">
          {EVENTS.map((ev, i) => (
            <article key={i} className="event-card" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="img">
                <img src={ev.img} alt={ev.title}/>
                <div className="date">
                  <div className="d">{ev.date.d}</div>
                  <div className="m">{ev.date.m}</div>
                </div>
              </div>
              <div className="body">
                <div className="cat">{ev.cat}</div>
                <h3>{ev.title}</h3>
                <p>{ev.desc}</p>
                <div className="meta">
                  <span><Icon.Calendar/> {ev.when}</span>
                  <span><Icon.Pin/> {ev.where}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ navigate }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow"><span className="dot"></span>From the journal</div>
            <h2 className="h-1 serif" style={{ marginTop: 18 }}>Stories &<br/><span className="serif-i" style={{ color: "var(--accent)" }}>survival tips.</span></h2>
          </div>
          <div className="right">
            <p className="lede">Practical guides written by students who just made the same mistakes — so you don't have to.</p>
            <a className="btn btn-ghost" href="#blog" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); navigate("blog"); }}>
              All articles <Icon.Arrow/>
            </a>
          </div>
        </div>

        <div className="blogs">
          {BLOGS.map((b, i) => (
            <article key={i} className={`blog-card ${i === 0 ? "featured" : ""}`} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="img"><img src={b.img} alt={b.title}/></div>
              <div className="body">
                <span className="tag">{b.tag}</span>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
                <div className="meta">{b.meta}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersSection({ navigate }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="section-head" data-reveal>
          <div>
            <div className="eyebrow"><span className="dot"></span>Backed by</div>
            <h2 className="h-2 serif" style={{ marginTop: 14 }}>
              Partners who help us<br/>
              <span className="serif-i" style={{ color: "var(--peacock)" }}>open doors.</span>
            </h2>
          </div>
          <div className="right">
            <p className="lede">From the university to the city to the embassy — these are the people who make ISAK possible.</p>
            <a className="btn btn-ghost" href="#partners" style={{ marginTop: 16 }} onClick={(e) => { e.preventDefault(); navigate("partners"); }}>
              Become a partner <Icon.Arrow/>
            </a>
          </div>
        </div>
        <div className="partners-strip" data-reveal>
          {PARTNERS.map((p) => (
            <div key={p} className="partner-cell">{p}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="section section-ink" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, opacity: 0.18 }}>
        <Marigold size={420} hue="var(--marigold)" inner="var(--saffron)"/>
      </div>
      <div style={{ position: "absolute", bottom: -120, left: -120, opacity: 0.10 }}>
        <Marigold size={520} hue="var(--peacock)" inner="var(--marigold)"/>
      </div>
      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div data-reveal style={{ maxWidth: "22ch" }}>
          <div className="eyebrow" style={{ color: "rgba(250,244,232,0.55)" }}>
            <span className="dot" style={{ background: "var(--marigold)" }}></span>
            In their words
          </div>
        </div>
        <blockquote className="serif" data-reveal style={{
          margin: "28px 0 0",
          fontSize: "clamp(36px, 5.6vw, 84px)",
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          maxWidth: "20ch",
        }}>
          <span style={{ color: "var(--marigold)", fontStyle: "italic" }}>"</span>
          I came to Koblenz alone. By <span className="serif-i" style={{ color: "var(--marigold)" }}>Diwali</span>, I had three hundred friends.
          <span style={{ color: "var(--marigold)", fontStyle: "italic" }}>"</span>
        </blockquote>
        <div data-reveal style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "url(https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=200&q=80&auto=format&fit=crop) center/cover",
          }}/>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>Ananya Iyer</div>
            <div style={{ fontSize: 13, color: "rgba(250,244,232,0.55)" }}>M.Sc. Information Management · 2025</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Home({ navigate }) {
  return (
    <div className="page-fade">
      <Hero navigate={navigate}/>
      <Marquee/>
      <WhyUs/>
      <EventsSection navigate={navigate}/>
      <Quote/>
      <BlogSection navigate={navigate}/>
      <PartnersSection navigate={navigate}/>
      <CTABanner navigate={navigate}/>
    </div>
  );
}

window.Home = Home;
window.HOME_EVENTS = EVENTS;
window.HOME_BLOGS = BLOGS;
window.HOME_PARTNERS = PARTNERS;
