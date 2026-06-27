/* global React */
const { useState, useEffect, useRef } = React;

/* ============================================================
   ISAK — Shared components
   ============================================================ */

/* ----- Marigold SVG (decorative) ----- */
function Marigold({ size = 120, hue = "var(--marigold)", inner = "var(--saffron)" }) {
  const petals = Array.from({ length: 14 });
  return (
    <svg viewBox="-60 -60 120 120" width={size} height={size} aria-hidden="true">
      <g>
        {petals.map((_, i) => {
          const angle = (i / petals.length) * 360;
          return (
            <ellipse
              key={i}
              cx="0" cy="-32"
              rx="11" ry="22"
              fill={hue}
              transform={`rotate(${angle})`}
              opacity="0.92"
            />
          );
        })}
        {petals.map((_, i) => {
          const angle = ((i + 0.5) / petals.length) * 360;
          return (
            <ellipse
              key={`b-${i}`}
              cx="0" cy="-22"
              rx="9" ry="16"
              fill={inner}
              transform={`rotate(${angle})`}
              opacity="0.95"
            />
          );
        })}
        <circle cx="0" cy="0" r="10" fill="var(--saffron-deep)" />
        <circle cx="0" cy="0" r="5" fill="var(--marigold)" />
      </g>
    </svg>
  );
}

/* ----- Logo: monogram "इ" inside circular sun + wordmark ----- */
function Logo({ size = 38, dark = false }) {
  return (
    <a href="#" className="logo" onClick={(e) => { e.preventDefault(); window.__navigate?.("home"); }}>
      <span className="mark" style={{ width: size, height: size }}>
        <svg viewBox="0 0 48 48">
          <defs>
            <linearGradient id="lg-isak" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--saffron)"/>
              <stop offset="100%" stopColor="var(--marigold)"/>
            </linearGradient>
          </defs>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="23" y="1"
              width="2" height="6"
              fill="url(#lg-isak)"
              transform={`rotate(${i * 30} 24 24)`}
            />
          ))}
          <circle cx="24" cy="24" r="16" fill="url(#lg-isak)"/>
          <circle cx="24" cy="24" r="14" fill="var(--ink)"/>
          <text
            x="24" y="32"
            textAnchor="middle"
            fontFamily="Tiro Devanagari Hindi, serif"
            fontSize="20"
            fill="var(--cream)"
          >इ</text>
        </svg>
      </span>
      <span className="wm">
        <span className="one">ISAK</span>
        <span className="two">Koblenz</span>
      </span>
    </a>
  );
}

/* ----- Nav ----- */
const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "events", label: "Events" },
  { id: "teams", label: "Team" },
  { id: "partners", label: "Partners" },
  { id: "blog", label: "Blog" },
  { id: "documents", label: "Documents" },
  { id: "contact", label: "Contact" },
];

function Nav({ current, navigate }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Logo />
        <div className="nav-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link ${current === item.id ? "active" : ""}`}
              onClick={(e) => { e.preventDefault(); navigate(item.id); }}
            >
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="#join"
          className="nav-cta"
          onClick={(e) => { e.preventDefault(); navigate("contact"); }}
        >
          Become a Member
          <svg className="arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg>
        </a>
      </div>
    </nav>
  );
}

/* ----- Icons ----- */
const Icon = {
  Instagram: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>,
  LinkedIn: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.3 18.3H5.7V9.7h2.6v8.6zM7 8.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm11.3 9.8h-2.6v-4.2c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.6V9.7h2.5v1.2c.4-.7 1.2-1.4 2.5-1.4 2.7 0 3.2 1.8 3.2 4.1v4.7z"/></svg>,
  WhatsApp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1 4a.5.5 0 00.6.6l4-1A10 10 0 1012 2zm5.4 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-2.9-1.3-4.8-4.3-5-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.5c.2 0 .4 0 .7.5l.9 2c.1.2.1.4 0 .6l-.4.5-.3.4c-.1.1-.2.3 0 .5l.9 1.4c.7 1 1.4 1.4 1.9 1.7.5.3.8.2.9.2l.7-.6c.2-.2.5-.3.7-.2l1.9 1c.3.1.5.2.6.4.1.2.1.7-.1 1.2z"/></svg>,
  YouTube: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16.4 5 12 5 12 5s-4.4 0-7.2.2c-.4 0-1.2.1-2 .9C2.2 6.7 2 8 2 8s-.2 1.6-.2 3.2v1.6c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.6.1 7 .2 7 .2s4.4 0 7.2-.2c.4 0 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.6c0-1.6-.2-3.2-.2-3.2zM9.7 14.6V8.8l5.7 2.9-5.7 2.9z"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>,
  MapPin: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  Phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/></svg>,
  Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  Arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  ArrowUR: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M9 7h8v8"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 7 7 .8-5.3 4.7L18 22l-6-3.6L6 22l1.3-7.5L2 9.8 9 9z"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18"/></svg>,
  Heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-7-4.5-9.5-9C1 9 2 5 5.5 4.5 8 4 10 6 12 8c2-2 4-4 6.5-3.5C22 5 23 9 21.5 12c-2.5 4.5-9.5 9-9.5 9z"/></svg>,
  Sparkle: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z"/></svg>,
  Hands: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 11V5a2 2 0 014 0v6M12 11V4a2 2 0 014 0v7M16 11V6a2 2 0 014 0v8a8 8 0 01-8 8 8 8 0 01-8-8V9a2 2 0 014 0v5"/></svg>,
};

/* ----- Footer ----- */
function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ filter: "invert(0)" }}>
              <a href="#" className="logo" onClick={(e) => { e.preventDefault(); navigate("home"); }} style={{ color: "var(--cream)" }}>
                <span className="mark" style={{ width: 38, height: 38 }}>
                  <svg viewBox="0 0 48 48">
                    <defs>
                      <linearGradient id="lg-isak-f" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--saffron)"/>
                        <stop offset="100%" stopColor="var(--marigold)"/>
                      </linearGradient>
                    </defs>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <rect key={i} x="23" y="1" width="2" height="6" fill="url(#lg-isak-f)" transform={`rotate(${i*30} 24 24)`} />
                    ))}
                    <circle cx="24" cy="24" r="16" fill="url(#lg-isak-f)"/>
                    <circle cx="24" cy="24" r="14" fill="var(--ink)"/>
                    <text x="24" y="32" textAnchor="middle" fontFamily="Tiro Devanagari Hindi, serif" fontSize="20" fill="var(--cream)">इ</text>
                  </svg>
                </span>
                <span className="wm">
                  <span className="one">ISAK</span>
                  <span className="two">Koblenz</span>
                </span>
              </a>
            </div>
            <p style={{ fontSize: 14, color: "rgba(250,244,232,0.7)", marginTop: 20, lineHeight: 1.6, maxWidth: "32ch" }}>
              The Indian Students Association at Hochschule Koblenz — community, careers and culture for Indian students in Germany.
            </p>
            <div className="socials">
              <a className="social-btn" href="#" aria-label="Instagram"><Icon.Instagram/></a>
              <a className="social-btn" href="#" aria-label="LinkedIn"><Icon.LinkedIn/></a>
              <a className="social-btn" href="#" aria-label="WhatsApp"><Icon.WhatsApp/></a>
              <a className="social-btn" href="#" aria-label="YouTube"><Icon.YouTube/></a>
            </div>
          </div>

          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("about"); }}>About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("events"); }}>Events</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("teams"); }}>Team</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("blog"); }}>Blog</a></li>
            </ul>
          </div>

          <div>
            <h5>Resources</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("partners"); }}>Partners</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("documents"); }}>Documents</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Contact</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Become a Member</a></li>
            </ul>
          </div>

          <div>
            <h5>Legal</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("impressum"); }}>Impressum</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("privacy"); }}>Data Privacy</a></li>
              <li><a href="#">Cookie Settings</a></li>
            </ul>
          </div>

          <div>
            <h5>Stay in the loop</h5>
            <p style={{ fontSize: 14, color: "rgba(250,244,232,0.7)", margin: "0 0 12px", lineHeight: 1.5 }}>
              Monthly digest. Events, opportunities, and stories from the ISAK community.
            </p>
            <form className="newsletter" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Indian Students Association Koblenz e.V. · Hochschule Koblenz</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("impressum"); }}>Impressum</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("privacy"); }}>Privacy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>Contact</a>
          </div>
        </div>
      </div>

      <div className="footer-tagline serif-i">Indian students. Building futures in Koblenz.</div>
    </footer>
  );
}

/* ----- Reveal-on-scroll hook ----- */
function useReveal() {
  useEffect(() => {
    let io;
    const init = () => {
      if (io) io.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
      );
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    };
    init();
    let ticks = 0;
    const t = setInterval(() => {
      init();
      if (++ticks > 6) clearInterval(t);
    }, 250);
    const safety = setTimeout(() => {
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => el.classList.add("in"));
    }, 2500);
    return () => { clearInterval(t); clearTimeout(safety); if (io) io.disconnect(); };
  }, []);
}

/* ----- CTA Banner reusable ----- */
function CTABanner({ navigate }) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="cta-banner" data-reveal>
          <div className="deco" style={{ position: "absolute", right: "-80px", top: "-80px" }}>
            <Marigold size={360} hue="var(--marigold)" inner="var(--saffron)" />
          </div>
          <div style={{ position: "relative", zIndex: 1, maxWidth: "32ch" }}>
            <div className="eyebrow" style={{ color: "rgba(250,244,232,0.6)", marginBottom: 18 }}>
              <span className="dot" style={{ background: "var(--marigold)" }}></span>
              Join the community
            </div>
            <h2 className="h-1">Become a part of <em>ISAK</em>.</h2>
            <p className="lede">Membership opens doors to events, mentorship, housing help, career networks, and friendships that outlast Koblenz.</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-accent" href="#" onClick={(e) => { e.preventDefault(); navigate("contact"); }}>
                Register now <Icon.ArrowUR/>
              </a>
              <a className="btn btn-ghost" href="#" style={{ color: "var(--cream)", borderColor: "rgba(250,244,232,0.2)" }} onClick={(e) => { e.preventDefault(); navigate("about"); }}>
                Why ISAK
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Export */
Object.assign(window, {
  Marigold, Logo, Nav, Footer, Icon, CTABanner, useReveal, NAV_ITEMS,
});
