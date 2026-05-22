/* global React, Marigold, Icon, CTABanner */

/* ============================================================
   Inner pages
   ============================================================ */

function PageHero({ eyebrow, title, lede, crumbs }) {
  return (
    <section className="page-hero">
      <div className="wrap" data-reveal>
        {crumbs && (
          <div className="breadcrumb">
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <a href="#">{c}</a>
                {i < crumbs.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="eyebrow"><span className="dot"></span>{eyebrow}</div>
        <h1 className="h-1 serif">{title}</h1>
        {lede && <p className="lede" style={{ marginTop: 18 }}>{lede}</p>}
      </div>
      <div style={{ position: "absolute", right: -60, top: 20, opacity: 0.4, pointerEvents: "none" }}>
        <Marigold size={180}/>
      </div>
    </section>
  );
}

/* ----- About ----- */
function AboutPage({ navigate }) {
  const values = [
    { big: "01", title: "Belonging", desc: "From the first WhatsApp message to the last farewell — nobody navigates Koblenz alone." },
    { big: "02", title: "Roots & wings", desc: "We celebrate every Indian language, faith and region — and we build with our German hosts." },
    { big: "03", title: "Pay-it-forward", desc: "Today's seniors mentor tomorrow's freshers. The cycle is the whole point." },
  ];
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="About ISAK"
        title={<>A home, not just<br/><span className="serif-i" style={{ color: "var(--accent)" }}>an association.</span></>}
        lede="Founded in 2014 by six students from Mumbai, Chennai and Delhi, ISAK is now Koblenz's largest cultural student body. We run on volunteers, samosas, and the conviction that you shouldn't have to figure out a new country alone."
      />

      <section className="section">
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center" }}>
            <div data-reveal>
              <div className="eyebrow"><span className="dot"></span>Our story</div>
              <h2 className="h-2 serif" style={{ marginTop: 18, marginBottom: 24 }}>
                Started over <span className="serif-i" style={{ color: "var(--accent)" }}>chai</span> in a dorm in 2014.
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)", marginBottom: 16 }}>
                Six students. One pressure cooker. A shared frustration with bureaucracy and an unshakeable hunger for ghar-ka-khaana.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)", marginBottom: 16 }}>
                Twelve years later, ISAK is a registered eingetragener Verein with 340+ active members, a board of nine, a quarter-million-rupee annual budget, and a Diwali celebration that books out the Audimax.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-soft)" }}>
                We're still about chai, mostly. Just a lot more of it.
              </p>
            </div>
            <div data-reveal style={{ position: "relative" }}>
              <div style={{
                aspectRatio: "4/5",
                borderRadius: "var(--r-lg)",
                overflow: "hidden",
                boxShadow: "var(--shadow-lg)",
                background: "url(https://images.unsplash.com/photo-1530021232320-687d8e3dba54?w=800&q=80&auto=format&fit=crop) center/cover",
              }}/>
              <div style={{
                position: "absolute",
                bottom: -32, left: -32,
                background: "var(--cream)",
                padding: "24px 28px",
                borderRadius: "var(--r-md)",
                boxShadow: "var(--shadow-md)",
                maxWidth: 260,
              }}>
                <div className="serif" style={{ fontSize: 48, lineHeight: 1, color: "var(--accent)" }}>2014</div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", marginTop: 6 }}>Founded by 6 students at Hochschule Koblenz</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper)" }}>
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <div className="eyebrow"><span className="dot"></span>What we stand for</div>
              <h2 className="h-1 serif" style={{ marginTop: 18 }}>Three things,<br/><span className="serif-i" style={{ color: "var(--peacock)" }}>repeated daily.</span></h2>
            </div>
          </div>
          <div className="values">
            {values.map((v) => (
              <div className="value" data-reveal key={v.big}>
                <div className="big">{v.big}</div>
                <h4>{v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner navigate={navigate}/>
    </div>
  );
}

/* ----- Events ----- */
const ALL_EVENTS = [
  { cat: "Cultural", title: "Diwali Night 2026", desc: "An evening of light, dance, food and music — open to all in Koblenz.", date: { d: "07", m: "Nov" }, when: "Nov 7, 19:00", where: "Audimax, RAC", img: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=900&q=80&auto=format&fit=crop" },
  { cat: "Welcome", title: "Winter Semester Welcome", desc: "Meet your seniors, get bureaucracy tips, and find your people on day one.", date: { d: "12", m: "Oct" }, when: "Oct 12, 16:00", where: "RheinMoselCampus", img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=80&auto=format&fit=crop" },
  { cat: "Career", title: "German CV Workshop", desc: "A hands-on session with career coaches on writing Lebensläufe that land interviews.", date: { d: "21", m: "Oct" }, when: "Oct 21, 18:00", where: "Online · Zoom", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80&auto=format&fit=crop" },
  { cat: "Cultural", title: "Holi on the Rhine", desc: "Colours, music and pakoras by the river. Bring white clothes, leave a rainbow.", date: { d: "14", m: "Mar" }, when: "Mar 14, 14:00", where: "Deutsches Eck", img: "https://images.unsplash.com/photo-1583996730546-3e15c3da10c5?w=900&q=80&auto=format&fit=crop" },
  { cat: "Social", title: "Cricket & Chai Sundays", desc: "Weekly tape-ball game followed by chai. All levels, all welcome.", date: { d: "every", m: "Sun" }, when: "Sundays, 11:00", where: "Oberwerth Sportpark", img: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&q=80&auto=format&fit=crop" },
  { cat: "Career", title: "Alumni Roundtable", desc: "Six ISAK alumni share how they went from semester abroad to Blue Card jobs.", date: { d: "29", m: "Nov" }, when: "Nov 29, 18:00", where: "Karthause Campus", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop" },
];

function EventsPage({ navigate }) {
  const [filter, setFilter] = React.useState("All");
  const cats = ["All", "Cultural", "Career", "Welcome", "Social"];
  const filtered = filter === "All" ? ALL_EVENTS : ALL_EVENTS.filter(e => e.cat === filter);
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Events"
        title={<>The ISAK<br/><span className="serif-i" style={{ color: "var(--accent)" }}>calendar.</span></>}
        lede="Twenty-eight events a year, from Diwali Night to Tuesday tandem-language meetups. Members get early access and free entry to most."
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div data-reveal style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, alignItems: "center" }}>
            <span className="eyebrow" style={{ marginRight: 12 }}>Filter</span>
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className="nav-link"
                style={{
                  background: filter === c ? "var(--ink)" : "transparent",
                  color: filter === c ? "var(--cream)" : "var(--ink-soft)",
                  border: "1px solid " + (filter === c ? "var(--ink)" : "var(--line)"),
                  padding: "8px 16px",
                }}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="events-grid">
            {filtered.map((ev, i) => (
              <article key={i} className="event-card" data-reveal style={{ transitionDelay: `${i*60}ms` }}>
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
      <CTABanner navigate={navigate}/>
    </div>
  );
}

/* ----- Team ----- */
const TEAM = [
  { role: "President", name: "Aarav Sharma", from: "Mumbai · M.Sc. Mech. Eng.", img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80&auto=format&fit=crop" },
  { role: "Vice President", name: "Priya Menon", from: "Kochi · M.Sc. Info. Mgmt.", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&auto=format&fit=crop" },
  { role: "Treasurer", name: "Ishaan Gupta", from: "Delhi · B.Eng. Elec. Eng.", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80&auto=format&fit=crop" },
  { role: "Secretary", name: "Tanvi Reddy", from: "Hyderabad · M.Sc. CS", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80&auto=format&fit=crop" },
  { role: "Events Lead", name: "Rohan Patel", from: "Ahmedabad · M.Sc. Logistics", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80&auto=format&fit=crop" },
  { role: "Welfare Lead", name: "Ananya Iyer", from: "Bengaluru · M.Sc. Info. Mgmt.", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=600&q=80&auto=format&fit=crop" },
  { role: "Career Lead", name: "Karan Singh", from: "Chandigarh · M.B.A.", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&q=80&auto=format&fit=crop" },
  { role: "Media Lead", name: "Meera Joshi", from: "Pune · B.A. Design", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80&auto=format&fit=crop" },
];

function TeamPage({ navigate }) {
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="The Board · 2026"
        title={<>Volunteers who<br/><span className="serif-i" style={{ color: "var(--accent)" }}>make this run.</span></>}
        lede="Nine elected students, one-year terms, zero pay. They juggle theses, jobs and ISAK — write them a thank-you when you see them."
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="team-grid">
            {TEAM.map((m, i) => (
              <article key={i} className="team-card" data-reveal style={{ transitionDelay: `${i*50}ms` }}>
                <div className="photo"><img src={m.img} alt={m.name}/></div>
                <div className="body">
                  <div className="role">{m.role}</div>
                  <h3>{m.name}</h3>
                  <div className="from">{m.from}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div data-reveal>
            <div className="eyebrow" style={{ color: "rgba(250,244,232,0.55)" }}><span className="dot" style={{ background: "var(--marigold)" }}></span>Want to lead?</div>
            <h2 className="h-1 serif" style={{ marginTop: 18 }}>Elections every<br/><span className="serif-i" style={{ color: "var(--marigold)" }}>January.</span></h2>
            <p className="lede" style={{ marginTop: 18 }}>
              Any member who's been with ISAK for one semester can stand. Roles span events, finance, welfare, careers and media — pick what calls you.
            </p>
            <a className="btn btn-accent" href="#" style={{ marginTop: 24 }} onClick={(e) => { e.preventDefault(); navigate("contact"); }}>
              Talk to the board <Icon.ArrowUR/>
            </a>
          </div>
          <div data-reveal style={{
            aspectRatio: "4/3",
            borderRadius: "var(--r-lg)",
            overflow: "hidden",
            background: "url(https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&q=80&auto=format&fit=crop) center/cover",
          }}/>
        </div>
      </section>
    </div>
  );
}

/* ----- Partners ----- */
function PartnersPage({ navigate }) {
  const tiers = [
    {
      tier: "Anchor partners",
      desc: "Multi-year commitments that fund our welfare, scholarships and welcome programs.",
      partners: [
        { name: "Hochschule Koblenz", note: "Host university · since 2014" },
        { name: "Stadt Koblenz", note: "Cultural integration grant" },
        { name: "Indian Embassy · Berlin", note: "Cultural diplomacy partner" },
      ],
    },
    {
      tier: "Career partners",
      desc: "Companies who hire from our community and run workshops, internships and the annual fair.",
      partners: [
        { name: "Stabilus", note: "Internships · Werkstudent" },
        { name: "Lohmann GmbH", note: "Career fair anchor" },
        { name: "TVM Capital", note: "MBA mentorship" },
        { name: "Schenker", note: "Logistics roles" },
      ],
    },
    {
      tier: "Community partners",
      desc: "The local heroes who keep our events running and our students looked after.",
      partners: [
        { name: "AOK Rheinland-Pfalz", note: "Health insurance navigation" },
        { name: "Sparkasse Koblenz", note: "Student banking" },
        { name: "AStA Hochschule Koblenz", note: "Student union" },
        { name: "Koblenz Tourismus", note: "Welcome tours" },
      ],
    },
  ];
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Partners"
        title={<>The people who<br/><span className="serif-i" style={{ color: "var(--accent)" }}>back ISAK.</span></>}
        lede="Sponsors, the university, the city, embassies, and local businesses. Every event you attend was made possible by one of them."
      />

      {tiers.map((t, ti) => (
        <section key={ti} className="section" style={{ paddingTop: 40, paddingBottom: 40, background: ti % 2 ? "var(--paper)" : "transparent" }}>
          <div className="wrap">
            <div data-reveal style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64, alignItems: "start", marginBottom: 32 }}>
              <div>
                <div className="eyebrow"><span className="dot"></span>{t.tier}</div>
                <h2 className="h-3 serif" style={{ marginTop: 12 }}>{t.tier}</h2>
              </div>
              <p className="lede" style={{ margin: 0 }}>{t.desc}</p>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${Math.min(t.partners.length, 4)}, 1fr)`,
              gap: 1,
              background: "var(--line)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
              border: "1px solid var(--line)",
            }} data-reveal>
              {t.partners.map((p) => (
                <div key={p.name} style={{
                  background: "var(--paper)",
                  padding: "32px 28px",
                  minHeight: 160,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "background .2s ease",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "var(--cream-warm)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "var(--paper)"}
                >
                  <div className="serif" style={{ fontSize: 26, lineHeight: 1.1 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: 14 }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section">
        <div className="wrap">
          <div className="cta-banner" data-reveal style={{ background: "var(--peacock-deep)" }}>
            <div className="deco" style={{ position: "absolute", right: "-100px", top: "-100px" }}>
              <Marigold size={400} hue="var(--marigold)" inner="var(--saffron)"/>
            </div>
            <div style={{ position: "relative", zIndex: 1, maxWidth: "44ch" }}>
              <div className="eyebrow" style={{ color: "rgba(250,244,232,0.6)", marginBottom: 18 }}>
                <span className="dot" style={{ background: "var(--marigold)" }}></span>
                Partner with ISAK
              </div>
              <h2 className="h-1" style={{ color: "var(--cream)" }}>
                Hire Indian talent.<br/>
                <span className="serif-i" style={{ color: "var(--marigold)" }}>Sponsor a Diwali.</span>
              </h2>
              <p className="lede" style={{ color: "rgba(250,244,232,0.75)", margin: "18px 0 28px" }}>
                Reach 340+ STEM and management students at Hochschule Koblenz, plus a 1,200-strong alumni network across DACH. Sponsorship packages from €500.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="btn btn-accent" href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>
                  Request partnership deck <Icon.ArrowUR/>
                </a>
                <a className="btn btn-ghost" href="#" style={{ color: "var(--cream)", borderColor: "rgba(250,244,232,0.2)" }} onClick={(e) => { e.preventDefault(); navigate("documents"); }}>
                  Download brochure
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----- Documents ----- */
const DOCS = [
  { name: "ISAK Constitution (Satzung)", desc: "The legal document governing ISAK e.V.", size: "PDF · 412 KB", year: "2024" },
  { name: "Partnership Brochure 2026", desc: "Sponsorship tiers, demographics and reach.", size: "PDF · 2.1 MB", year: "2026" },
  { name: "Welcome Handbook for New Students", desc: "Anmeldung, blocked accounts, semester ticket and more.", size: "PDF · 5.4 MB", year: "2026" },
  { name: "Annual Report 2025", desc: "Events, finances and impact in numbers.", size: "PDF · 3.8 MB", year: "2025" },
  { name: "ISAK Logo & Brand Kit", desc: "Logos, colors and typography for partners and press.", size: "ZIP · 18 MB", year: "2026" },
  { name: "Membership Application Form", desc: "Fillable PDF — bring to the welcome desk.", size: "PDF · 124 KB", year: "2026" },
  { name: "Event Code of Conduct", desc: "What we expect at every ISAK gathering.", size: "PDF · 86 KB", year: "2025" },
  { name: "Press Kit", desc: "High-res photos, board bios, fact sheet.", size: "ZIP · 42 MB", year: "2026" },
];

function DocumentsPage({ navigate }) {
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Documents"
        title={<>Forms, reports,<br/><span className="serif-i" style={{ color: "var(--accent)" }}>brand kits.</span></>}
        lede="Everything official, in one place. Public documents are free to share — please credit ISAK when you do."
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="docs-list" data-reveal>
            {DOCS.map((d, i) => (
              <div key={i} className="doc-row">
                <div className="icn">PDF</div>
                <div>
                  <h4>{d.name}</h4>
                  <p>{d.desc}</p>
                </div>
                <div className="size">{d.size} · {d.year}</div>
                <div className="arr"><Icon.ArrowUR/></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTABanner navigate={navigate}/>
    </div>
  );
}

/* ----- Blog ----- */
const ALL_BLOGS = [
  { tag: "Survival Guide", title: "Your first 14 days in Koblenz: a step-by-step", desc: "Anmeldung, blocked accounts, semester ticket and the SIM that won't break you. Real talk from students who just did it.", meta: "8 min read · Updated Oct 2026", img: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&q=80&auto=format&fit=crop" },
  { tag: "Housing", title: "Renting in Koblenz without losing your mind", desc: "WG-Gesucht decoded, Schufa, Bürge, and what a Kaution actually is.", meta: "6 min read · Sep 2026", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=80&auto=format&fit=crop" },
  { tag: "Career", title: "From Werkstudent to full-time: a roadmap", desc: "How to convert a student job into a Blue Card offer.", meta: "9 min read · Aug 2026", img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900&q=80&auto=format&fit=crop" },
  { tag: "Money", title: "German taxes for students, explained simply", desc: "ELSTER, Werkstudent caps, and how to actually file your Steuererklärung.", meta: "7 min read · Jul 2026", img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=900&q=80&auto=format&fit=crop" },
  { tag: "Language", title: "Learning German while doing a Master's", desc: "Realistic 6-month and 12-month plans that don't sabotage your GPA.", meta: "10 min read · Jul 2026", img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80&auto=format&fit=crop" },
  { tag: "Culture", title: "Surviving German winter — an Indian perspective", desc: "Vitamin D, raclette, and why January is shorter than it feels.", meta: "5 min read · Jun 2026", img: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=900&q=80&auto=format&fit=crop" },
  { tag: "Health", title: "Public vs private health insurance for students", desc: "The TK vs AOK question, and when private is actually worth it.", meta: "8 min read · May 2026", img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=80&auto=format&fit=crop" },
  { tag: "Career", title: "How to network in Germany without faking it", desc: "Why German colleagues seem cold, and how to actually make friends at work.", meta: "6 min read · Apr 2026", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=900&q=80&auto=format&fit=crop" },
];

function BlogPage({ navigate }) {
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="The journal"
        title={<>Stories &<br/><span className="serif-i" style={{ color: "var(--accent)" }}>survival tips.</span></>}
        lede="Real guides for students arriving in Germany — written by students who just navigated the same things. No corporate filler."
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {ALL_BLOGS.map((b, i) => (
              <article key={i} className="blog-card" data-reveal style={{ transitionDelay: `${i*40}ms` }}>
                <div className="img"><img src={b.img} alt={b.title}/></div>
                <div className="body">
                  <span className="tag">{b.tag}</span>
                  <h3 style={{ fontSize: 24 }}>{b.title}</h3>
                  <p>{b.desc}</p>
                  <div className="meta">{b.meta}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTABanner navigate={navigate}/>
    </div>
  );
}

/* ----- Contact / Register ----- */
function ContactPage({ navigate }) {
  const [sent, setSent] = React.useState(false);
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Become a Member"
        title={<>Join ISAK.<br/><span className="serif-i" style={{ color: "var(--accent)" }}>It's free for students.</span></>}
        lede="Drop your details below and our welfare lead will be in touch within 48 hours with your member ID, WhatsApp invite and welcome packet."
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="contact-grid">
            <form className="contact-form" data-reveal onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="field row2">
                <div className="field">
                  <label>First name</label>
                  <input type="text" placeholder="Aarav" required/>
                </div>
                <div className="field">
                  <label>Last name</label>
                  <input type="text" placeholder="Sharma" required/>
                </div>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="you@hs-koblenz.de" required/>
              </div>
              <div className="field row2">
                <div className="field">
                  <label>Program</label>
                  <input type="text" placeholder="M.Sc. Information Management"/>
                </div>
                <div className="field">
                  <label>Hometown</label>
                  <input type="text" placeholder="Mumbai"/>
                </div>
              </div>
              <div className="field">
                <label>I'm interested in</label>
                <textarea placeholder="Cultural events, mentorship, career help, housing tips…"/>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
                <button className="btn btn-primary" type="submit">
                  {sent ? "✓ Welcome to ISAK" : <>Send my application <Icon.ArrowUR/></>}
                </button>
                <span style={{ fontSize: 13, color: "var(--ink-muted)" }}>We reply within 48 hours.</span>
              </div>
            </form>

            <aside className="contact-info" data-reveal>
              <div style={{ position: "absolute", top: -60, right: -60, opacity: 0.2 }}>
                <Marigold size={240}/>
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <h3>Other ways<br/>to reach us</h3>
                <div className="row">
                  <div className="ico"><Icon.Mail/></div>
                  <div>
                    <div className="lbl">Email</div>
                    <div className="val">hello@isak-koblenz.de</div>
                  </div>
                </div>
                <div className="row">
                  <div className="ico"><Icon.MapPin/></div>
                  <div>
                    <div className="lbl">Office</div>
                    <div className="val">Hochschule Koblenz, Building C<br/>Konrad-Zuse-Straße 1, 56075 Koblenz</div>
                  </div>
                </div>
                <div className="row">
                  <div className="ico"><Icon.Phone/></div>
                  <div>
                    <div className="lbl">WhatsApp helpline</div>
                    <div className="val">+49 261 555 0123</div>
                  </div>
                </div>
                <div className="row">
                  <div className="ico"><Icon.Calendar/></div>
                  <div>
                    <div className="lbl">Office hours</div>
                    <div className="val">Thursdays · 16:00–18:00</div>
                  </div>
                </div>

                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(250,244,232,0.12)" }}>
                  <div className="lbl">Follow ISAK</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                    <a className="social-btn" href="#" aria-label="Instagram"><Icon.Instagram/></a>
                    <a className="social-btn" href="#" aria-label="LinkedIn"><Icon.LinkedIn/></a>
                    <a className="social-btn" href="#" aria-label="WhatsApp"><Icon.WhatsApp/></a>
                    <a className="social-btn" href="#" aria-label="YouTube"><Icon.YouTube/></a>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----- Impressum ----- */
function ImpressumPage() {
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Legal · § 5 TMG"
        title="Impressum"
        crumbs={["Home", "Legal", "Impressum"]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="longform">
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>Indian Students Association Koblenz e.V.</strong><br/>
              c/o Hochschule Koblenz<br/>
              Konrad-Zuse-Straße 1<br/>
              56075 Koblenz, Deutschland
            </p>

            <h3>Vertreten durch</h3>
            <p>Aarav Sharma (1. Vorsitzender)<br/>Priya Menon (Stellvertretende Vorsitzende)</p>

            <h3>Kontakt</h3>
            <p>Telefon: +49 261 555 0123<br/>E-Mail: hello@isak-koblenz.de</p>

            <h3>Registereintrag</h3>
            <p>Eintragung im Vereinsregister<br/>Registergericht: Amtsgericht Koblenz<br/>Registernummer: VR 41827</p>

            <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
            <p>Aarav Sharma<br/>Konrad-Zuse-Straße 1<br/>56075 Koblenz</p>

            <h2>Haftung für Inhalte</h2>
            <p>Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.</p>
            <p>Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.</p>

            <h2>Haftung für Links</h2>
            <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>

            <h2>Urheberrecht</h2>
            <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>

            <p style={{ marginTop: 40, color: "var(--ink-muted)", fontSize: 14 }}>Stand: Januar 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----- Privacy Policy ----- */
function PrivacyPage() {
  return (
    <div className="page-fade">
      <PageHero
        eyebrow="Legal · DSGVO / GDPR"
        title="Data Privacy Policy"
        crumbs={["Home", "Legal", "Privacy"]}
      />
      <section className="section" style={{ paddingTop: 40 }}>
        <div className="wrap">
          <div className="longform">
            <div className="toc">
              <h4>On this page</h4>
              <ol>
                <li>Who we are</li>
                <li>What data we collect</li>
                <li>How we use your data</li>
                <li>Cookies and analytics</li>
                <li>Your rights under GDPR</li>
                <li>Contact our Data Protection Officer</li>
              </ol>
            </div>

            <h2>1. Who we are</h2>
            <p>The data controller for this website is Indian Students Association Koblenz e.V., registered at Konrad-Zuse-Straße 1, 56075 Koblenz, Germany. We collect and process personal data in accordance with the EU General Data Protection Regulation (GDPR) and the German Federal Data Protection Act (BDSG).</p>

            <h2>2. What data we collect</h2>
            <p>When you visit our website, we collect:</p>
            <ul>
              <li>Anonymised access logs (IP address, browser, page visited, timestamp) for security and analytics.</li>
              <li>Information you submit voluntarily through forms (name, email, program, message).</li>
              <li>Cookies necessary for the site to function, and optional analytics cookies only with your consent.</li>
            </ul>

            <h2>3. How we use your data</h2>
            <p>We use your data only for the purposes you provide it. Membership applications are kept for the duration of your time at Hochschule Koblenz plus one year. Newsletter subscriptions are kept until you unsubscribe. We do not sell, rent or share your data with third parties for marketing.</p>

            <h2>4. Cookies and analytics</h2>
            <p>This site uses essential session cookies and, with your consent, privacy-respecting analytics (Plausible) hosted in the EU. No data is shared with US-based ad networks. You can opt out at any time using the cookie settings in the footer.</p>

            <h2>5. Your rights under GDPR</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion ("right to be forgotten")</li>
              <li>Restrict or object to processing</li>
              <li>Receive your data in a portable format</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p>To exercise any of these rights, email <strong>privacy@isak-koblenz.de</strong>. We respond within 30 days.</p>

            <h2>6. Contact our Data Protection Officer</h2>
            <p>Tanvi Reddy, Secretary and DPO<br/>privacy@isak-koblenz.de<br/>Konrad-Zuse-Straße 1, 56075 Koblenz</p>

            <p style={{ marginTop: 40, color: "var(--ink-muted)", fontSize: 14 }}>Last updated: January 2026 · Version 2.1</p>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, {
  AboutPage, EventsPage, TeamPage, PartnersPage, DocumentsPage, BlogPage, ContactPage, ImpressumPage, PrivacyPage,
});
