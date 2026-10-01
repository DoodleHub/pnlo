import { formatPnl, tone, type MonthStats, type Unit } from "@/lib/pnl";

type Props = { stats: MonthStats; unit: Unit; base: number };

const toneClass = { profit: "text-profit", loss: "text-loss", flat: "text-accent-soft" };

export function StatStrip({ stats, unit, base }: Props) {
  const money = (v: number | null) => (v === null ? "—" : formatPnl(v, unit, base));
  const items = [
    { label: "Monthly P&L", value: money(stats.total), tone: tone(stats.total) },
    { label: "Best day", value: money(stats.best), tone: tone(stats.best) },
    { label: "Worst day", value: money(stats.worst), tone: tone(stats.worst) },
    { label: "Green days", value: `${stats.greenDays} / ${stats.tradingDays}`, tone: "flat" as const },
  ];

  return (
    <section
      aria-label="Month summary"
      className="grid grid-cols-2 gap-y-6 rounded-lg border border-line-strong bg-surface py-6 min-[900px]:grid-cols-4"
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={`grid gap-1 px-5 sm:px-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${
            i === 2 ? "min-[900px]:border-l min-[900px]:border-line" : ""
          }`}
        >
          <span className="text-body text-fg-secondary">{item.label}</span>
          <span className={`text-[22px] leading-7 font-bold tabular-nums sm:text-figure-lg ${toneClass[item.tone]}`}>
            {item.value}
          </span>
        </div>
      ))}
    </section>
  );
}
