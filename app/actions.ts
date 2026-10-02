"use server";

import { revalidatePath } from "next/cache";
import { marketClosureForKey } from "@/lib/market";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error?: string; id?: string };

type AccountFields = { name: string; starting_balance: number };

function parseAccountForm(formData: FormData): AccountFields | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const startingBalance = Number(formData.get("startingBalance"));
  if (!name) return { error: "Give the account a name." };
  if (name.length > 100) return { error: "Keep the name under 100 characters." };
  if (!Number.isFinite(startingBalance) || startingBalance <= 0) {
    return { error: "Starting balance must be greater than zero." };
  }
  return { name, starting_balance: Math.round(startingBalance * 100) / 100 };
}

/** Creates an account owned by the signed-in user (user_id defaults to auth.uid()). */
export async function createAccount(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const fields = parseAccountForm(formData);
  if ("error" in fields) return fields;

  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts").insert(fields).select("id").single();
  if (error) return { error: error.message };

  revalidatePath("/");
  return { id: data.id };
}

/** Renames an account or changes its starting balance. RLS rejects accounts the user doesn't own. */
export async function updateAccount(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "");
  const fields = parseAccountForm(formData);
  if ("error" in fields) return fields;

  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts").update(fields).eq("id", id).select("id");
  if (error) return { error: error.message };
  if (data.length === 0) return { error: "Account not found." };

  revalidatePath("/");
  return { id };
}

/** Deletes an account; its daily P&L rows go with it (FK cascade). */
export async function deleteAccount(id: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("accounts").delete().eq("id", id).select("id");
  if (error) return { error: error.message };
  if (data.length === 0) return { error: "Account not found." };

  revalidatePath("/");
  return {};
}

/** Sets a day's net P&L, or removes it when `pnl` is null. RLS rejects accounts the user doesn't own. */
export async function saveDailyPnl(accountId: string, day: string, pnl: number | null): Promise<ActionResult> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return { error: "Invalid date." };
  if (pnl !== null && !Number.isFinite(pnl)) return { error: "Enter a number." };
  if (pnl !== null && marketClosureForKey(day) !== null) return { error: "The US market is closed that day." };

  const supabase = await createClient();
  const { error } =
    pnl === null
      ? await supabase.from("daily_pnl").delete().match({ account_id: accountId, day })
      : await supabase.from("daily_pnl").upsert({ account_id: accountId, day, pnl: Math.round(pnl * 100) / 100 });
  if (error) return { error: error.message };

  revalidatePath("/");
  return {};
}
