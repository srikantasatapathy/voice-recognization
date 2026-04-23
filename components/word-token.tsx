"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Word } from "@/lib/types";

const statusStyles: Record<Word["status"], string> = {
  pending: "text-neutral-300 dark:text-neutral-700",
  active:
    "text-neutral-900 dark:text-neutral-50 bg-yellow-100 dark:bg-yellow-900/40 ring-2 ring-yellow-400/60 dark:ring-yellow-500/40",
  correct: "text-neutral-900 dark:text-neutral-100",
  error: "text-red-600 dark:text-red-400 line-through decoration-red-500/70 decoration-2",
  skipped: "text-orange-500 dark:text-orange-400 line-through decoration-orange-400/70 decoration-2",
};

export function WordToken({ word, isCurrent }: { word: Word; isCurrent: boolean }) {
  const shakeKey = `${word.id}-${word.attempts}`;

  return (
    <motion.span
      key={shakeKey}
      initial={word.attempts > 0 && isCurrent ? { x: -4 } : false}
      animate={word.attempts > 0 && isCurrent ? { x: [-4, 4, -3, 3, 0] } : { x: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "inline-block rounded px-1 py-0.5 transition-colors duration-200",
        statusStyles[word.status]
      )}
    >
      {word.text}
    </motion.span>
  );
}
