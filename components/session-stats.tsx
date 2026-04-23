"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Target, XCircle } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { MAX_ATTEMPTS } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "success" | "danger" | "info";
}

function StatCard({ icon, label, value, tone = "default" }: StatCardProps) {
  const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
    default: "bg-card text-foreground",
    success:
      "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200",
    danger: "bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
    info: "bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  };
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border px-4 py-3",
        toneStyles[tone]
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/60">
        {icon}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">
          {label}
        </span>
        <span className="text-base font-semibold tabular-nums">{value}</span>
      </div>
    </div>
  );
}

export function SessionStats() {
  const words = useSession((s) => s.words);
  const currentIndex = useSession((s) => s.currentIndex);
  const status = useSession((s) => s.status);
  const startTime = useSession((s) => s.startTime);
  const endTime = useSession((s) => s.endTime);

  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (status !== "active") return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [status]);

  const total = words.length;
  const correct = words.filter((w) => w.status === "correct").length;
  const wrong = words.filter((w) => w.status === "error" || w.status === "skipped").length;
  const done = correct + wrong;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const duration =
    startTime && endTime ? endTime - startTime : startTime ? now - startTime : 0;

  const currentWord = words[currentIndex];
  const currentAttempts = currentWord?.attempts ?? 0;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        <StatCard
          tone="success"
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Correct"
          value={String(correct)}
        />
        <StatCard
          tone="danger"
          icon={<XCircle className="h-5 w-5" />}
          label="Wrong"
          value={String(wrong)}
        />
        <StatCard
          tone="info"
          icon={<Target className="h-5 w-5" />}
          label="Word"
          value={`${Math.min(currentIndex + 1, total)} / ${total}`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Time"
          value={formatDuration(duration)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <div className="flex items-center gap-2">
            {status === "active" && currentAttempts > 0 && (
              <motion.span
                key={currentAttempts}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
              >
                Attempt {currentAttempts} / {MAX_ATTEMPTS}
              </motion.span>
            )}
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
