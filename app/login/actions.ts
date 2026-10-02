"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Public origin the confirmation email should return to. Supabase silently swaps in its
 * Site URL (localhost) when the redirect is malformed or not allow-listed, so prefer
 * an explicit NEXT_PUBLIC_SITE_URL, then the request's Origin, then the forwarded host.
 */
async function siteOrigin(): Promise<string> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/+$/, "");

  const h = await headers();
  const origin = h.get("origin");
  if (origin && origin !== "null") return origin;

  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export type LoginMode = "signin" | "signup";
export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

const MIN_PASSWORD_LENGTH = 8;

/** Signs in with email and password, or creates the user when mode is "signup". */
export async function authenticate(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const mode: LoginMode = formData.get("mode") === "signup" ? "signup" : "signin";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email) return { status: "error", message: "Enter your email address." };
  if (!password) return { status: "error", message: "Enter your password." };

  const supabase = await createClient();

  if (mode === "signin") {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { status: "error", message: error.message };
    redirect("/");
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { status: "error", message: `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.` };
  }

  const origin = await siteOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });
  if (error) return { status: "error", message: error.message };

  // No session means the project requires email confirmation first.
  if (!data.session) return { status: "sent", message: `Check ${email} to confirm your account.` };
  redirect("/");
}
