import Link from "next/link";

export const metadata = {
  title: "Ali & Nouran | Ever After Gallery",
  description: "A dedicated space for Ali and Nouran — more to come.",
};

export default function AliNouranPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-8 py-24 text-center">
      <p className="font-manrope text-secondary mb-4 text-xs tracking-[0.35em] uppercase">Ever After</p>
      <h1 className="font-notoSerif text-on-surface mb-6 text-4xl italic md:text-5xl">Ali / Nouran</h1>
      <p className="font-manrope text-on-surface-variant max-w-md text-sm leading-relaxed">
        This page is ready for your story. Share the copy, layout, and photos you want here next.
      </p>
      <Link
        href="/#top"
        className="font-manrope text-secondary mt-12 border-b border-secondary/40 pb-1 text-xs tracking-widest uppercase transition-colors hover:border-secondary"
      >
        Back to gallery
      </Link>
    </main>
  );
}
