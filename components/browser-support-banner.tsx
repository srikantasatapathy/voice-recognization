"use client";

import { AlertTriangle } from "lucide-react";

interface BrowserSupportBannerProps {
  error?: string | null;
}

export function BrowserSupportBanner({ error }: BrowserSupportBannerProps) {
  const isPermissionIssue = error === "not-allowed" || error === "service-not-allowed";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {isPermissionIssue ? (
          <>
            <span className="font-semibold">Microphone access was blocked.</span>
            <span className="text-amber-800 dark:text-amber-200">
              Please allow microphone access in your browser settings to use voice input.
            </span>
          </>
        ) : (
          <>
            <span className="font-semibold">Voice input isn&apos;t supported in this browser.</span>
            <span className="text-amber-800 dark:text-amber-200">
              For the best experience, open this page in Chrome, Edge, or Safari.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
