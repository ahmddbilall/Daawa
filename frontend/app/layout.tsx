import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "@/components/Providers";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const themeInitScript = `
(() => {
  try {
    const stored = localStorage.getItem("Daawa_theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "light" || stored === "dark" ? stored : prefersDark ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch {
    document.documentElement.classList.add("dark");
  }
})();
`;

export const metadata: Metadata = {
  title: "Daawa - Offline Health Triage",
  description:
    "AI-powered offline triage assistant for community health workers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("antialiased", geistSans.variable, geistMono.variable)}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <body className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
