/* global React, ReactDOM, Nav, Footer, Home, AboutPage, EventsPage, TeamPage, PartnersPage, DocumentsPage, BlogPage, ContactPage, ImpressumPage, PrivacyPage, useReveal, TweaksPanel, useTweaks, TweakSection, TweakColor, TweakRadio */
const { useState, useEffect } = React;

const PALETTES = {
  saffron: { name: "Saffron", accent: "#E85D04", deep: "#C44503" },
  marigold: { name: "Marigold", accent: "#D49100", deep: "#A06D00" },
  peacock: { name: "Peacock", accent: "#0F4C5C", deep: "#083040" },
  rose: { name: "Rose", accent: "#C5283D", deep: "#8E1B2C" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "saffron",
  "animation": "bold"
}/*EDITMODE-END*/;

function App() {
  const [page, setPage] = useState(() => {
    const hash = location.hash.slice(1);
    const valid = ["home","about","events","teams","partners","blog","documents","contact","impressum","privacy"];
    return valid.includes(hash) ? hash : "home";
  });

  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.saffron;
    document.documentElement.style.setProperty("--accent", p.accent);
    document.documentElement.style.setProperty("--accent-deep", p.deep);
  }, [t.palette]);

  useEffect(() => {
    document.documentElement.dataset.anim = t.animation;
  }, [t.animation]);

  const navigate = (p) => {
    setPage(p);
    location.hash = p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.__navigate = navigate;
    const onHash = () => {
      const h = location.hash.slice(1);
      if (h && h !== page) setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [page]);

  useReveal();

  let content;
  switch (page) {
    case "about":     content = <AboutPage navigate={navigate}/>; break;
    case "events":    content = <EventsPage navigate={navigate}/>; break;
    case "teams":     content = <TeamPage navigate={navigate}/>; break;
    case "partners":  content = <PartnersPage navigate={navigate}/>; break;
    case "documents": content = <DocumentsPage navigate={navigate}/>; break;
    case "blog":      content = <BlogPage navigate={navigate}/>; break;
    case "contact":   content = <ContactPage navigate={navigate}/>; break;
    case "impressum": content = <ImpressumPage/>; break;
    case "privacy":   content = <PrivacyPage/>; break;
    default:          content = <Home navigate={navigate}/>;
  }

  return (
    <>
      <Nav current={page} navigate={navigate}/>
      <main key={page}>{content}</main>
      <Footer navigate={navigate}/>
      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent palette" />
        <TweakColor
          label="Accent"
          value={PALETTES[t.palette]?.accent || PALETTES.saffron.accent}
          options={Object.values(PALETTES).map(p => p.accent)}
          onChange={(hex) => {
            const key = Object.keys(PALETTES).find(k => PALETTES[k].accent === hex) || "saffron";
            setTweak("palette", key);
          }}
        />
        <TweakSection label="Motion" />
        <TweakRadio
          label="Animation intensity"
          value={t.animation}
          options={["subtle", "medium", "bold"]}
          onChange={(v) => setTweak("animation", v)}
        />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
