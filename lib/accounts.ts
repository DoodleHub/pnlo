import type { Account } from "./pnl";
import { createClient } from "./supabase/server";

/** The signed-in user's accounts with their daily P&L. RLS limits rows to the current user. */
export async function getAccounts(): Promise<Account[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("id, name, starting_balance, daily_pnl(day, pnl)")
    .order("created_at");

  if (error) throw new Error(`Failed to load accounts: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    startingBalance: Number(row.starting_balance),
    daily: Object.fromEntries(row.daily_pnl.map((d) => [d.day, Number(d.pnl)])),
  }));
}
