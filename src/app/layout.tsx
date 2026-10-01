import type { Metadata, Viewport } from "next";
import "@fontsource/cinzel/700.css";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/inter";
import { siteUrl } from "@/lib/format";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: "Royal Flow Energy — Clean micro-hydro power for Zambia", template: "%s | Royal Flow Energy" },
  description:
    "Royal Flow Energy develops the Riverbox, a locally designed low-head micro-hydro turbine bringing reliable, affordable electricity to off-grid communities in Zambia.",
  openGraph: {
    type: "website",
    siteName: "Royal Flow Energy",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Royal Flow Energy" }],
  },
  twitter: { card: "summary" },
};

export const viewport: Viewport = { themeColor: "#1b3350" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen">{children}</body>
    </html>
  );
}
