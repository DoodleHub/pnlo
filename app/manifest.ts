import type { MetadataRoute } from "next";

/** Web app manifest (served at /manifest.webmanifest). Colors match --bg-canvas. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pnlok · Profit & loss",
    short_name: "Pnlok",
    description: "Your performance, one day at a time.",
    id: "/",
    // Static splash that paints instantly, then replaces itself with "/".
    start_url: "/launch.html",
    scope: "/",
    display: "standalone",
    background_color: "#12161d",
    theme_color: "#12161d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
