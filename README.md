# Ever After Gallery — Omar & Habiba

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

**Hero image (top of the page):** When you run `npm run gallery:manifest` (or on Vercel at build time), the manifest records the hero: `public/gallery/DSC05200.jpg` if present, else `public/hero.{jpg,jpeg,webp,png}`, else the first gallery file. No runtime filesystem checks — that keeps the server bundle small on Vercel.

**Download all:** Right-click the desktop nav links (Gallery, Guestbook, …) or tap **Options** on mobile to open the side menu, then choose **Download all images**. The browser fetches each file listed in the gallery manifest and builds **O+H.zip** locally (this avoids Vercel’s serverless size limit; very large galleries may take a while or need a powerful device).

**Favorites:** Hearts are stored in the visitor’s browser only (localStorage).

## Guestbook (optional but recommended)

The app uses a **new** Supabase project for Omar & Habiba. The old Nouran & Ali project is only referenced as `LEGACY_*` when you copy existing messages.

Without the new Supabase env vars, the guestbook list stays empty and submitting a note will show an error.

1. Create a **new** free project at [supabase.com](https://supabase.com) (do not reuse the old gallery project).
2. In the SQL editor, run the contents of [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env` (or `.env.local`) and set:
   - `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — **new** project (app uses these)
   - `LEGACY_SUPABASE_URL` and `LEGACY_SUPABASE_SERVICE_ROLE_KEY` — old project (migration only)
4. Copy guestbook messages from the old database:

```bash
npm run db:migrate
```

5. Redeploy on Vercel with the **new** URL and service role key (not `LEGACY_*`).

The API uses the **service role** key server-side only. Do **not** expose the service role key in client code.

**Note:** Favorites (hearts) are stored in the browser only (localStorage), not in Supabase. Only guestbook messages use the database.

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

6. **Environment variables (guestbook)**: After the first deploy, open the project → **Settings** → **Environment Variables**. Add the **new** Omar & Habiba Supabase project only:

   - `NEXT_PUBLIC_SUPABASE_URL` = new project URL  
   - `SUPABASE_SERVICE_ROLE_KEY` = new project **service_role** secret (never the publishable/anon key)

   Do not add `LEGACY_*` to Vercel (migration runs locally once). Apply to **Production** (and **Preview** if you want previews to work too), then **Redeploy**.

7. **Custom domain (optional)**: **Settings** → **Domains** → add your domain and follow DNS instructions.

Your live URL will look like `https://your-project.vercel.app`. Every `git push` to `main` triggers a new deployment automatically.
