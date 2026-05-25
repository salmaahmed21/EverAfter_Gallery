import Image from "next/image";
import { NavBar } from "@/components/NavBar";
import { FavoritesSection } from "@/components/FavoritesSection";
import { GalleryTile } from "@/components/gallery/GalleryTile";
import { GuestbookSection } from "@/components/GuestbookSection";
import {
  getCeremonyItems,
  getEditorialStripItems,
  getGalleryItems,
  getHeroBackground,
  getMoreMemoriesItems,
} from "@/lib/gallery";

export default function HomePage() {
  const items = getGalleryItems();
  const c = getCeremonyItems(items);
  const editorialStrip = getEditorialStripItems(items);
  const m = getMoreMemoriesItems(items, c, editorialStrip);
  const hero = getHeroBackground();

  return (
    <>
      <NavBar />

      <section id="top" className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden />
          <div
            className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 via-black/25 to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28 text-center text-white sm:px-8">
          <p className="font-manrope mb-6 text-[10px] tracking-[0.4em] text-white/95 uppercase sm:text-xs sm:tracking-[0.35em]">
            A love story captured
          </p>
          <h1 className="font-notoSerif max-w-4xl text-5xl leading-[1.05] font-normal italic sm:text-6xl md:text-7xl lg:text-8xl">
            Omar &amp; Habiba
          </h1>
          <div className="mx-auto mt-8 h-px w-14 bg-white/85 sm:w-16" aria-hidden />
          <p className="font-notoSerif mt-8 text-sm tracking-[0.28em] text-white/95 uppercase sm:text-base sm:tracking-[0.25em]">
            March 24, 2026
          </p>
          <div className="mt-14 flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
            <a
              href="#gallery"
              className="font-manrope inline-flex items-center gap-2 border-b border-white/50 pb-1 text-xs font-semibold tracking-[0.3em] text-white/95 uppercase transition-colors hover:border-white hover:text-white"
            >
              Gallery
              <span aria-hidden className="text-lg leading-none">
                ↓
              </span>
            </a>
            <span className="hidden h-10 w-px bg-white/35 sm:block" aria-hidden />
            <a
              href="#guestbook"
              className="font-manrope text-xs tracking-[0.25em] text-white/85 uppercase underline decoration-white/40 underline-offset-8 transition-colors hover:decoration-white hover:text-white"
            >
              Guestbook
            </a>
          </div>
        </div>
      </section>

      <main className="pt-16">
        <header className="mx-auto mb-24 max-w-screen-2xl px-8" id="story">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <span className="font-manrope text-secondary mb-4 block text-xs tracking-[0.3em] uppercase">
                The Engagement Gallery
              </span>
              <h2 className="font-notoSerif text-on-surface editorial-title text-5xl leading-tight md:text-7xl">
                A Symphony of <br />
                <span className="font-normal italic">Light &amp; Love</span>
              </h2>
            </div>
            <div className="max-w-xs">
              <p className="font-manrope text-on-surface-variant border-outline-variant/30 border-l pl-6 text-sm leading-relaxed">
                Collected in an editorial rhythm — big quiet frames, little bursts of joy, and the details you almost
                forget until you see them again.
              </p>
            </div>
          </div>
        </header>

        <section className="mx-auto mb-32 max-w-screen-2xl px-8" id="gallery">
          <div className="mb-12 flex items-center gap-4">
            <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
            <h2 className="font-notoSerif text-on-surface text-2xl italic">Our Day</h2>
            <div className="h-[1px] w-12 bg-outline-variant/20"></div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            {c[0] ? (
              <GalleryTile
                item={c[0]}
                priority
                sizes="(max-width:768px) 100vw, 60vw"
                className="aspect-[4/5] md:col-span-7"
              />
            ) : null}

            <div className="flex flex-col gap-8 md:col-span-5">
              {c[1] ? (
                <GalleryTile
                  item={c[1]}
                  priority={!c[0]}
                  sizes="(max-width:768px) 100vw, 40vw"
                  className="aspect-[3/4]"
                />
              ) : null}
              {c[2] ? (
                <GalleryTile item={c[2]} sizes="(max-width:768px) 100vw, 40vw" className="aspect-square" />
              ) : null}
            </div>

          </div>
        </section>

        <section className="bg-surface-container-low mb-32 overflow-hidden py-32" id="editorial">
          <div className="mx-auto max-w-screen-2xl px-8">
            <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-12">
              <div className="order-2 md:order-1 md:col-span-4">
                <span className="font-manrope text-secondary mb-4 block text-xs tracking-[0.3em] uppercase">
                  Quiet Luxury
                </span>
                <h2 className="font-notoSerif text-on-surface mb-6 text-4xl leading-tight">
                  The Art of the <br />
                  <span className="font-normal italic">Little Things</span>
                </h2>
               
                <a
                  href="#more-memories"
                  className="group text-secondary flex items-center gap-4 text-xs font-semibold tracking-widest uppercase"
                >
                  See more moments
                  <span className="bg-secondary h-[1px] w-8 transition-all duration-300 group-hover:w-16"></span>
                </a>
              </div>

              <div className="order-1 flex gap-4 overflow-x-auto pb-8 no-scrollbar md:order-2 md:col-span-8 md:gap-8">
                {editorialStrip.map((item, idx) => (
                  <GalleryTile
                    key={`${item.src}-${idx}`}
                    item={item}
                    sizes="400px"
                    className={`min-w-[300px] shrink-0 aspect-[4/5] md:min-w-[400px] ${idx === 1 ? "mt-12" : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {m.length > 0 ? (
          <section className="mx-auto mb-32 max-w-screen-2xl px-8" id="more-memories" aria-label="More photos">
            <div className="mb-12 flex items-center gap-4">
              <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
              <h2 className="font-notoSerif text-on-surface text-2xl italic">More Memories</h2>
              <div className="h-[1px] w-12 bg-outline-variant/20"></div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {m.map((item, idx) => (
                <GalleryTile
                  key={`${item.src}-${idx}`}
                  item={item}
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="aspect-[3/4]"
                />
              ))}
            </div>
          </section>
        ) : null}

        <FavoritesSection allItems={items} />

        <GuestbookSection />
      </main>

      <footer className="bg-stone-50 dark:bg-stone-950 static w-full">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-8 px-12 py-16 md:flex-row">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="font-notoSerif text-lg text-stone-700 dark:text-stone-300">Omar &amp; Habiba</span>
            <p className="font-manrope text-stone-500 text-xs tracking-widest uppercase">Ever After Gallery</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            <a
              className="font-manrope text-stone-500 hover:text-yellow-600 text-xs tracking-widest uppercase transition-colors duration-300"
              href="#top"
            >
              Top
            </a>
            <a
              className="font-manrope text-stone-500 hover:text-yellow-600 text-xs tracking-widest uppercase transition-colors duration-300"
              href="#gallery"
            >
              Gallery
            </a>
            <a
              className="font-manrope text-stone-500 hover:text-yellow-600 text-xs tracking-widest uppercase transition-colors duration-300"
              href="#guestbook"
            >
              Guestbook
            </a>
            <a
              className="font-manrope text-stone-500 hover:text-yellow-600 text-xs tracking-widest uppercase transition-colors duration-300"
              href="#favorites"
            >
              Favorites
            </a>
          </div>
          <div className="flex gap-4">
            <a
              href="#top"
              className="border-stone-200 hover:bg-stone-100 inline-flex border p-3 transition-colors duration-300 dark:border-stone-800 dark:hover:bg-stone-900"
              aria-label="Back to top"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-stone-600 dark:text-stone-300 size-5"
                aria-hidden
              >
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
