// Real form handlers for ISAK (membership, newsletter, India lead capture).
// POSTs to the Vercel /api functions. Progressive enhancement: if JS fails the
// forms still submit normally to their action URL.
(function () {
  function postJSON(url, data) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (r) => {
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(body.error || "Something went wrong.");
      return body;
    });
  }

  function formData(form) {
    const out = {};
    new FormData(form).forEach((v, k) => { out[k] = v; });
    out.consent = !!form.querySelector('[name="consent"]')?.checked || out.consent === "on";
    return out;
  }

  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status" + (kind ? " " + kind : "");
  }

  // ---- Membership form ----
  const join = document.getElementById("join-form");
  if (join) {
    const status = document.getElementById("join-status");
    join.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = join.querySelector('button[type="submit"]');
      const data = formData(join);
      if (!data.fname || !data.fname.trim()) return setStatus(status, "Please enter your first name.", "err");
      if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return setStatus(status, "Please enter a valid email.", "err");
      if (!data.consent) return setStatus(status, "Please accept the privacy notice to continue.", "err");

      const original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setStatus(status, "", "");

      postJSON("/api/join", data)
        .then(function () {
          join.innerHTML =
            '<div class="form-success">' +
            '<h3>🎉 You\'re in!</h3>' +
            '<p>Check your inbox for your welcome email and member ID. Your first step is to join the WhatsApp community:</p>' +
            '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://chat.whatsapp.com/LVNXqJU9LokG6B6aPOQeTa?mode=gi_t">Join the WhatsApp group</a>' +
            '</div>';
        })
        .catch(function (err) {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
          setStatus(status, err.message || "Could not submit. Please try again or email us.", "err");
        });
    });
  }

  // ---- India / pre-arrival lead form ----
  const lead = document.getElementById("lead-form");
  if (lead) {
    const status = document.getElementById("lead-status");
    lead.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = lead.querySelector('button[type="submit"]');
      const data = formData(lead);
      if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return setStatus(status, "Please enter a valid email.", "err");
      const original = btn ? btn.innerHTML : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setStatus(status, "", "");
      postJSON("/api/lead", data)
        .then(function () {
          lead.innerHTML =
            '<div class="form-success"><h3>Sent! 📩</h3><p>Check your email for your Germany starter guide — and feel free to join our WhatsApp community right away.</p>' +
            '<a class="btn btn-primary" target="_blank" rel="noopener" href="https://chat.whatsapp.com/LVNXqJU9LokG6B6aPOQeTa?mode=gi_t">Join WhatsApp</a></div>';
        })
        .catch(function (err) {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
          setStatus(status, err.message || "Could not submit. Please try again.", "err");
        });
    });
  }

  // ---- Newsletter (footer, multiple) ----
  document.querySelectorAll("form.newsletter").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = form.querySelector("button");
      const inp = form.querySelector('input[type="email"], input');
      const email = inp ? inp.value : "";
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (inp) inp.focus();
        return;
      }
      if (btn) { btn.disabled = true; btn.textContent = "…"; }
      postJSON("/api/subscribe", { email: email })
        .then(function () {
          if (btn) btn.textContent = "✓ Subscribed";
          if (inp) inp.disabled = true;
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = "Try again"; }
        });
    });
  });
})();
