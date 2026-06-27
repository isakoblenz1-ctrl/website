// GET /api/cron-roadmap — runs daily via Vercel Cron (see vercel.json).
// Emails recipients for any milestone whose reminder window has arrived and
// hasn't been sent yet, then stamps notified_at so it never sends twice.
//
// Protected: Vercel Cron sends a Bearer token (CRON_SECRET) automatically when
// the env var is set. Manual runs must pass ?key=CRON_SECRET or the header.
import { supabaseAdmin, resend, FROM, esc, emailShell } from "./_lib.js";

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // allow if not configured (e.g. first test)
  const auth = req.headers["authorization"] || "";
  const url = new URL(req.url, "http://x");
  return auth === `Bearer ${secret}` || url.searchParams.get("key") === secret;
}

export default async function handler(req, res) {
  if (!authorized(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    const db = supabaseAdmin();
    const today = new Date();

    const { data: milestones, error } = await db
      .from("roadmap_milestones")
      .select("*")
      .is("notified_at", null)
      .not("due_date", "is", null);
    if (error) throw error;

    const due = (milestones || []).filter((m) => {
      if (!m.recipient_emails || m.recipient_emails.length === 0) return false;
      const dueDate = new Date(m.due_date + "T00:00:00");
      const remindFrom = new Date(dueDate);
      remindFrom.setDate(remindFrom.getDate() - (m.reminder_lead_days ?? 14));
      return today >= remindFrom;
    });

    let sent = 0;
    const r = resend();
    for (const m of due) {
      try {
        await r.emails.send({
          from: FROM,
          to: m.recipient_emails,
          subject: `⏰ ISAK roadmap reminder: ${m.title}`,
          html: emailShell(`Time to act: ${esc(m.title)}`, `
            <p style="line-height:1.7">${esc(m.description || "")}</p>
            <p style="line-height:1.7"><strong>Target date:</strong> ${esc(m.due_date)}</p>
            <p style="line-height:1.7;color:#6B6B7A;font-size:13px">This is an automated reminder from the ISAK roadmap. You can edit milestones in the admin panel.</p>
          `),
        });
        await db.from("roadmap_milestones").update({ notified_at: new Date().toISOString() }).eq("id", m.id);
        sent++;
      } catch (e) {
        console.error("milestone email failed", m.id, e);
      }
    }

    return res.status(200).json({ ok: true, checked: milestones?.length || 0, sent });
  } catch (e) {
    console.error("cron-roadmap error", e);
    return res.status(500).json({ error: "Cron failed" });
  }
}
