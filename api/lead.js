// POST /api/lead — pre-arrival / India outreach lead capture
// Saves the lead, emails them the pre-arrival guide link, notifies founders.
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
    if (b.company) return res.status(200).json({ ok: true }); // honeypot
    const email = (b.email || "").trim();
    if (!isEmail(email)) return res.status(400).json({ error: "A valid email is required." });

    const row = {
      name: (b.name || "").trim() || null,
      email,
      target_intake: (b.target_intake || b.intake || "").trim() || null,
      city_in_india: (b.city_in_india || b.city || "").trim() || null,
      course_interest: (b.course_interest || b.course || "").trim() || null,
      status: "new",
    };

    const db = supabaseAdmin();
    const { error } = await db.from("leads").insert(row);
    if (error) console.error("lead insert error", error);

    try {
      const r = resend();
      // Guide email to the student
      await r.emails.send({
        from: FROM,
        to: email,
        subject: "Your Germany pre-arrival starter — from ISAK Koblenz",
        html: emailShell(`Namaste${row.name ? ", " + esc(row.name) : ""}! 🇮🇳→🇩🇪`, `
          <p style="line-height:1.7">Thinking about studying in Germany? You're in the right place. ISAK is a student-run community in Koblenz, and we help students like you <em>before</em> you even land.</p>
          <p style="line-height:1.7"><strong>Quick starter checklist:</strong></p>
          <ul style="line-height:1.8">
            <li>Blocked account (Sperrkonto) &amp; proof of funds</li>
            <li>Student visa appointment &amp; documents</li>
            <li>Health insurance and your first Anmeldung</li>
            <li>Finding a room (and avoiding scams)</li>
          </ul>
          <p style="line-height:1.7">The fastest way to get real answers is to talk to students who just did it:</p>
          <p style="text-align:center">${button(WHATSAPP_URL, "Join our WhatsApp community")}</p>
          <p style="line-height:1.7">Want a 1:1? You can <a href="https://calendar.app.google/KZhLXSKXbqGw9Rvt8" style="color:#E85D04">book a free chat with our founder</a>. We've got you.</p>
          <p style="line-height:1.7">— Team ISAK Koblenz</p>
        `),
      });
      // Notify founders
      await r.emails.send({
        from: FROM,
        to: founderEmails(),
        subject: `New India lead: ${esc(row.name || email)}`,
        html: emailShell("New pre-arrival lead", `
          <p style="line-height:1.7">
            <strong>${esc(row.name || "—")}</strong> (${esc(email)})<br/>
            Intake: ${esc(row.target_intake || "—")}<br/>
            City in India: ${esc(row.city_in_india || "—")}<br/>
            Course interest: ${esc(row.course_interest || "—")}
          </p>`),
      });
    } catch (mailErr) {
      console.error("lead email error", mailErr);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("lead handler error", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
