// Renders published events from Supabase into the events grid.
// If Supabase isn't configured, returns errors, or has no upcoming events,
// the static fallback cards already in the HTML are left untouched.
(function () {
  const grid = document.getElementById("events-grid") || document.getElementById("home-events");
  if (!grid) return;
  const sb = window.isakSupabase && window.isakSupabase();
  if (!sb) return; // not configured yet → keep static fallback

  const isHome = grid.id === "home-events";
  const limit = isHome ? 3 : 60;
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function dateBadge(d) {
    if (!d) return '<div class="date"><div class="d">TBA</div><div class="m"></div></div>';
    const dt = new Date(d + "T00:00:00");
    return '<div class="date"><div class="d">' + dt.getDate() + '</div><div class="m">' + MONTHS[dt.getMonth()] + "</div></div>";
  }
  const pin = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s7-7.5 7-13a7 7 0 10-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>';
  const cal = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>';

  function card(e) {
    const img = e.image_url
      ? '<img src="' + esc(e.image_url) + '" alt="' + esc(e.title) + '"/>'
      : '<div style="width:100%;height:100%;background:linear-gradient(135deg,var(--marigold),var(--saffron))"></div>';
    const when = [e.date ? new Date(e.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "Date TBA", e.time]
      .filter(Boolean).join(", ");
    const rsvp = e.rsvp_url ? '<a href="' + esc(e.rsvp_url) + '" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" style="margin-top:14px">RSVP</a>' : "";
    return (
      '<article class="event-card" data-cat="' + esc(e.category || "Community") + '" data-reveal>' +
      '<div class="img">' + img + dateBadge(e.date) + "</div>" +
      '<div class="body">' +
      '<div class="cat">' + esc(e.category || "Community") + "</div>" +
      "<h3>" + esc(e.title) + "</h3>" +
      "<p>" + esc(e.summary || "") + "</p>" +
      '<div class="meta"><span>' + cal + " " + esc(when) + "</span>" +
      (e.location ? "<span>" + pin + " " + esc(e.location) + "</span>" : "") + "</div>" +
      rsvp +
      "</div></article>"
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  sb.from("events")
    .select("*")
    .eq("published", true)
    .order("date", { ascending: true })
    .then(function (res) {
      if (res.error || !res.data) return;
      const rows = res.data.filter(function (e) { return !e.date || e.date >= today; }).slice(0, limit);
      if (!rows.length) return; // keep fallback
      grid.innerHTML = rows.map(card).join("");
      grid.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
    })
    .catch(function () { /* keep fallback */ });
})();
