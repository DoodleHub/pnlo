import Link from "next/link";
import type { Account } from "@/lib/pnl";
import { AccountSelect } from "./account-select";
import { LogoMark } from "./icons";

type Props = {
  accounts: Account[];
  accountId: string;
  onAccountChange: (id: string) => void;
  userInitial: string;
};

export function AppHeader({ accounts, accountId, onAccountChange, userInitial }: Props) {
  return (
    <header className="flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 text-[26px] font-semibold tracking-[-0.01em] text-fg">
        <LogoMark className="size-7" />
        pnlo
      </Link>
      <div className="flex items-center gap-4">
        <AccountSelect accounts={accounts} value={accountId} onChange={onAccountChange} />
        <span
          aria-label={`Signed in as ${userInitial}`}
          className="grid size-11 shrink-0 place-items-center rounded-full bg-accent-surface text-base font-semibold text-fg"
        >
          {userInitial}
        </span>
      </div>
    </header>
  );
}
