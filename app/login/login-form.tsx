"use client";

import { useActionState } from "react";
import { sendMagicLink, type LoginState } from "./actions";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    sendMagicLink,
    initialError ? { status: "error", message: initialError } : { status: "idle" },
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <label htmlFor="email" className="text-body text-fg-secondary">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        className="h-11 rounded-md border border-line bg-surface px-4 text-body text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 rounded-md bg-accent text-body font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
      {state.message && (
        <p role="status" className={`text-body ${state.status === "error" ? "text-loss" : "text-profit"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
