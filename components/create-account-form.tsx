"use client";

import { useActionState, useEffect } from "react";
import { createAccount, updateAccount, type ActionResult } from "@/app/actions";
import type { Account } from "@/lib/pnl";

export const inputClass =
  "h-11 w-full rounded-md border border-line bg-sunken px-4 text-body text-fg tabular-nums placeholder:text-fg-faint focus:border-accent focus:outline-none";
export const primaryButton =
  "inline-flex h-11 items-center justify-center rounded-md bg-accent px-5 text-body font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60";
export const secondaryButton =
  "inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface px-5 text-body text-fg transition-colors hover:bg-raised";

type Props = {
  /** When set, the form edits this account instead of creating one. */
  account?: Account;
  onSaved?: (id: string) => void;
  onCancel?: () => void;
};

export function CreateAccountForm({ account, onSaved, onCancel }: Props) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(account ? updateAccount : createAccount, {});

  useEffect(() => {
    if (state.id) onSaved?.(state.id);
  }, [state, onSaved]);

  return (
    <form action={action} className="flex flex-col gap-4">
      {account && <input type="hidden" name="id" value={account.id} />}
      <label className="flex flex-col gap-1.5 text-body text-fg-secondary">
        Account name
        <input
          name="name"
          required
          maxLength={100}
          placeholder="Main account"
          defaultValue={account?.name}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-body text-fg-secondary">
        Starting balance (USD)
        <input
          name="startingBalance"
          type="number"
          required
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="25000"
          defaultValue={account?.startingBalance}
          className={inputClass}
        />
        <span className="text-caption text-fg-muted">Used as the base when showing P&amp;L in percent.</span>
      </label>
      {state.error && (
        <p role="alert" className="text-body text-loss">
          {state.error}
        </p>
      )}
      <div className="mt-1 flex gap-3">
        <button type="submit" disabled={pending} className={primaryButton}>
          {account ? (pending ? "Saving…" : "Save changes") : pending ? "Creating…" : "Create account"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className={secondaryButton}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
