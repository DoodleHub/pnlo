"use client";

import { useState, useTransition } from "react";
import { saveDailyPnl } from "@/app/actions";
import type { CalendarDay } from "@/lib/pnl";
import { inputClass, primaryButton, secondaryButton } from "./create-account-form";
import { Spinner } from "./icons";
import { Modal } from "./modal";

const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

type Props = {
  accountId: string;
  accountName: string;
  day: CalendarDay;
  onClose: () => void;
};

export function DayEditor({ accountId, accountName, day, onClose }: Props) {
  const [value, setValue] = useState(day.pnl === null ? "" : String(day.pnl));
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();
  // Which button started the pending save, so only that one shows a spinner.
  const [clearing, setClearing] = useState(false);

  const save = (pnl: number | null, clear = false) =>
    startTransition(async () => {
      setClearing(clear);
      const result = await saveDailyPnl(accountId, day.key, pnl);
      if (result.error) setError(result.error);
      else onClose();
    });

  return (
    <Modal title={dayLabel.format(day.date)} description={accountName} onClose={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save(value.trim() === "" ? null : Number(value));
        }}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5 text-body text-fg-secondary">
          P&amp;L (USD)
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 320 or -175.50"
            className={inputClass}
          />
          <span className="text-caption text-fg-muted">Use a minus sign for a loss. Leave empty for no activity.</span>
        </label>
        {error && (
          <p role="alert" className="text-body text-loss">
            {error}
          </p>
        )}
        <div className="mt-1 flex flex-wrap gap-3">
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending && !clearing && <Spinner className="size-4" />}
            {pending && !clearing ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={onClose} disabled={pending} className={secondaryButton}>
            Cancel
          </button>
          {day.pnl !== null && (
            <button
              type="button"
              disabled={pending}
              onClick={() => save(null, true)}
              className="ml-auto inline-flex items-center gap-1.5 text-body text-loss hover:underline disabled:opacity-60"
            >
              {pending && clearing && <Spinner className="size-4" />}
              {pending && clearing ? "Clearing…" : "Clear day"}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
