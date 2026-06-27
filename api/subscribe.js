// POST /api/subscribe — newsletter signup
import { supabaseAdmin, setCors, readJson, isEmail } from "./_lib.js";

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const b = await readJson(req);
    if (b.company) return res.status(200).json({ ok: true }); // honeypot
    const email = (b.email || "").trim();
    if (!isEmail(email)) return res.status(400).json({ error: "A valid email is required." });

    const db = supabaseAdmin();
    const { error } = await db.from("subscribers").insert({ email });
    if (error && !/duplicate|unique/i.test(error.message)) {
      console.error("subscribe error", error);
      return res.status(500).json({ error: "Could not subscribe. Please try again." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("subscribe handler error", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
