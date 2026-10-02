import { toKey } from "./pnl";

/**
 * US stock market (NYSE/Nasdaq) full-day closures. Holidays are computed from NYSE rules, so no
 * yearly table needs maintaining; only unscheduled closures are listed by hand.
 */

/** One-off closures: national days of mourning, weather, etc. */
const SPECIAL_CLOSURES: Record<string, string> = {
  "2001-09-11": "Market closed (Sept. 11)",
  "2001-09-12": "Market closed (Sept. 11)",
  "2001-09-13": "Market closed (Sept. 11)",
  "2001-09-14": "Market closed (Sept. 11)",
  "2004-06-11": "Day of mourning (Reagan)",
  "2007-01-02": "Day of mourning (Ford)",
  "2012-10-29": "Hurricane Sandy",
  "2012-10-30": "Hurricane Sandy",
  "2018-12-05": "Day of mourning (G.H.W. Bush)",
  "2025-01-09": "Day of mourning (Carter)",
};

/** The nth (1-based) weekday of a month; n = -1 gives the last one. */
function nthWeekday(year: number, month: number, weekday: number, n: number): Date {
  if (n < 0) {
    const last = new Date(year, month + 1, 0);
    return new Date(year, month, last.getDate() - ((last.getDay() - weekday + 7) % 7));
  }
  const first = new Date(year, month, 1);
  return new Date(year, month, 1 + ((weekday - first.getDay() + 7) % 7) + (n - 1) * 7);
}

/** Western Easter Sunday (anonymous Gregorian algorithm). */
function easter(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

/** Fixed-date holiday moved to Friday when on Saturday, Monday when on Sunday. */
function observed(year: number, month: number, day: number): Date {
  const date = new Date(year, month, day);
  const shift = date.getDay() === 6 ? -1 : date.getDay() === 0 ? 1 : 0;
  return new Date(year, month, day + shift);
}

const holidayCache = new Map<number, Map<string, string>>();

/** Exchange holidays observed in a calendar year, keyed by YYYY-MM-DD. */
function holidays(year: number): Map<string, string> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const list: [Date, string][] = [
    [nthWeekday(year, 0, 1, 3), "Martin Luther King Jr. Day"],
    [nthWeekday(year, 1, 1, 3), "Presidents' Day"],
    [new Date(year, easter(year).getMonth(), easter(year).getDate() - 2), "Good Friday"],
    [nthWeekday(year, 4, 1, -1), "Memorial Day"],
    [observed(year, 6, 4), "Independence Day"],
    [nthWeekday(year, 8, 1, 1), "Labor Day"],
    [nthWeekday(year, 10, 4, 4), "Thanksgiving"],
    [observed(year, 11, 25), "Christmas"],
  ];
  // NYSE doesn't observe New Year's on the prior Friday when Jan 1 is a Saturday.
  if (new Date(year, 0, 1).getDay() !== 6) list.push([observed(year, 0, 1), "New Year's Day"]);
  if (year >= 2022) list.push([observed(year, 5, 19), "Juneteenth"]);

  const map = new Map(list.map(([date, name]) => [toKey(date), name]));
  holidayCache.set(year, map);
  return map;
}

/** Why the market is closed on this date ("Weekend" or the holiday name), or null when it's open. */
export function marketClosure(date: Date): string | null {
  const weekday = date.getDay();
  if (weekday === 0 || weekday === 6) return "Weekend";
  const key = toKey(date);
  return holidays(date.getFullYear()).get(key) ?? SPECIAL_CLOSURES[key] ?? null;
}

/** marketClosure for a YYYY-MM-DD key, parsed in local time. */
export function marketClosureForKey(key: string): string | null {
  const [y, m, d] = key.split("-").map(Number);
  return marketClosure(new Date(y, m - 1, d));
}
