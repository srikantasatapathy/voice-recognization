"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { AGE_GROUPS, DIFFICULTIES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function SetupScreen() {
  const selectedGroup = useSession((s) => s.selectedGroup);
  const selectedLevel = useSession((s) => s.selectedLevel);
  const setGroup = useSession((s) => s.setGroup);
  const setLevel = useSession((s) => s.setLevel);
  const startReading = useSession((s) => s.startReading);

  const canStart = selectedGroup && selectedLevel;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-12 sm:py-20">
      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Read aloud · Speak · Track accuracy
        </div>
        <h1 className="bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent dark:from-white dark:via-neutral-200 dark:to-neutral-400 sm:text-6xl">
          Let&apos;s read together
        </h1>
        <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
          Pick who&apos;s reading and how tough you want it. We&apos;ll pick the perfect paragraph for you.
        </p>
      </motion.div>

      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">1. Who&apos;s reading?</h2>
          {selectedGroup && (
            <span className="text-xs text-muted-foreground">
              Selected: {AGE_GROUPS.find((g) => g.id === selectedGroup)?.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {AGE_GROUPS.map((g) => {
            const active = selectedGroup === g.id;
            return (
              <motion.button
                key={g.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setGroup(g.id)}
                className={cn(
                  "group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5 shadow-[0_0_0_3px_var(--color-primary)/0.12]"
                    : "border-border bg-card hover:border-foreground/30 hover:bg-accent/40"
                )}
              >
                <span className="text-3xl" aria-hidden>
                  {g.emoji}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{g.label}</span>
                  <span className="text-xs text-muted-foreground">{g.sublabel}</span>
                </div>
                {active && (
                  <motion.span
                    layoutId="group-indicator"
                    className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-primary"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.section
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-end justify-between">
          <h2 className="text-lg font-semibold">2. Choose difficulty</h2>
          {selectedLevel && (
            <span className="text-xs text-muted-foreground">
              Selected: {DIFFICULTIES.find((d) => d.id === selectedLevel)?.label}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {DIFFICULTIES.map((d, i) => {
            const active = selectedLevel === d.id;
            const accent =
              i === 0
                ? "from-emerald-200/50 to-emerald-100/10"
                : i === 1
                ? "from-amber-200/50 to-amber-100/10"
                : "from-rose-200/60 to-rose-100/10";
            return (
              <motion.button
                key={d.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLevel(d.id)}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5 text-left transition-colors",
                  active
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-foreground/30"
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
                    accent
                  )}
                />
                <div className="relative flex flex-col gap-1">
                  <span className="text-sm font-semibold">{d.label}</span>
                  <span className="text-xs text-muted-foreground">{d.description}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.div
        {...fadeInUp}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex justify-end"
      >
        <Button
          size="lg"
          disabled={!canStart}
          onClick={() => startReading()}
          className="group gap-2"
        >
          Start Reading
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </motion.div>
    </div>
  );
}
