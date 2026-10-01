import { formatPnl, isSameDay, tone, weekTotal, type CalendarDay, type Unit } from "@/lib/pnl";
import { ChevronLeft, ChevronRight } from "./icons";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthLabel = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" });

type Props = {
  year: number;
  month: number;
  weeks: CalendarDay[][];
  today: Date;
  unit: Unit;
  base: number;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onUnitChange: (unit: Unit) => void;
};

const btn =
  "inline-flex h-11 items-center justify-center rounded-md border border-line bg-surface text-body text-fg transition-colors hover:bg-raised";

export function CalendarPanel({ year, month, weeks, today, unit, base, onPrev, onNext, onToday, onUnitChange }: Props) {
  return (
    <section aria-label="Calendar" className="rounded-lg border border-line-strong bg-surface p-3 sm:p-4">
      <div className="mb-4 flex flex-wrap items-center gap-2 px-1 sm:px-3">
        <h2 className="mr-auto text-[24px] leading-8 font-bold tracking-[-0.01em] sm:mr-6 sm:text-display-month">
          {monthLabel.format(new Date(year, month, 1))}
        </h2>
        <div className="flex items-center gap-2">
          <button type="button" aria-label="Previous month" onClick={onPrev} className={`${btn} w-[54px]`}>
            <ChevronLeft />
          </button>
          <button type="button" aria-label="Next month" onClick={onNext} className={`${btn} ml-2 w-[54px]`}>
            <ChevronRight />
          </button>
          <button type="button" onClick={onToday} className={`${btn} ml-2 px-6`}>
            Today
          </button>
        </div>
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>

      <div className="overflow-x-auto">
        <div
          role="grid"
          aria-label="Daily profit and loss"
          className="grid min-w-[640px] grid-cols-[repeat(7,minmax(0,1fr))_minmax(0,1.05fr)] gap-px overflow-hidden rounded-sm border border-line bg-line"
        >
          <div role="row" className="contents">
            {[...WEEKDAYS, "Week total"].map((d) => (
              <div
                key={d}
                role="columnheader"
                className="bg-surface pt-2 pb-2.5 text-center text-label font-medium text-fg-secondary"
              >
                {d}
              </div>
            ))}
          </div>
          {weeks.map((week) => (
            <div role="row" key={week[0].key} className="contents">
              {week.map((day) => (
                <DayCell key={day.key} day={day} isToday={isSameDay(day.date, today)} unit={unit} base={base} />
              ))}
              <WeekTotal value={weekTotal(week)} unit={unit} base={base} />
            </div>
          ))}
        </div>
      </div>

      <Legend />
    </section>
  );
}

const cellFill = { profit: "bg-profit-cell", loss: "bg-loss-cell", flat: "bg-cell" };
const figure = { profit: "text-profit", loss: "text-loss", flat: "text-fg-secondary" };

function DayCell({ day, isToday, unit, base }: { day: CalendarDay; isToday: boolean; unit: Unit; base: number }) {
  const t = tone(day.pnl);
  return (
    <div
      role="gridcell"
      aria-current={isToday ? "date" : undefined}
      className={`relative grid min-h-[72px] grid-rows-[auto_1fr] px-2 sm:min-h-[84px] sm:px-3 pt-2 pb-3 ${cellFill[t]} ${
        isToday ? "z-[1] rounded-sm shadow-[inset_0_0_0_2px_var(--accent)]" : ""
      }`}
    >
      <span className={`text-label font-medium tabular-nums ${day.inMonth ? "text-fg" : "text-fg-secondary"}`}>
        {day.date.getDate()}
      </span>
      {day.pnl === null ? (
        <span aria-label="No activity" className="place-self-center text-figure-md text-fg-faint">
          —
        </span>
      ) : (
        <span className={`place-self-center text-[15px] leading-5 font-bold tabular-nums sm:text-figure-md ${figure[t]}`}>
          {formatPnl(day.pnl, unit, base)}
        </span>
      )}
    </div>
  );
}

function WeekTotal({ value, unit, base }: { value: number | null; unit: Unit; base: number }) {
  const t = tone(value);
  return (
    <div role="gridcell" className="grid place-items-center bg-sunken">
      {value === null ? (
        <span aria-label="No activity" className="text-figure-md text-fg-faint">
          —
        </span>
      ) : (
        <span className={`text-[15px] leading-5 font-bold tabular-nums sm:text-figure-md ${figure[t]}`}>{formatPnl(value, unit, base)}</span>
      )}
    </div>
  );
}

function UnitToggle({ unit, onChange }: { unit: Unit; onChange: (u: Unit) => void }) {
  const options: { value: Unit; label: string }[] = [
    { value: "usd", label: "USD" },
    { value: "pct", label: "%" },
  ];
  return (
    <div
      role="group"
      aria-label="Display unit"
      className="ml-auto inline-flex gap-0.5 rounded-md border border-line bg-sunken p-[3px]"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={unit === o.value}
          onClick={() => onChange(o.value)}
          className={`h-9 min-w-20 rounded-sm text-body font-semibold transition-colors ${
            unit === o.value ? "bg-raised text-accent-soft" : "text-fg-secondary hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Legend() {
  const items = [
    { label: "Profit", dot: "bg-profit-dot" },
    { label: "Loss", dot: "bg-loss-dot" },
    { label: "No activity", dot: "bg-neutral-dot" },
  ];
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 text-caption text-fg-muted">
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${i.dot}`} />
            {i.label}
          </li>
        ))}
      </ul>
      <span>Net P&amp;L · After fees</span>
    </div>
  );
}
