/**
 * Copies guestbook_messages from the legacy Supabase project (Nouran & Ali)
 * into the new Omar & Habiba project.
 *
 * Prerequisites:
 * 1. Create a new Supabase project and run supabase/schema.sql in its SQL editor.
 * 2. Set LEGACY_* and active NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env
 * 3. Run: npm run db:migrate
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnvFiles } from "./load-env.mjs";

loadEnvFiles();

const legacyUrl = process.env.LEGACY_SUPABASE_URL;
const legacyKey = process.env.LEGACY_SUPABASE_SERVICE_ROLE_KEY;
const newUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const newKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function requireEnv(name, value) {
  if (!value?.trim()) {
    console.error(`[db:migrate] Missing ${name}. See .env.example`);
    process.exit(1);
  }
  return value.trim();
}

const legacy = createClient(requireEnv("LEGACY_SUPABASE_URL", legacyUrl), requireEnv("LEGACY_SUPABASE_SERVICE_ROLE_KEY", legacyKey), {
  auth: { persistSession: false, autoRefreshToken: false },
});

const target = createClient(requireEnv("NEXT_PUBLIC_SUPABASE_URL", newUrl), requireEnv("SUPABASE_SERVICE_ROLE_KEY", newKey), {
  auth: { persistSession: false, autoRefreshToken: false },
});

const PAGE = 500;

async function fetchAll() {
  const rows = [];
  let from = 0;
  while (true) {
    const { data, error } = await legacy
      .from("guestbook_messages")
      .select("id, author, body, created_at")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) throw new Error(`Legacy read failed: ${error.message}`);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return rows;
}

async function main() {
  console.log("[db:migrate] Reading guestbook from legacy Supabase…");
  const rows = await fetchAll();
  console.log(`[db:migrate] Found ${rows.length} message(s).`);

  if (rows.length === 0) {
    console.log("[db:migrate] Nothing to copy.");
    return;
  }

  const BATCH = 50;
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk = rows.slice(i, i + BATCH);
    const { data, error } = await target
      .from("guestbook_messages")
      .upsert(chunk, { onConflict: "id", ignoreDuplicates: false })
      .select("id");

    if (error) {
      throw new Error(`Target write failed: ${error.message}`);
    }
    inserted += data?.length ?? 0;
    skipped += chunk.length - (data?.length ?? 0);
  }

  console.log(`[db:migrate] Done. Upserted ${inserted} row(s)${skipped ? ` (${skipped} unchanged)` : ""}.`);
  console.log("[db:migrate] Update Vercel env vars to the new Supabase URL and service role key.");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
