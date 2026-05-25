import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Omar & Habiba Supabase project (not LEGACY_* — see scripts/migrate-guestbook-db.mjs). */
export function getServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
