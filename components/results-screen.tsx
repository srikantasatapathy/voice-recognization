"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Home, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function verdict(accuracy: number): { title: string; subtitle: string; tone: "gold" | "green" | "blue" | "amber" } {
  if (accuracy >= 95) return { title: "Outstanding!", subtitle: "Nearly perfect reading.", tone: "gold" };
  if (accuracy >= 80) return { title: "Great job!", subtitle: "Strong pronunciation overall.", tone: "green" };
  if (accuracy >= 60) return { title: "Good effort!", subtitle: "A few more tries will polish it.", tone: "blue" };
  return { title: "Keep practicing!", subtitle: "Every read builds confidence.", tone: "amber" };
}

function AccuracyRing({ percent }: { percent: number }) {
  const size = 180;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-muted/40"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          className="text-primary"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl font-bold tabular-nums"
        >
          {Math.round(percent)}%
        </motion.span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Accuracy
        </span>
      </div>
    </div>
  );
}

export function ResultsScreen() {
  const words = useSession((s) => s.words);
  const startTime = useSession((s) => s.startTime);
  const endTime = useSession((s) => s.endTime);
  const paragraph = useSession((s) => s.paragraph);
  const tryAnother = useSession((s) => s.tryAnother);
  const backToSetup = useSession((s) => s.backToSetup);

  const stats = useMemo(() => {
    const correct = words.filter((w) => w.status === "correct").length;
    const wrong = words.filter((w) => w.status === "error" || w.status === "skipped").length;
    const total = words.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const durationMs = startTime && endTime ? endTime - startTime : 0;
    return { correct, wrong, total, accuracy, durationMs };
  }, [words, startTime, endTime]);

  const v = verdict(stats.accuracy);
  const toneClasses: Record<typeof v.tone, string> = {
    gold: "from-amber-300 via-yellow-200 to-amber-100",
    green: "from-emerald-300 via-emerald-200 to-emerald-100",
    blue: "from-sky-300 via-sky-200 to-sky-100",
    amber: "from-orange-300 via-amber-200 to-amber-100",
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <motion.div
          initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.15 }}
          className={cn(
            "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm",
            toneClasses[v.tone]
          )}
        >
          <Trophy className="h-8 w-8 text-neutral-900" />
        </motion.div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          {v.title}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground sm:text-base">
          {v.subtitle}
          {paragraph ? ` You just finished "${paragraph.title}".` : ""}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="flex flex-col items-center gap-8 rounded-3xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur-sm sm:flex-row sm:justify-between sm:p-10"
      >
        <AccuracyRing percent={stats.accuracy} />

        <div className="grid w-full grid-cols-1 gap-3 sm:max-w-xs">
          <ResultRow
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            label="Correct words"
            value={`${stats.correct} / ${stats.total}`}
          />
          <ResultRow
            icon={<XCircle className="h-5 w-5 text-rose-600" />}
            label="Wrong or skipped"
            value={String(stats.wrong)}
          />
          <ResultRow
            icon={<Clock className="h-5 w-5 text-sky-600" />}
            label="Time taken"
            value={formatDuration(stats.durationMs)}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Button size="lg" onClick={() => tryAnother()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try another
        </Button>
        <Button size="lg" variant="outline" onClick={backToSetup} className="gap-2">
          <Home className="h-4 w-4" />
          Pick another paragraph
        </Button>
      </motion.div>
    </div>
  );
}

function ResultRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
