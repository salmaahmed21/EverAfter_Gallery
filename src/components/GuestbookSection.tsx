"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  author: string;
  body: string;
  created_at: string;
};

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function GuestbookSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitNote, setSubmitNote] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/guestbook", { cache: "no-store" });
        const data = (await res.json()) as {
          messages?: Message[];
          error?: string;
        };
        if (!res.ok) throw new Error(data.error || "Could not load messages.");
        if (cancelled) return;
        setMessages(data.messages ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load messages.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitNote(null);
    setError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ author, message }),
      });
      const data = (await res.json()) as { message?: Message; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not post your message.");
      if (data.message) {
        setMessages((prev) => [data.message as Message, ...prev]);
        setAuthor("");
        setMessage("");
        setSubmitNote("Thank you — your note is live.");
      }
    } catch (err) {
      setSubmitNote(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto mb-48 max-w-screen-2xl px-8" id="guestbook">
      <div className="mb-20 flex items-center gap-4">
        <div className="h-[1px] flex-grow bg-outline-variant/20"></div>
        <h2 className="font-notoSerif text-on-surface text-2xl italic">Guestbook</h2>
        <div className="h-[1px] w-12 bg-outline-variant/20"></div>
      </div>

      <div className="grid grid-cols-1 gap-24 lg:grid-cols-2">
        <div>
          <span className="font-manrope text-secondary mb-4 block text-xs tracking-[0.3em] uppercase">Leave a Message</span>
          <h3 className="font-notoSerif text-on-surface mb-10 text-4xl">
            Kind Words for <br />
            <span className="font-normal italic">Nouran &amp; Ali</span>
          </h3>

          <form className="space-y-8" onSubmit={onSubmit}>
            <div className="group">
              <label
                className="font-manrope text-on-surface-variant group-focus-within:text-secondary mb-2 block text-[10px] tracking-widest uppercase transition-colors"
                htmlFor="fullname"
              >
                Full Name
              </label>
              <input
                className="font-manrope text-on-surface placeholder:text-outline-variant/50 w-full border-0 border-b border-outline-variant/30 bg-transparent px-0 py-4 transition-colors focus:border-secondary focus:ring-0"
                id="fullname"
                placeholder="Your name"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="group">
              <label
                className="font-manrope text-on-surface-variant group-focus-within:text-secondary mb-2 block text-[10px] tracking-widest uppercase transition-colors"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="font-manrope text-on-surface placeholder:text-outline-variant/50 h-32 w-full resize-none border-0 border-b border-outline-variant/30 bg-transparent px-0 py-4 transition-colors focus:border-secondary focus:ring-0"
                id="message"
                placeholder="Your warm wishes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <button
              className="font-manrope text-primary hover:bg-primary hover:text-on-primary mt-8 border border-primary px-12 py-5 text-xs font-bold tracking-widest uppercase transition-all duration-500 disabled:opacity-50"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Posting..." : "Post Message"}
            </button>
            {submitNote ? <p className="font-manrope text-on-surface-variant text-sm">{submitNote}</p> : null}
          </form>
        </div>

        <div className="space-y-16">
          {loading ? (
            <p className="font-manrope text-on-surface-variant text-sm">Loading messages…</p>
          ) : null}
          {error ? <p className="font-manrope text-error text-sm">{error}</p> : null}
          {!loading && !error && messages.length === 0 ? (
            <p className="font-manrope text-on-surface-variant text-sm">No messages yet — be the first.</p>
          ) : null}

          {messages.map((m, idx) => (
            <div
              key={m.id}
              className={`border-outline-variant/20 relative border-l pl-8 ${idx === messages.length - 1 ? "opacity-60" : ""}`}
            >
              <div className="bg-secondary-fixed-dim absolute top-0 -left-[5px] h-[9px] w-[9px] rounded-full"></div>
              <span className="font-notoSerif text-on-surface mb-2 block text-lg italic">{m.author}</span>
              <p className="font-manrope text-on-surface-variant text-sm leading-relaxed">{m.body}</p>
              <span className="font-manrope text-outline-variant mt-4 block text-[10px] tracking-[0.2em] uppercase">
                {formatDate(m.created_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
