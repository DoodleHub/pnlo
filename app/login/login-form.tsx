"use client";

import { useActionState, useState } from "react";
import { authenticate, type LoginMode, type LoginState } from "./actions";

const inputClass =
  "h-11 rounded-md border border-line bg-surface px-4 text-body text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [mode, setMode] = useState<LoginMode>("signin");
  const [state, action, pending] = useActionState<LoginState, FormData>(
    authenticate,
    initialError ? { status: "error", message: initialError } : { status: "idle" },
  );
  const signup = mode === "signup";

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="mode" value={mode} />
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
        className={inputClass}
      />
      <label htmlFor="password" className="text-body text-fg-secondary">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        minLength={signup ? 8 : undefined}
        autoComplete={signup ? "new-password" : "current-password"}
        className={inputClass}
      />
      <button
        type="submit"
        disabled={pending}
        className="mt-1 h-11 rounded-md bg-accent text-body font-semibold text-canvas transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (signup ? "Creating account…" : "Signing in…") : signup ? "Create account" : "Sign in"}
      </button>
      {state.message && (
        <p role="status" className={`text-body ${state.status === "error" ? "text-loss" : "text-profit"}`}>
          {state.message}
        </p>
      )}
      <p className="mt-2 text-body text-fg-secondary">
        {signup ? "Already have an account?" : "New to pnlo?"}{" "}
        <button
          type="button"
          onClick={() => setMode(signup ? "signin" : "signup")}
          className="font-semibold text-accent-soft hover:underline"
        >
          {signup ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}
