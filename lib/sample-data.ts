import type { Account } from "./pnl";

/*
 * Sample data until accounts are connected to a real source.
 * "Main account" reproduces the September 2026 figures from the design mock.
 */

/** The date the sample data treats as today (the highlighted cell in the mock). */
export const SAMPLE_TODAY = new Date(2026, 8, 24);

export const ACCOUNTS: Account[] = [
  {
    id: "main",
    name: "Main account",
    startingBalance: 25000,
    daily: {
      "2026-09-01": 320,
      "2026-09-02": -210,
      "2026-09-03": 540,
      "2026-09-04": 275,
      "2026-09-07": 190,
      "2026-09-08": -340,
      "2026-09-09": 615,
      "2026-09-10": 320,
      "2026-09-11": -175,
      "2026-09-14": 880,
      "2026-09-15": -260,
      "2026-09-16": 410,
      "2026-09-17": -95,
      "2026-09-18": 723,
      "2026-09-21": -310,
      "2026-09-22": 295,
      "2026-09-23": -180,
      "2026-09-24": 485,
      "2026-09-25": 210,
      "2026-09-28": 370,
      "2026-09-29": -125,
      "2026-09-30": 450,
    },
  },
  {
    id: "swing",
    name: "Swing account",
    startingBalance: 10000,
    daily: {
      "2026-09-02": 140,
      "2026-09-09": -85,
      "2026-09-16": 260,
      "2026-09-23": -120,
      "2026-09-30": 95,
    },
  },
];
