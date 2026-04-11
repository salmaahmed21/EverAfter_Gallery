"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#gallery", label: "Gallery" },
  { href: "#story", label: "Our Story" },
  { href: "#details", label: "Details" },
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

export function NavBar() {
  const [open, setOpen] = useState(false);
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

  const heroBar = overHero && !open;

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        heroBar ? "bg-gradient-to-b from-black/50 via-black/15 to-transparent" : "bg-background/90 backdrop-blur-md dark:bg-stone-950/90"
      }`}
    >
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between px-8 py-6">
        <a
          href="#top"
          className={`font-notoSerif text-2xl tracking-tighter transition-colors ${
            heroBar ? "text-white" : "text-stone-900 dark:text-stone-50"
          }`}
          onClick={() => setOpen(false)}
        >
          Nouran &amp; Ali
        </a>

        <div className="hidden items-center gap-x-12 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`font-notoSerif italic tracking-wide transition-colors duration-300 ${
                heroBar
                  ? "text-white/90 hover:text-white"
                  : "text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#guestbook"
            className={`font-manrope text-xs tracking-widest uppercase transition-opacity hover:opacity-80 ${
              heroBar ? "text-white/90" : "text-stone-700 dark:text-stone-200"
            }`}
          >
            Guestbook
          </a>
          <button
            type="button"
            className={heroBar ? "text-white" : "text-stone-700 dark:text-stone-200"}
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`font-notoSerif text-lg italic ${
                  overHero ? "text-white" : "text-stone-800 dark:text-stone-100"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#guestbook"
              className={`font-manrope text-xs tracking-widest uppercase ${
                overHero ? "text-white/80" : "text-stone-600 dark:text-stone-300"
              }`}
              onClick={() => setOpen(false)}
            >
              Guestbook
            </a>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
