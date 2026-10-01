"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string; id?: string };

/** Creates an account owned by the signed-in user (user_id defaults to auth.uid()). */
export async function createAccount(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const startingBalance = Number(formData.get("startingBalance"));
  if (!name) return { error: "Give the account a name." };
  if (name.length > 100) return { error: "Keep the name under 100 characters." };
  if (!Number.isFinite(startingBalance) || startingBalance <= 0) {
    return { error: "Starting balance must be greater than zero." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .insert({ name, starting_balance: startingBalance })
    .select("id")
    .single();
  if (error) return { error: error.message };

  revalidatePath("/");
  return { id: data.id };
}

/** Sets a day's net P&L, or removes it when `pnl` is null. RLS rejects accounts the user doesn't own. */
export async function saveDailyPnl(accountId: string, day: string, pnl: number | null): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { error: "Invalid date." };
  if (pnl !== null && !Number.isFinite(pnl)) return { error: "Enter a number." };

  const supabase = await createClient();
  const { error } =
    pnl === null
      ? await supabase.from("daily_pnl").delete().match({ account_id: accountId, day })
      : await supabase.from("daily_pnl").upsert({ account_id: accountId, day, pnl: Math.round(pnl * 100) / 100 });
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}
