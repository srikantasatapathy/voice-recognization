"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "@/lib/session-store";
import { SetupScreen } from "@/components/setup-screen";
import { ReadingScreen } from "@/components/reading-screen";
import { ResultsScreen } from "@/components/results-screen";

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Home() {
  const phase = useSession((s) => s.phase);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.95_0.04_260/0.7),transparent_60%),radial-gradient(ellipse_at_bottom_right,oklch(0.95_0.05_20/0.6),transparent_55%),radial-gradient(ellipse_at_bottom_left,oklch(0.95_0.05_160/0.5),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.28_0.06_260/0.6),transparent_60%),radial-gradient(ellipse_at_bottom_right,oklch(0.28_0.07_20/0.5),transparent_55%),radial-gradient(ellipse_at_bottom_left,oklch(0.28_0.07_160/0.4),transparent_55%)]"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {phase === "setup" && <SetupScreen />}
          {phase === "reading" && <ReadingScreen />}
          {phase === "results" && <ResultsScreen />}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
