"use client";

import { useEffect } from "react";

/** Registers public/sw.js in production builds (dev assets aren't content-hashed, so caching them goes stale). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
  }, []);
  return null;
}
