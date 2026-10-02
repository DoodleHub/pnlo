type IconProps = { className?: string };

function Stroke({ className, d }: IconProps & { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className ?? "size-[18px]"}
    >
      <path d={d} />
    </svg>
  );
}

export const ChevronLeft = (p: IconProps) => <Stroke {...p} d="m15 18-6-6 6-6" />;
export const ChevronRight = (p: IconProps) => <Stroke {...p} d="m9 18 6-6-6-6" />;
export const ChevronDown = (p: IconProps) => <Stroke {...p} d="m6 9 6 6 6-6" />;
export const Check = (p: IconProps) => <Stroke {...p} d="M20 6 9 17l-5-5" />;
export const Plus = (p: IconProps) => <Stroke {...p} d="M12 5v14M5 12h14" />;
export const Pencil = (p: IconProps) => (
  <Stroke {...p} d="M21.17 6.81a1 1 0 0 0-3.98-3.98L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5zM15 5l4 4" />
);
export const Trash = (p: IconProps) => (
  <Stroke {...p} d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
);
export const Wallet = (p: IconProps) => (
  <Stroke {...p} d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
);
export const LogOut = (p: IconProps) => <Stroke {...p} d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />;

export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className={className}>
      <path fill="var(--accent)" d="M14 2.5 26.5 26h-5.6L14 12.6 7.1 26H1.5Z" />
    </svg>
  );
}

/** Indeterminate progress indicator; place it next to a text label that says what's happening. */
export function Spinner({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={`motion-safe:animate-spin ${className ?? "size-[18px]"}`}
    >
      <circle cx="12" cy="12" r="9" opacity={0.25} />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  );
}
