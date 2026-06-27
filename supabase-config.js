/* ISAK Supabase client config (browser).
 *
 * Both values below are PUBLIC and safe to commit — the anon key only grants
 * the row-level-security access defined in supabase/schema.sql (public reads).
 * The powerful SERVICE ROLE key is NEVER here; it lives only in Vercel env vars
 * and is used by the /api functions.
 *
 * SETUP: after creating your Supabase project, paste your Project URL and the
 * anon/public key here (Dashboard → Project Settings → API).
 */
window.ISAK_SUPABASE_URL = "https://uvsbfnwumjvpylgpdcll.supabase.co";
window.ISAK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2c2Jmbnd1bWp2cHlsZ3BkY2xsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTE5NjMsImV4cCI6MjA5ODEyNzk2M30.peGG3SjbFTT3tQ3--0JLPGT6wMVjmFnNFL9ieOOH6O8";

// Returns a configured Supabase client, or null if the SDK / config is missing.
window.isakSupabase = function () {
  if (!window.supabase || !window.ISAK_SUPABASE_URL || window.ISAK_SUPABASE_URL.includes("YOUR-PROJECT")) {
    return null;
  }
  if (!window.__isakClient) {
    window.__isakClient = window.supabase.createClient(
      window.ISAK_SUPABASE_URL,
      window.ISAK_SUPABASE_ANON_KEY
    );
  }
  return window.__isakClient;
};
