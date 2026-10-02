"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/actions";
import { formatMoney, type Account } from "@/lib/pnl";
import { CreateAccountForm, secondaryButton } from "./create-account-form";
import { Pencil, Spinner, Trash } from "./icons";

type Props = {
  accounts: Account[];
  onDone: () => void;
};

const iconButton =
  "grid size-9 shrink-0 place-items-center rounded-md text-fg-secondary transition-colors hover:bg-raised hover:text-fg";

/** Body of the "Manage accounts" dialog: list accounts, edit one inline, or delete with confirmation. */
export function ManageAccounts({ accounts, onDone }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const editing = accounts.find((a) => a.id === editingId);
  if (editing) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-body text-fg-secondary">
          Editing <span className="font-semibold text-fg">{editing.name}</span>
        </p>
        <CreateAccountForm
          key={editing.id}
          account={editing}
          onSaved={() => setEditingId(null)}
          onCancel={() => setEditingId(null)}
        />
      </div>
    );
  }

  const confirmDelete = (id: string) =>
    startTransition(async () => {
      const result = await deleteAccount(id);
      if (result.error) setError(result.error);
      else setDeletingId(null);
    });

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-line rounded-md border border-line">
        {accounts.map((a) =>
          a.id === deletingId ? (
            <li key={a.id} className="flex flex-col gap-3 bg-sunken px-4 py-3">
              <p className="text-body text-fg">
                Delete <span className="font-semibold">{a.name}</span> and all of its P&amp;L entries? This can’t be
                undone.
              </p>
              {error && (
                <p role="alert" className="text-body text-loss">
                  {error}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => confirmDelete(a.id)}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-loss px-4 text-body font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {pending && <Spinner className="size-4" />}
                  {pending ? "Deleting…" : "Delete"}
                </button>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setDeletingId(null)}
                  className="inline-flex h-9 items-center justify-center rounded-md border border-line bg-surface px-4 text-body text-fg transition-colors hover:bg-raised"
                >
                  Cancel
                </button>
              </div>
            </li>
          ) : (
            <li key={a.id} className="flex items-center gap-2 py-2 pr-2 pl-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-body text-fg">{a.name}</p>
                <p className="text-caption text-fg-muted tabular-nums">Starting balance {formatMoney(a.startingBalance)}</p>
              </div>
              <button type="button" aria-label={`Edit ${a.name}`} onClick={() => setEditingId(a.id)} className={iconButton}>
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                aria-label={`Delete ${a.name}`}
                onClick={() => {
                  setError(null);
                  setDeletingId(a.id);
                }}
                className={`${iconButton} hover:text-loss`}
              >
                <Trash className="size-4" />
              </button>
            </li>
          ),
        )}
      </ul>
      <button type="button" onClick={onDone} className={`${secondaryButton} self-start`}>
        Done
      </button>
    </div>
  );
}
