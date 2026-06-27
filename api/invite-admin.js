// POST /api/invite-admin — invite a new admin (existing admins only)
// Body: { email, name }. Caller must send their Supabase access token:
//   Authorization: Bearer <access_token>
// We verify the caller is already an admin, then invite the new user by email
// (Supabase sends a set-password link) and add them to the admins table.
import { supabaseAdmin, setCors, readJson, isEmail } from "./_lib.js";

export default async function handler(req, res) {
  setCors(res);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({ error: "Sign in required." });

    const db = supabaseAdmin();

    // Who is calling?
    const { data: userData, error: userErr } = await db.auth.getUser(token);
    if (userErr || !userData?.user) return res.status(401).json({ error: "Invalid session." });

    // Are they an admin?
    const { data: adminRow } = await db.from("admins").select("id").eq("id", userData.user.id).maybeSingle();
    if (!adminRow) return res.status(403).json({ error: "Admins only." });

    const b = await readJson(req);
    const email = (b.email || "").trim();
    const name = (b.name || "").trim() || null;
    if (!isEmail(email)) return res.status(400).json({ error: "A valid email is required." });

    const redirectTo = (process.env.SITE_URL || "") + "/admin.html";
    const { data: invited, error: inviteErr } =
      await db.auth.admin.inviteUserByEmail(email, redirectTo ? { redirectTo } : undefined);
    if (inviteErr && !/already.*registered|exists/i.test(inviteErr.message)) {
      console.error("invite error", inviteErr);
      return res.status(500).json({ error: inviteErr.message });
    }

    // Resolve the user id (invited now, or already existing)
    let newId = invited?.user?.id;
    if (!newId) {
      const { data: list } = await db.auth.admin.listUsers();
      newId = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
    }
    if (newId) {
      await db.from("admins").upsert({ id: newId, email, name });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("invite-admin error", e);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
