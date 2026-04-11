"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const primaryLinks = [
  { href: "#gallery", label: "Gallery" },
  { href: "#guestbook", label: "Guestbook" },
  { href: "#favorites", label: "Favorites" },
] as const;

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

async function downloadAllZip() {
  const res = await fetch("/api/gallery/zip");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(typeof err === "object" && err && "error" in err ? String((err as { error: string }).error) : "Could not create zip.");
  }
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "A+N.zip";
  a.click();
  URL.revokeObjectURL(a.href);
}

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;

    const update = () => {
      const rect = hero.getBoundingClientRect();
      setOverHero(rect.bottom > 88);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const heroBar = overHero && !open && !extrasOpen;

  function openExtras() {
    setExtrasOpen(true);
    setOpen(false);
  }

  async function onDownloadAll() {
    setZipping(true);
    try {
      await downloadAllZip();
      setExtrasOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Download failed.");
    } finally {
      setZipping(false);
    }
  }

  const linkClass = (onHero: boolean) =>
    onHero
      ? "font-notoSerif text-white/90 italic tracking-wide transition-colors hover:text-white"
      : "font-notoSerif text-stone-600 italic tracking-wide transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100";

  const sansLink = (onHero: boolean) =>
    onHero
      ? "font-manrope text-xs tracking-widest text-white/90 uppercase transition-opacity hover:opacity-80"
      : "font-manrope text-xs tracking-widest text-stone-700 uppercase transition-opacity hover:opacity-80 dark:text-stone-200";

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
          heroBar ? "bg-gradient-to-b from-black/50 via-black/15 to-transparent" : "bg-background/90 backdrop-blur-md dark:bg-stone-950/90"
        }`}
      >
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-6 py-6 sm:px-8">
          <a
            href="#top"
            className={`font-notoSerif shrink-0 text-2xl tracking-tighter transition-colors ${
              heroBar ? "text-white" : "text-stone-900 dark:text-stone-50"
            }`}
            onClick={() => setOpen(false)}
          >
            Nouran &amp; Ali
          </a>

          <div
            className="hidden flex-1 justify-center gap-x-10 md:flex"
            onContextMenu={(e) => {
              e.preventDefault();
              openExtras();
            }}
          >
            {primaryLinks.map((l) => (
              <a key={l.href} href={l.href} className={linkClass(heroBar)}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              className={`font-manrope rounded border px-3 py-1.5 text-[10px] tracking-widest uppercase md:hidden ${
                heroBar
                  ? "border-white/40 text-white hover:bg-white/10"
                  : "border-stone-300 text-stone-700 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-200 dark:hover:bg-stone-800"
              }`}
              onClick={openExtras}
            >
              Options
            </button>
            <button
              type="button"
              className={heroBar ? "text-white md:hidden" : "text-stone-700 md:hidden dark:text-stone-200"}
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <MenuIcon className="size-6 cursor-pointer" />
            </button>
          </div>
        </div>

        {open ? (
          <div
            className={`border-t px-8 py-6 md:hidden ${
              overHero
                ? "border-white/20 bg-black/85 text-white backdrop-blur-md"
                : "border-stone-200/60 bg-background/95 dark:border-stone-800 dark:bg-stone-950/95"
            }`}
          >
            <div className="flex flex-col gap-4">
              {primaryLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={`font-notoSerif text-lg italic ${overHero ? "text-white" : "text-stone-800 dark:text-stone-100"}`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <hr className={overHero ? "border-white/20" : "border-stone-200 dark:border-stone-700"} />
              <button
                type="button"
                className={sansLink(overHero)}
                disabled={zipping}
                onClick={async () => {
                  await onDownloadAll();
                  setOpen(false);
                }}
              >
                {zipping ? "Preparing…" : "Download all images (A+N.zip)"}
              </button>
              <Link
                href="/ali-nouran"
                className={sansLink(overHero)}
                onClick={() => setOpen(false)}
              >
                Ali / Nouran only
              </Link>
            </div>
          </div>
        ) : null}
      </nav>

      {extrasOpen ? (
        <div className="fixed inset-0 z-[70] md:z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close menu"
            onClick={() => setExtrasOpen(false)}
          />
          <aside className="absolute top-0 right-0 flex h-full w-[min(100%,19rem)] flex-col gap-6 bg-stone-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-notoSerif text-lg italic">Menu</span>
              <button
                type="button"
                className="font-manrope text-2xl leading-none text-white/70 hover:text-white"
                aria-label="Close"
                onClick={() => setExtrasOpen(false)}
              >
                ×
              </button>
            </div>
           
            <button
              type="button"
              disabled={zipping}
              className="font-manrope border border-white/25 bg-white/5 px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-white/10 disabled:opacity-50"
              onClick={onDownloadAll}
            >
              {zipping ? "Preparing zip…" : "Download all images"}
            </button>
            
            <Link
              href="/ali-nouran"
              className="font-manrope border border-white/25 px-4 py-3 text-center text-xs font-semibold tracking-widest uppercase transition-colors hover:bg-white/10"
              onClick={() => setExtrasOpen(false)}
            >
              Ali / Nouran only
            </Link>
          </aside>
        </div>
      ) : null}
    </>
  );
}
