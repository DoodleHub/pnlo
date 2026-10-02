"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Public origin the email link should return to. Supabase silently swaps in its
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

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

/** Emails a magic link that signs the user in (creating the account on first use). */
export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter your email address." };

  const origin = await siteOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/confirm` },
  });

  if (error) return { status: "error", message: error.message };
  return { status: "sent", message: `Check ${email} for a sign-in link.` };
}
