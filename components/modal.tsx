"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

/** Native modal dialog: focus trapping, Escape and the backdrop come from the browser. */
export function Modal({ title, description, onClose, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-lg border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/60"
    >
      <div className="p-6">
        <h2 className="text-[22px] leading-7 font-bold tracking-[-0.01em]">{title}</h2>
        {description && <p className="mt-1 text-body text-fg-secondary">{description}</p>}
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
}
