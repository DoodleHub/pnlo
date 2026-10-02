"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "./icons";

type Props = {
  className: string;
  children: ReactNode;
  pendingLabel: ReactNode;
  /** Shown before the label when idle; replaced by the spinner while pending. */
  icon?: ReactNode;
  role?: string;
  spinnerClassName?: string;
};

/** Submit button for a `<form action>` that shows a spinner while its form is submitting. */
export function SubmitButton({ className, children, pendingLabel, icon, role, spinnerClassName = "size-4" }: Props) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" role={role} disabled={pending} className={className}>
      {pending ? <Spinner className={spinnerClassName} /> : icon}
      {pending ? pendingLabel : children}
    </button>
  );
}
