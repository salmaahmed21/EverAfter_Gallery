"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type Step = "date" | "dish" | "calendar";

function isCorrectDate(input: string): boolean {
  const t = input.trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(t)) {
    const [y, m, d] = t.split("-").map((x) => parseInt(x, 10));
    return y === 2025 && m === 5 && d === 15;
  }
  const norm = t.replace(/\./g, "/").replace(/-/g, "/");
  const parts = norm.split("/").map((p) => p.trim()).filter(Boolean);
  if (parts.length !== 3) return false;
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  return d === 15 && m === 5 && y === 2025;
}

function isCorrectDish(input: string): boolean {
  return input.trim().toLowerCase() === "fries";
}

function formatDMY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function useMonthGrid(view: Date) {
  return useMemo(() => {
    const y = view.getFullYear();
    const m = view.getMonth();
    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = last.getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return { cells, label: view.toLocaleString("en-GB", { month: "long", year: "numeric" }) };
  }, [view]);
}

function BookingPrankModal({ date, onClose }: { date: Date; onClose: () => void }) {
  const [pos, setPos] = useState({ leftPct: 6, bottomPct: 10 });
  const [showTaunt, setShowTaunt] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setShowTaunt(true), 12_000);
    return () => window.clearTimeout(t);
  }, []);

  const runAway = useCallback(() => {
    setPos({
      leftPct: 10 + Math.random() * 58,
      bottomPct: 12 + Math.random() * 48,
    });
  }, []);

  const label = formatDMY(date);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onClick={onClose}
    >
      <div
        className="font-manrope relative max-w-md rounded-sm border border-stone-200 bg-background p-6 text-on-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="booking-title" className="text-center text-base leading-snug">
          Book <span className="font-semibold">{label}</span> as the wedding date?
        </h3>
        <div className="relative mt-10 min-h-[160px] w-full">
          <button
            type="button"
            className="absolute z-10 rounded-sm bg-secondary px-4 py-2.5 text-xs font-bold tracking-widest text-on-secondary uppercase shadow-md"
            style={{ left: `${pos.leftPct}%`, bottom: `${pos.bottomPct}%` }}
            onMouseEnter={runAway}
            onFocus={runAway}
          >
            YES!
          </button>
          {showTaunt ? (
            <p className="font-notoSerif absolute right-0 bottom-0 left-0 pt-4 text-center text-base leading-tight font-bold text-error uppercase">
              YOU CAN&apos;T HAVE HER! SHE&apos;S MINE FOREVER!! MUWAHAHAHA
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="font-manrope text-on-surface-variant mt-6 w-full text-center text-xs underline underline-offset-4"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function OmarHabibaPageClient() {
  const [step, setStep] = useState<Step>("date");
  const [dateInput, setDateInput] = useState("");
  const [dishInput, setDishInput] = useState("");
  const [dateErr, setDateErr] = useState("");
  const [dishErr, setDishErr] = useState("");
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [bookingDate, setBookingDate] = useState<Date | null>(null);

  const { cells, label } = useMonthGrid(viewMonth);

  function submitDate(e: React.FormEvent) {
    e.preventDefault();
    setDateErr("");
    if (!isCorrectDate(dateInput)) {
      setDateErr("That's not the right date.");
      return;
    }
    setStep("dish");
  }

  function submitDish(e: React.FormEvent) {
    e.preventDefault();
    setDishErr("");
    if (!isCorrectDish(dishInput)) {
      setDishErr("Not quite…");
      return;
    }
    setStep("calendar");
  }

  function prevMonth() {
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  function nextMonth() {
    setViewMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  function pickDay(day: number) {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();
    setBookingDate(new Date(y, m, day));
  }

  return (
    <div className="min-h-screen bg-background px-6 py-24 pb-32 text-on-background">
      <div className="mx-auto max-w-lg">
        <Link
          href="/#top"
          className="font-manrope text-secondary mb-10 inline-block text-xs tracking-widest uppercase underline decoration-secondary/40 underline-offset-4"
        >
          ← Back to gallery
        </Link>

        {step === "date" ? (
          <form onSubmit={submitDate} className="space-y-6">
            <label className="block">
              <span className="font-notoSerif mb-2 block text-xl italic">Enter THE date:</span>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="font-manrope border-outline-variant/40 focus:border-secondary w-full border-b bg-transparent py-3 text-on-background outline-none"
                placeholder="e.g. 12/02/2004"
                autoComplete="off"
              />
            </label>
            {dateErr ? <p className="font-manrope text-error text-sm">{dateErr}</p> : null}
            <button
              type="submit"
              className="font-manrope bg-primary text-on-primary hover:bg-primary-dim px-8 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Continue
            </button>
          </form>
        ) : null}

        {step === "dish" ? (
          <form onSubmit={submitDish} className="space-y-6">
            <label className="block">
              <span className="font-notoSerif mb-2 block text-xl italic">What is Habiba&apos;s favorite side dish?</span>
              <input
                type="text"
                value={dishInput}
                onChange={(e) => setDishInput(e.target.value)}
                className="font-manrope border-outline-variant/40 focus:border-secondary w-full border-b bg-transparent py-3 text-on-background outline-none"
                placeholder="Your answer"
                autoComplete="off"
              />
            </label>
            {dishErr ? <p className="font-manrope text-error text-sm">{dishErr}</p> : null}
            <button
              type="submit"
              className="font-manrope bg-primary text-on-primary hover:bg-primary-dim px-8 py-3 text-xs font-bold tracking-widest uppercase"
            >
              Continue
            </button>
          </form>
        ) : null}

        {step === "calendar" ? (
          <div className="space-y-6">
            <h1 className="font-notoSerif text-center text-2xl leading-tight italic md:text-3xl">
              Bravo! You know her well. Now you can pick the wedding date :)
            </h1>
            <div className="border-outline-variant/30 mx-auto max-w-md border p-4">
              <div className="mb-4 flex items-center justify-between">
                <button type="button" className="font-manrope text-sm uppercase" onClick={prevMonth} aria-label="Previous month">
                  ←
                </button>
                <span className="font-notoSerif text-lg capitalize">{label}</span>
                <button type="button" className="font-manrope text-sm uppercase" onClick={nextMonth} aria-label="Next month">
                  →
                </button>
              </div>
              <div className="font-manrope mb-2 grid grid-cols-7 gap-1 text-center text-[10px] tracking-widest text-on-surface-variant uppercase">
                {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((day, i) =>
                  day === null ? (
                    <div key={`e-${i}`} className="aspect-square" />
                  ) : (
                    <button
                      key={day}
                      type="button"
                      className="font-manrope hover:bg-secondary-fixed-dim aspect-square rounded-sm text-sm transition-colors"
                      onClick={() => pickDay(day)}
                    >
                      {day}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {bookingDate ? <BookingPrankModal date={bookingDate} onClose={() => setBookingDate(null)} /> : null}
    </div>
  );
}
