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

interface WordTokenProps {
  word: Word;
  isCurrent: boolean;
  isPreviewHighlight?: boolean;
}

export function WordToken({ word, isCurrent, isPreviewHighlight = false }: WordTokenProps) {
  const shouldShake = word.attempts > 0 && isCurrent && !isPreviewHighlight;

  const animate = shouldShake
    ? { x: [-4, 4, -3, 3, 0], scale: 1 }
    : isPreviewHighlight
    ? { scale: [1, 1.08, 1], x: 0 }
    : { x: 0, scale: 1 };

  const shakeKey = `${word.id}-${word.attempts}`;

  return (
    <motion.span
      key={shouldShake ? shakeKey : `w-${word.id}`}
      animate={animate}
      transition={{
        duration: isPreviewHighlight ? 0.6 : 0.35,
        repeat: isPreviewHighlight ? Infinity : 0,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
      className={cn(
        "inline-block rounded px-1 py-0.5 transition-colors duration-200",
        statusStyles[word.status],
        isPreviewHighlight &&
          "!bg-sky-100 !text-sky-900 !ring-2 !ring-sky-400/70 shadow-[0_0_20px_rgba(56,189,248,0.35)] dark:!bg-sky-900/50 dark:!text-sky-100 dark:!ring-sky-500/60"
      )}
    >
      {word.text}
    </motion.span>
  );
}
