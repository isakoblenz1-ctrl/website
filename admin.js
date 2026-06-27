// ISAK admin panel — Supabase Auth + CRUD. Vanilla JS, no build step.
(function () {
  const sb = window.isakSupabase && window.isakSupabase();
  const $ = (id) => document.getElementById(id);
  const boot = $("boot"), login = $("login"), dash = $("dash");

  if (!sb) {
    boot.innerHTML = "Supabase isn't configured yet. Add your project URL and anon key to <code>supabase-config.js</code>.";
    return;
  }

  const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const msg = (el, text, kind) => { el.innerHTML = text ? '<div class="msg ' + (kind || "") + '">' + esc(text) + "</div>" : ""; };

  // ---------- Auth ----------
  $("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    msg($("login-msg"), "");
    const { error } = await sb.auth.signInWithPassword({ email: $("login-email").value.trim(), password: $("login-pass").value });
    if (error) return msg($("login-msg"), error.message, "err");
    init();
  });
  $("forgot").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = $("login-email").value.trim();
    if (!email) return msg($("login-msg"), "Enter your email above first.", "err");
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + "/admin.html" });
    msg($("login-msg"), error ? error.message : "Password reset email sent.", error ? "err" : "ok");
  });
  $("logout").addEventListener("click", async () => { await sb.auth.signOut(); location.reload(); });

  async function init() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { boot.style.display = "none"; dash.style.display = "none"; login.style.display = "block"; return; }
    // verify admin
    const { data: admin } = await sb.from("admins").select("id,name,email").eq("id", user.id).maybeSingle();
    if (!admin) {
      boot.style.display = "none"; login.style.display = "none"; dash.style.display = "none";
      document.body.insertAdjacentHTML("beforeend",
        '<div class="login-card"><h1>Not authorised</h1><p>You\'re signed in as ' + esc(user.email) +
        ', but you\'re not an admin yet. Ask an existing admin to add you.</p><button class="btn btn-ghost btn-sm" onclick="(async()=>{await window.__sb.auth.signOut();location.reload();})()">Sign out</button></div>');
      window.__sb = sb;
      return;
    }
    $("who").textContent = admin.name || admin.email;
    boot.style.display = "none"; login.style.display = "none"; dash.style.display = "block";
    renderEvents();
  }

  // ---------- Tabs ----------
  const renderers = {};
  document.querySelectorAll(".tab").forEach((t) => {
    t.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((x) => x.classList.remove("active"));
      t.classList.add("active");
      const name = t.dataset.tab;
      $("panel-" + name).classList.add("active");
      (renderers[name] || function () {})();
    });
  });

  function csv(rows, cols) {
    const head = cols.join(",");
    const body = rows.map((r) => cols.map((c) => '"' + String(r[c] == null ? "" : r[c]).replace(/"/g, '""') + '"').join(",")).join("\n");
    const blob = new Blob([head + "\n" + body], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "isak-export.csv"; a.click();
  }

  // ---------- EVENTS ----------
  renderers.events = renderEvents;
  async function renderEvents() {
    const p = $("panel-events");
    p.innerHTML = '<div class="editor"><h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:14px">Add / edit event</h3>' +
      '<form id="ev-form">' +
      '<input type="hidden" id="ev-id"/>' +
      '<div class="grid2"><div class="adm-field"><label>Title</label><input id="ev-title" required/></div>' +
      '<div class="adm-field"><label>Category</label><select id="ev-cat"><option>Cultural</option><option>Career</option><option>Welcome</option><option>Social</option><option>Language</option><option>Community</option></select></div></div>' +
      '<div class="grid2"><div class="adm-field"><label>Date</label><input id="ev-date" type="date"/></div>' +
      '<div class="adm-field"><label>Time (free text)</label><input id="ev-time" placeholder="19:00 – 23:00"/></div></div>' +
      '<div class="adm-field"><label>Location</label><input id="ev-loc" placeholder="Venue, Koblenz"/></div>' +
      '<div class="adm-field"><label>Summary</label><textarea id="ev-sum" rows="2"></textarea></div>' +
      '<div class="grid2"><div class="adm-field"><label>RSVP link (optional)</label><input id="ev-rsvp"/></div>' +
      '<div class="adm-field"><label>Image</label><input id="ev-img" type="file" accept="image/*"/><input id="ev-imgurl" type="hidden"/></div></div>' +
      '<label class="consent" style="margin:4px 0 12px"><input type="checkbox" id="ev-pub"/> <span>Published (visible on the website)</span></label><br/>' +
      '<button class="btn btn-primary btn-sm" type="submit">Save event</button> ' +
      '<button class="btn btn-ghost btn-sm" type="button" id="ev-reset">Clear</button>' +
      '<div id="ev-msg"></div></form></div>' +
      '<div id="ev-list">Loading…</div>';

    $("ev-reset").addEventListener("click", clearEv);
    $("ev-form").addEventListener("submit", saveEv);
    loadEvents();
  }
  function clearEv() { ["ev-id","ev-title","ev-date","ev-time","ev-loc","ev-sum","ev-rsvp","ev-imgurl"].forEach((i)=>$(i).value=""); $("ev-pub").checked=false; }

  async function loadEvents() {
    const { data, error } = await sb.from("events").select("*").order("date", { ascending: true });
    if (error) return ($("ev-list").innerHTML = '<div class="msg err">' + esc(error.message) + "</div>");
    if (!data.length) { $("ev-list").innerHTML = "<p>No events yet.</p>"; return; }
    $("ev-list").innerHTML = '<table class="data"><tr><th>Date</th><th>Title</th><th>Category</th><th>Status</th><th></th></tr>' +
      data.map((e) =>
        "<tr><td>" + esc(e.date || "—") + "</td><td>" + esc(e.title) + "</td><td>" + esc(e.category || "") + "</td>" +
        '<td><span class="pill ' + (e.published ? "active" : "pending") + '">' + (e.published ? "published" : "draft") + "</span></td>" +
        '<td class="row-actions"><button data-edit="' + e.id + '">Edit</button>' +
        '<button data-pub="' + e.id + '">' + (e.published ? "Unpublish" : "Publish") + "</button>" +
        '<button data-del="' + e.id + '">Delete</button></td></tr>'
      ).join("") + "</table>";
    $("ev-list").querySelectorAll("[data-edit]").forEach((b) => b.onclick = () => editEv(data.find((x) => x.id === b.dataset.edit)));
    $("ev-list").querySelectorAll("[data-pub]").forEach((b) => b.onclick = async () => {
      const ev = data.find((x) => x.id === b.dataset.pub);
      await sb.from("events").update({ published: !ev.published }).eq("id", ev.id); loadEvents();
    });
    $("ev-list").querySelectorAll("[data-del]").forEach((b) => b.onclick = async () => {
      if (!confirm("Delete this event?")) return;
      await sb.from("events").delete().eq("id", b.dataset.del); loadEvents();
    });
  }
  function editEv(e) {
    $("ev-id").value = e.id; $("ev-title").value = e.title || ""; $("ev-cat").value = e.category || "Community";
    $("ev-date").value = e.date || ""; $("ev-time").value = e.time || ""; $("ev-loc").value = e.location || "";
    $("ev-sum").value = e.summary || ""; $("ev-rsvp").value = e.rsvp_url || ""; $("ev-imgurl").value = e.image_url || "";
    $("ev-pub").checked = !!e.published; window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function saveEv(e) {
    e.preventDefault();
    const m = $("ev-msg"); msg(m, "Saving…");
    let imageUrl = $("ev-imgurl").value || null;
    const file = $("ev-img").files[0];
    if (file) {
      const path = "events/" + Date.now() + "-" + file.name.replace(/[^a-z0-9.\-]/gi, "_");
      const { error: upErr } = await sb.storage.from("media").upload(path, file, { upsert: true });
      if (upErr) return msg(m, "Image upload failed: " + upErr.message, "err");
      imageUrl = sb.storage.from("media").getPublicUrl(path).data.publicUrl;
    }
    const row = {
      title: $("ev-title").value.trim(), category: $("ev-cat").value, date: $("ev-date").value || null,
      time: $("ev-time").value || null, location: $("ev-loc").value || null, summary: $("ev-sum").value || null,
      rsvp_url: $("ev-rsvp").value || null, image_url: imageUrl, published: $("ev-pub").checked,
    };
    const id = $("ev-id").value;
    const res = id ? await sb.from("events").update(row).eq("id", id) : await sb.from("events").insert(row);
    if (res.error) return msg(m, res.error.message, "err");
    msg(m, "Saved!", "ok"); clearEv(); loadEvents();
  }

  // ---------- MEMBERS ----------
  renderers.members = async function () {
    const p = $("panel-members");
    const { data, error } = await sb.from("members").select("*").order("created_at", { ascending: false });
    if (error) return (p.innerHTML = '<div class="msg err">' + esc(error.message) + "</div>");
    p.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-family:var(--font-display);font-size:20px">Members (' + data.length + ')</h3><button class="btn btn-ghost btn-sm" id="mem-csv">Export CSV</button></div>' +
      (data.length ? '<table class="data"><tr><th>ID</th><th>Name</th><th>Email</th><th>University</th><th>Status</th><th></th></tr>' +
        data.map((m) =>
          "<tr><td>" + esc(m.member_id || "") + "</td><td>" + esc((m.first_name || "") + " " + (m.last_name || "")) + "</td><td>" + esc(m.email) + "</td><td>" + esc(m.university || m.campus || "—") + "</td>" +
          '<td><span class="pill ' + (m.status === "active" ? "active" : "pending") + '">' + esc(m.status) + "</span></td>" +
          '<td class="row-actions">' + (m.status !== "active" ? '<button data-activate="' + m.id + '">Activate</button>' : '<button data-archive="' + m.id + '">Archive</button>') + "</td></tr>"
        ).join("") + "</table>" : "<p>No members yet.</p>");
    if (data.length) {
      $("mem-csv").onclick = () => csv(data, ["member_id","first_name","last_name","email","program","semester","hometown","university","status","created_at"]);
      p.querySelectorAll("[data-activate]").forEach((b) => b.onclick = async () => { await sb.from("members").update({ status: "active" }).eq("id", b.dataset.activate); renderers.members(); });
      p.querySelectorAll("[data-archive]").forEach((b) => b.onclick = async () => { await sb.from("members").update({ status: "archived" }).eq("id", b.dataset.archive); renderers.members(); });
    }
  };

  // ---------- ROADMAP ----------
  renderers.roadmap = async function () {
    const p = $("panel-roadmap");
    p.innerHTML = '<div class="editor"><h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:14px">Add / edit milestone</h3>' +
      '<form id="rm-form"><input type="hidden" id="rm-id"/>' +
      '<div class="adm-field"><label>Title</label><input id="rm-title" required/></div>' +
      '<div class="adm-field"><label>Description</label><textarea id="rm-desc" rows="2"></textarea></div>' +
      '<div class="grid2"><div class="adm-field"><label>Year</label><input id="rm-year" type="number"/></div>' +
      '<div class="adm-field"><label>Due date</label><input id="rm-due" type="date"/></div></div>' +
      '<div class="grid2"><div class="adm-field"><label>Reminder lead days</label><input id="rm-lead" type="number" value="14"/></div>' +
      '<div class="adm-field"><label>Recipient emails (comma-separated)</label><input id="rm-emails" placeholder="anchalgupta.chp@gmail.com"/></div></div>' +
      '<label class="consent" style="margin:4px 0 12px"><input type="checkbox" id="rm-pub" checked/> <span>Show on public roadmap</span></label><br/>' +
      '<button class="btn btn-primary btn-sm" type="submit">Save milestone</button> <button class="btn btn-ghost btn-sm" type="button" id="rm-reset">Clear</button>' +
      '<div id="rm-msg"></div></form></div><div id="rm-list">Loading…</div>';
    $("rm-reset").onclick = () => { ["rm-id","rm-title","rm-desc","rm-year","rm-due","rm-emails"].forEach((i)=>$(i).value=""); $("rm-lead").value=14; $("rm-pub").checked=true; };
    $("rm-form").onsubmit = async (e) => {
      e.preventDefault();
      const row = {
        title: $("rm-title").value.trim(), description: $("rm-desc").value || null,
        year: $("rm-year").value ? parseInt($("rm-year").value) : null, due_date: $("rm-due").value || null,
        reminder_lead_days: parseInt($("rm-lead").value || "14"),
        recipient_emails: $("rm-emails").value.split(",").map((s) => s.trim()).filter(Boolean),
        is_public: $("rm-pub").checked,
      };
      const id = $("rm-id").value;
      const res = id ? await sb.from("roadmap_milestones").update(row).eq("id", id) : await sb.from("roadmap_milestones").insert(row);
      msg($("rm-msg"), res.error ? res.error.message : "Saved!", res.error ? "err" : "ok");
      if (!res.error) { $("rm-reset").click(); loadRm(); }
    };
    loadRm();
    async function loadRm() {
      const { data, error } = await sb.from("roadmap_milestones").select("*").order("due_date", { ascending: true });
      if (error) return ($("rm-list").innerHTML = '<div class="msg err">' + esc(error.message) + "</div>");
      $("rm-list").innerHTML = '<table class="data"><tr><th>Due</th><th>Title</th><th>Public</th><th>Notified</th><th></th></tr>' +
        data.map((m) =>
          "<tr><td>" + esc(m.due_date || "—") + "</td><td>" + esc(m.title) + "</td><td>" + (m.is_public ? "Yes" : "No") + "</td><td>" + (m.notified_at ? "Sent" : "—") + "</td>" +
          '<td class="row-actions"><button data-edit="' + m.id + '">Edit</button><button data-del="' + m.id + '">Delete</button>' +
          (m.notified_at ? '<button data-reset="' + m.id + '">Reset reminder</button>' : "") + "</td></tr>"
        ).join("") + "</table>";
      $("rm-list").querySelectorAll("[data-edit]").forEach((b) => b.onclick = () => {
        const m = data.find((x) => x.id === b.dataset.edit);
        $("rm-id").value = m.id; $("rm-title").value = m.title || ""; $("rm-desc").value = m.description || "";
        $("rm-year").value = m.year || ""; $("rm-due").value = m.due_date || ""; $("rm-lead").value = m.reminder_lead_days;
        $("rm-emails").value = (m.recipient_emails || []).join(", "); $("rm-pub").checked = m.is_public;
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      $("rm-list").querySelectorAll("[data-del]").forEach((b) => b.onclick = async () => { if (confirm("Delete milestone?")) { await sb.from("roadmap_milestones").delete().eq("id", b.dataset.del); loadRm(); } });
      $("rm-list").querySelectorAll("[data-reset]").forEach((b) => b.onclick = async () => { await sb.from("roadmap_milestones").update({ notified_at: null }).eq("id", b.dataset.reset); loadRm(); });
    }
  };

  // ---------- LEADS ----------
  renderers.leads = async function () {
    const p = $("panel-leads");
    const { data, error } = await sb.from("leads").select("*").order("created_at", { ascending: false });
    if (error) return (p.innerHTML = '<div class="msg err">' + esc(error.message) + "</div>");
    p.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-family:var(--font-display);font-size:20px">India / pre-arrival leads (' + data.length + ')</h3><button class="btn btn-ghost btn-sm" id="lead-csv">Export CSV</button></div>' +
      (data.length ? '<table class="data"><tr><th>Name</th><th>Email</th><th>Intake</th><th>City</th><th>Course</th></tr>' +
        data.map((l) => "<tr><td>" + esc(l.name || "—") + "</td><td>" + esc(l.email) + "</td><td>" + esc(l.target_intake || "—") + "</td><td>" + esc(l.city_in_india || "—") + "</td><td>" + esc(l.course_interest || "—") + "</td></tr>").join("") + "</table>"
        : "<p>No leads yet.</p>");
    if (data.length) $("lead-csv").onclick = () => csv(data, ["name","email","target_intake","city_in_india","course_interest","status","created_at"]);
  };

  // ---------- SUBSCRIBERS ----------
  renderers.subscribers = async function () {
    const p = $("panel-subscribers");
    const { data, error } = await sb.from("subscribers").select("*").order("created_at", { ascending: false });
    if (error) return (p.innerHTML = '<div class="msg err">' + esc(error.message) + "</div>");
    p.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="font-family:var(--font-display);font-size:20px">Subscribers (' + data.length + ')</h3><button class="btn btn-ghost btn-sm" id="sub-csv">Export CSV</button></div>' +
      (data.length ? '<table class="data"><tr><th>Email</th><th>Joined</th></tr>' + data.map((s) => "<tr><td>" + esc(s.email) + "</td><td>" + esc((s.created_at || "").slice(0, 10)) + "</td></tr>").join("") + "</table>" : "<p>No subscribers yet.</p>");
    if (data.length) $("sub-csv").onclick = () => csv(data, ["email","created_at"]);
  };

  // ---------- ADMINS (invite) ----------
  renderers.admins = async function () {
    const p = $("panel-admins");
    const { data } = await sb.from("admins").select("*");
    p.innerHTML = '<div class="editor"><h3 style="font-family:var(--font-display);font-size:20px;margin-bottom:6px">Invite an admin</h3>' +
      '<p style="font-size:13px;color:var(--ink-muted);margin-bottom:14px">They\'ll get an email to set a password, then can sign in here.</p>' +
      '<form id="inv-form"><div class="grid2"><div class="adm-field"><label>Name</label><input id="inv-name"/></div><div class="adm-field"><label>Email</label><input id="inv-email" type="email" required/></div></div>' +
      '<button class="btn btn-primary btn-sm" type="submit">Send invite</button><div id="inv-msg"></div></form></div>' +
      '<table class="data"><tr><th>Name</th><th>Email</th></tr>' + (data || []).map((a) => "<tr><td>" + esc(a.name || "—") + "</td><td>" + esc(a.email) + "</td></tr>").join("") + "</table>";
    $("inv-form").onsubmit = async (e) => {
      e.preventDefault();
      const m = $("inv-msg"); msg(m, "Sending…");
      const { data: { session } } = await sb.auth.getSession();
      const res = await fetch("/api/invite-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + session.access_token },
        body: JSON.stringify({ name: $("inv-name").value.trim(), email: $("inv-email").value.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      msg(m, res.ok ? "Invite sent!" : (body.error || "Failed"), res.ok ? "ok" : "err");
      if (res.ok) renderers.admins();
    };
  };

  // handle password-recovery deep link, then start
  sb.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") { login.style.display = "none"; } });
  init();
})();
