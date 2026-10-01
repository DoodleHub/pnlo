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

export function LogoMark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" className={className}>
      <path fill="var(--accent)" d="M14 2.5 26.5 26h-5.6L14 12.6 7.1 26H1.5Z" />
    </svg>
  );
}
