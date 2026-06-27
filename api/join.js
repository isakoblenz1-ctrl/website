// POST /api/join — membership application
// Stores the member, emails the founders, and sends the applicant a welcome
// email with the WhatsApp invite + their member ID.

import {
  supabaseAdmin, resend, FROM, founderEmails, WHATSAPP_URL,
  setCors, readJson, isEmail, esc, emailShell, button,
} from "./_lib.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const b = await readJson(req);

    // Honeypot: real users leave this empty
    if (b.company) return res.status(200).json({ ok: true });

    const first_name = (b.fname || b.first_name || "").trim();
    const email = (b.email || "").trim();
    if (!first_name) return res.status(400).json({ error: "First name is required." });
    if (!isEmail(email)) return res.status(400).json({ error: "A valid email is required." });
    if (b.consent !== true && b.consent !== "true" && b.consent !== "on")
      return res.status(400).json({ error: "Please accept the privacy notice." });

    const row = {
      first_name,
      last_name: (b.lname || b.last_name || "").trim() || null,
      email,
      program: (b.program || "").trim() || null,
      semester: (b.semester || "").trim() || null,
      hometown: (b.hometown || "").trim() || null,
      campus: (b.campus || "").trim() || null,
      university: (b.university || "").trim() || null,
      interests: (b.interests || "").trim() || null,
      status: "pending",
      source: "website",
    };

    let db;
    try {
      db = supabaseAdmin();
    } catch (cfgErr) {
      console.error("supabase config error", cfgErr);
      return res.status(500).json({ error: "Server not configured: missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in Vercel env vars." });
    }

    const { data, error } = await db.from("members").insert(row).select("member_id").single();

    // Duplicate email → treat as success (idempotent, friendly)
    let memberId = data?.member_id;
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error("members insert error", error);
      return res.status(500).json({ error: "Database error: " + (error.message || "could not save application") });
    }

    // Send emails (don't fail the request if email hiccups)
    try {
      const r = resend();
      const fullName = `${row.first_name}${row.last_name ? " " + row.last_name : ""}`;

      // 1) Applicant welcome
      await r.emails.send({
        from: FROM,
        to: email,
        subject: "Welcome to ISAK Koblenz 🎉",
        html: emailShell(`Welcome, ${esc(row.first_name)}!`, `
          <p style="line-height:1.7">You're officially part of <strong>ISAK</strong> — the Indian Students Association Koblenz. We're so glad you're here.</p>
          <p style="line-height:1.7">Your first step: join our WhatsApp community. That's where everything happens — questions, events, help, and friends.</p>
          <p style="text-align:center">${button(WHATSAPP_URL, "Join the WhatsApp group")}</p>
          ${memberId ? `<p style="line-height:1.7">Your member ID: <strong>${esc(memberId)}</strong></p>` : ""}
          <p style="line-height:1.7">A real person from ISAK will also reach out personally within 48 hours. In the meantime, if you'd like to talk to our founder directly, you can <a href="https://calendar.app.google/KZhLXSKXbqGw9Rvt8" style="color:#E85D04">book a quick chat here</a>.</p>
          <p style="line-height:1.7">See you soon,<br/>— The ISAK team</p>
        `),
      });

      // 2) Founder/admin notification
      await r.emails.send({
        from: FROM,
        to: founderEmails(),
        subject: `New ISAK member: ${fullName}`,
        html: emailShell("New membership application", `
          <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6">
            <tr><td style="color:#6B6B7A;padding:4px 0">Name</td><td>${esc(fullName)}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Email</td><td>${esc(email)}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Member ID</td><td>${esc(memberId || "—")}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Program</td><td>${esc(row.program || "—")}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Semester</td><td>${esc(row.semester || "—")}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Hometown</td><td>${esc(row.hometown || "—")}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0">Campus</td><td>${esc(row.campus || "—")}</td></tr>
            <tr><td style="color:#6B6B7A;padding:4px 0;vertical-align:top">Looking for</td><td>${esc(row.interests || "—")}</td></tr>
          </table>
        `),
      });
    } catch (mailErr) {
      console.error("email send error", mailErr);
    }

    return res.status(200).json({ ok: true, member_id: memberId || null });
  } catch (e) {
    console.error("join handler error", e);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
