"use client";

import { useCallback, useMemo, useState } from "react";
import { buildMonth, formatMoney, formatPnl, monthStats, tone, totalPnl, type Account, type CalendarDay, type Unit } from "@/lib/pnl";
import { AppHeader } from "./app-header";
import { CalendarPanel } from "./calendar-panel";
import { CreateAccountForm } from "./create-account-form";
import { DayEditor } from "./day-editor";
import { ManageAccounts } from "./manage-accounts";
import { Modal } from "./modal";
import { StatStrip } from "./stat-strip";

type Props = {
  accounts: Account[];
  today: Date;
  userEmail: string;
  userInitial: string;
};

const changeTone = { profit: "text-profit", loss: "text-loss", flat: "text-fg-muted" };

export function PnlDashboard({ accounts, today, userEmail, userInitial }: Props) {
  const [accountId, setAccountId] = useState(accounts[0].id);
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [unit, setUnit] = useState<Unit>("usd");
  const [editingDay, setEditingDay] = useState<CalendarDay | null>(null);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [managingAccounts, setManagingAccounts] = useState(false);

  const account = accounts.find((a) => a.id === accountId) ?? accounts[0];
  const weeks = useMemo(() => buildMonth(view.year, view.month, account.daily), [view, account]);
  const stats = useMemo(() => monthStats(weeks), [weeks]);
  const allTime = useMemo(() => totalPnl(account), [account]);

  const onAccountCreated = useCallback((id: string) => {
    setAccountId(id);
    setCreatingAccount(false);
  }, []);

  const shift = (delta: number) =>
    setView(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col px-4 pt-4 pb-10 sm:px-8 sm:pt-[18px]">
      <AppHeader
        accounts={accounts}
        accountId={account.id}
        onAccountChange={setAccountId}
        onCreateAccount={() => setCreatingAccount(true)}
        onManageAccounts={() => setManagingAccounts(true)}
        userEmail={userEmail}
        userInitial={userInitial}
      />

      <div className="mt-7 mb-3.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mt-8">
        <div>
          <h1 className="text-[40px] leading-[44px] font-bold tracking-[-0.02em] text-balance sm:text-display-page">
            Profit &amp; loss
          </h1>
          <p className="mt-1 text-body text-fg-secondary sm:text-body-lg">Your performance, one day at a time.</p>
        </div>
        <dl className="grid sm:text-right">
          <dt className="text-caption text-fg-muted">Current balance</dt>
          <dd className="text-figure-md font-bold tabular-nums">
            {formatMoney(account.startingBalance + allTime)}
            <span className={`ml-2 text-body font-semibold ${changeTone[tone(allTime)]}`}>
              {formatPnl(allTime, unit, account.startingBalance)}
            </span>
          </dd>
        </dl>
      </div>

      <div className="flex flex-col gap-4">
        <StatStrip stats={stats} unit={unit} base={account.startingBalance} />
        <CalendarPanel
          year={view.year}
          month={view.month}
          weeks={weeks}
          today={today}
          unit={unit}
          base={account.startingBalance}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={() => setView({ year: today.getFullYear(), month: today.getMonth() })}
          onUnitChange={setUnit}
          onSelectDay={setEditingDay}
        />
      </div>

      {editingDay && (
        <DayEditor
          key={`${account.id}:${editingDay.key}`}
          accountId={account.id}
          accountName={account.name}
          day={editingDay}
          onClose={() => setEditingDay(null)}
        />
      )}
      {creatingAccount && (
        <Modal title="New account" onClose={() => setCreatingAccount(false)}>
          <CreateAccountForm onSaved={onAccountCreated} onCancel={() => setCreatingAccount(false)} />
        </Modal>
      )}
      {managingAccounts && (
        <Modal title="Manage accounts" onClose={() => setManagingAccounts(false)}>
          <ManageAccounts accounts={accounts} onDone={() => setManagingAccounts(false)} />
        </Modal>
      )}
    </div>
  );
}
