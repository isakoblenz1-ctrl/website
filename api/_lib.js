// Shared helpers for ISAK serverless functions (Vercel, Node ESM).
// Files starting with "_" are not exposed as routes by Vercel.

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// --- Supabase admin client (service role — server only, bypasses RLS) ---
export function supabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

// --- Resend ---
export function resend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY missing");
  return new Resend(key);
}

// From address — set EMAIL_FROM in Vercel once your domain is verified in Resend
// (e.g. "ISAK Koblenz <hello@isak-koblenz.de>"). Falls back to Resend's sandbox.
export const FROM = process.env.EMAIL_FROM || "ISAK Koblenz <onboarding@resend.dev>";

export function founderEmails() {
  return (process.env.FOUNDER_EMAILS || "anchalgupta.chp@gmail.com")
    .split(",").map((s) => s.trim()).filter(Boolean);
}

export const WHATSAPP_URL =
  process.env.WHATSAPP_INVITE_URL ||
  "https://chat.whatsapp.com/LVNXqJU9LokG6B6aPOQeTa?mode=gi_t";

// --- Request helpers ---
export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;
  return await new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => { try { resolve(JSON.parse(data || "{}")); } catch { resolve({}); } });
  });
}

export function isEmail(v) {
  return typeof v === "string" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim());
}

export function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- Branded email wrapper ---
export function emailShell(title, innerHtml) {
  return `<!doctype html><html><body style="margin:0;background:#FFFCF5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#14141C">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px">
      <div style="text-align:center;margin-bottom:24px">
        <span style="display:inline-block;font-size:22px;font-weight:700;letter-spacing:1px;color:#E85D04">ISAK</span>
        <span style="display:block;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6B6B7A">Koblenz</span>
      </div>
      <div style="background:#fff;border:1px solid #eee;border-radius:16px;padding:32px">
        <h1 style="font-size:22px;margin:0 0 16px;color:#14141C">${title}</h1>
        ${innerHtml}
      </div>
      <p style="text-align:center;font-size:12px;color:#9a9aa5;margin-top:24px">
        Indian Students Association Koblenz · For Indian students at Hochschule &amp; Universität Koblenz
      </p>
    </div></body></html>`;
}

export function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:#E85D04;color:#fff;text-decoration:none;padding:13px 24px;border-radius:999px;font-weight:600;margin:8px 0">${label}</a>`;
}
