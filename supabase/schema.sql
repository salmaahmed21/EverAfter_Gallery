-- Omar & Habiba guestbook (run in a NEW Supabase project SQL editor)

create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null,
  body text not null
);

alter table public.guestbook_messages enable row level security;

-- API uses the service role key server-side only (bypasses RLS for reads/writes).
