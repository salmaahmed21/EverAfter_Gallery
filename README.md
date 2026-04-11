# Ever After Gallery — Nouran & Ali

A single long-scroll engagement gallery built with [Next.js](https://nextjs.org/). The page includes a full-viewport landing hero, editorial gallery sections, and a guestbook.

## Add your photos (easiest workflow)

1. Copy your engagement images into `public/gallery/` (JPG, PNG, WebP, AVIF, or GIF).
2. Run:

```bash
npm run gallery:manifest
```

This writes `src/data/gallery-manifest.json` with every file in sorted order (names like `001.jpg`, `002.jpg` keep the story sequence tidy).

3. On **Vercel**, the `prebuild` script runs the same generator automatically, so new files in `public/gallery/` are picked up on each deployment.

If the folder is empty, the site shows tasteful placeholder images so the layout still looks complete.

**Hero image (top of the page):** If `public/gallery/0.jpg` exists, it is always used as the full-screen landing background. Otherwise the app looks for `public/hero.{jpg,jpeg,webp,png}`, then falls back to the first gallery photo.

**Download all:** Right-click the desktop nav links (Gallery, Guestbook, …) or tap **Options** on mobile to open the side menu, then choose **Download all images** — a zip named **A+N.zip** is built from everything in `public/gallery/`.

**Favorites:** Hearts are stored in the visitor’s browser only (localStorage).

## Guestbook (optional but recommended)

Without Supabase, the guestbook list stays empty and submitting a note will show an error until you add the environment variables below.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

```sql
create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  author text not null,
  body text not null
);

alter table public.guestbook_messages enable row level security;
```

3. The API uses the **service role** key server-side only (bypasses RLS for inserts). Do **not** expose the service role key in client code.
4. Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Redeploy; new guestbook posts will persist.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## Free deployment (step by step)

These steps use **GitHub** (free) + **Vercel** (free hobby tier), which fits this Next.js app well.

1. **Create a GitHub repository** (if you do not have one yet): on [github.com](https://github.com), click **New repository**, name it (for example `EverAfter_Gallery`), leave it empty or with a README, then create it.

2. **Push your code from your computer** (in your project folder, in a terminal):

   ```bash
   git init
   git add .
   git commit -m "Initial Ever After gallery site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` and `YOUR_REPO` with yours. Do **not** commit `.env` or `.env.local` (they are gitignored); secrets belong only on Vercel.

3. **Sign up for Vercel** at [vercel.com](https://vercel.com) (you can use **Continue with GitHub**).

4. **Import the project**: Vercel dashboard → **Add New…** → **Project** → select your GitHub repo → **Import**.

5. **Framework**: Vercel should detect **Next.js** automatically. Leave defaults and click **Deploy**. The first build may take a few minutes.

6. **Environment variables (guestbook)**: After the first deploy, open the project → **Settings** → **Environment Variables**. Add:

   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL  
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase **service_role** secret (never the publishable/anon key)

   Apply to **Production** (and **Preview** if you want previews to work too), then **Redeploy** (Deployments → … on latest → Redeploy).

7. **Custom domain (optional)**: **Settings** → **Domains** → add your domain and follow DNS instructions.

Your live URL will look like `https://your-project.vercel.app`. Every `git push` to `main` triggers a new deployment automatically.
