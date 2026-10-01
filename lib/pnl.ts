export type Unit = "usd" | "pct";

export type Account = {
  id: string;
  name: string;
  /** Balance used as the base for percent mode. */
  startingBalance: number;
  /** Net P&L after fees, keyed by ISO date (YYYY-MM-DD). */
  daily: Record<string, number>;
};

export type CalendarDay = {
  date: Date;
  key: string;
  inMonth: boolean;
  pnl: number | null;
};

export type MonthStats = {
  total: number;
  best: number | null;
  worst: number | null;
  greenDays: number;
  tradingDays: number;
};

export function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return toKey(a) === toKey(b);
}

/** Weeks (Monday first) covering the month, each with seven days. */
export function buildMonth(year: number, month: number, daily: Record<string, number>): CalendarDay[][] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday = 0
  const start = new Date(year, month, 1 - offset);
  const last = new Date(year, month + 1, 0);
  const weekCount = Math.ceil((offset + last.getDate()) / 7);

  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < weekCount; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + w * 7 + d);
      const key = toKey(date);
      const inMonth = date.getMonth() === month;
      week.push({ date, key, inMonth, pnl: inMonth ? (daily[key] ?? null) : null });
    }
    weeks.push(week);
  }
  return weeks;
}

/** Sum of the week's in-month days, or null when nothing traded. */
export function weekTotal(week: CalendarDay[]): number | null {
  const traded = week.filter((d) => d.pnl !== null);
  return traded.length ? traded.reduce((sum, d) => sum + (d.pnl ?? 0), 0) : null;
}

export function monthStats(weeks: CalendarDay[][]): MonthStats {
  const days = weeks.flat().filter((d) => d.inMonth);
  const traded = days.filter((d) => d.pnl !== null).map((d) => d.pnl as number);
  const weekdays = days.filter((d) => d.date.getDay() !== 0 && d.date.getDay() !== 6);
  return {
    total: traded.reduce((a, b) => a + b, 0),
    best: traded.length ? Math.max(...traded) : null,
    worst: traded.length ? Math.min(...traded) : null,
    greenDays: traded.filter((v) => v > 0).length,
    tradingDays: weekdays.length,
  };
}

const usd = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Signed money or percent: +$4,373.00, -$340.00, +1.84%, $0.00. */
export function formatPnl(value: number, unit: Unit, base: number): string {
  const amount = unit === "usd" ? value : (value / base) * 100;
  const rounded = Math.round(amount * 100) / 100;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  const body = usd.format(Math.abs(rounded));
  return unit === "usd" ? `${sign}$${body}` : `${sign}${body}%`;
}

export function tone(value: number | null): "profit" | "loss" | "flat" {
  if (value === null || value === 0) return "flat";
  return value > 0 ? "profit" : "loss";
}
