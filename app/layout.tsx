import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { ServiceWorker } from "@/components/service-worker";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pnlok · Profit & loss",
  description: "Your performance, one day at a time.",
  applicationName: "Pnlok",
  appleWebApp: { capable: true, title: "Pnlok", statusBarStyle: "black" },
};

export const viewport: Viewport = {
  themeColor: "#12161d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
