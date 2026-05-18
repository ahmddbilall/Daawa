"use client";

import { I18nProvider } from "@/lib/I18nProvider";
import StatusDot from "@/components/StatusDot";
import ThemeToggle from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <div className="fixed top-4 end-4 z-50 flex items-center gap-2">
        <ThemeToggle />
        <StatusDot />
      </div>
      {children}
      <Toaster richColors position="top-right" />
    </I18nProvider>
  );
}
