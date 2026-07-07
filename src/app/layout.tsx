import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "driver.js/dist/driver.css";
import { AppShell } from "@/components/layout/AppShell";
import { StoreHydrator } from "@/components/shared/StoreHydrator";

// Inter is the single typeface for the whole system (see design/DESIGN.md).
// Loading it through next/font self-hosts the files and exposes a CSS variable
// that our Tailwind `--font-sans` token points at (see globals.css).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoverDial - AI Cover Letter Generator",
  description:
    "Generate and refine tailored cover letters with AI. Fast, minimal, professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/*
          Material Symbols icon font. We load it via a stylesheet link (rather
          than next/font) because it is a variable icon font addressed by
          ligature names - matching the icon set used in the Stitch design.
        */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body>
        <StoreHydrator />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
