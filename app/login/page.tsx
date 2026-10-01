import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/icons";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in · pnlo" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/");

  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-16">
      <div className="mb-8 flex items-center gap-2 text-[26px] font-semibold tracking-[-0.01em] text-fg">
        <LogoMark className="size-7" />
        pnlo
      </div>
      <h1 className="text-[32px] leading-[38px] font-bold tracking-[-0.02em]">Sign in</h1>
      <p className="mt-1 mb-6 text-body text-fg-secondary">We&apos;ll email you a link. No password needed.</p>
      <LoginForm initialError={error ? "That sign-in link is invalid or expired. Request a new one." : undefined} />
    </main>
  );
}
