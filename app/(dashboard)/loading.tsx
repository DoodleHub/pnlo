import { LogoMark } from "@/components/icons";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

/** Placeholder bar; sized by the caller to match the text or control it stands in for. */
function Bone({ className }: { className: string }) {
  return <div className={`bg-raised motion-safe:animate-pulse ${className}`} />;
}

/** Dashboard skeleton shown while the server loads the user's accounts. Mirrors PnlDashboard's layout. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading your dashboard"
      className="mx-auto flex w-full max-w-[1400px] flex-col px-4 pt-4 pb-10 sm:px-8 sm:pt-[18px]"
    >
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[26px] font-semibold tracking-[-0.01em] text-fg">
          <LogoMark className="size-7" />
          Pnlok
        </div>
        <div className="flex items-center gap-4">
          <Bone className="h-11 w-44 rounded-md" />
          <Bone className="size-11 rounded-full" />
        </div>
      </header>

      <div className="mt-5 mb-3.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 sm:mt-8">
        <div className="hidden sm:block">
          <Bone className="my-1 h-12 w-80 rounded-md" />
          <Bone className="mt-2 h-5 w-72 rounded-sm" />
        </div>
        <div className="grid gap-1.5 sm:justify-items-end">
          <Bone className="h-3.5 w-24 rounded-sm" />
          <Bone className="h-5 w-44 rounded-sm" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-y-3 rounded-lg border border-line-strong bg-surface py-3 sm:gap-y-6 sm:py-6 min-[900px]:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`grid gap-1.5 px-4 sm:gap-2.5 sm:px-8 ${i % 2 === 1 ? "border-l border-line" : ""} ${
                i === 2 ? "min-[900px]:border-l min-[900px]:border-line" : ""
              }`}
            >
              <Bone className="h-3.5 w-20 rounded-sm sm:h-4" />
              <Bone className="h-5 w-28 rounded-sm sm:h-7" />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-line-strong bg-surface p-3 sm:p-4">
          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-3 px-1 sm:px-3">
            <Bone className="h-8 w-48 rounded-md sm:mr-6 sm:h-[34px]" />
            <div className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
              <Bone className="h-11 w-10 rounded-md sm:w-[54px]" />
              <Bone className="h-11 w-10 rounded-md sm:ml-2 sm:w-[54px]" />
              <Bone className="h-11 w-16 rounded-md sm:ml-2 sm:w-24" />
              <Bone className="ml-auto h-11 w-[104px] rounded-md sm:w-[170px]" />
            </div>
          </div>

          <div className="grid grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.05fr)] gap-px overflow-hidden rounded-sm border border-line bg-line">
            {[...WEEKDAYS, "Week"].map((d) => (
              <div key={d} className="bg-surface pt-2 pb-2.5 text-center text-label font-medium text-fg-secondary">
                {d}
              </div>
            ))}
            {Array.from({ length: 5 }, (_, w) =>
              Array.from({ length: 6 }, (_, d) =>
                d < 5 ? (
                  <div key={`${w}-${d}`} className="min-h-[64px] bg-cell px-1.5 pt-1.5 sm:min-h-[84px] sm:px-3">
                    <Bone className="mt-0.5 h-4 w-4 rounded-sm" />
                  </div>
                ) : (
                  <div key={`${w}-${d}`} className="bg-sunken" />
                ),
              ),
            )}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
