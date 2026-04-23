"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  isPlaying: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function PlayButton({ isPlaying, disabled, onToggle }: PlayButtonProps) {
  const label = disabled
    ? "Preview unavailable"
    : isPlaying
    ? "Stop preview"
    : "Listen to paragraph";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <AnimatePresence>
          {isPlaying && !disabled && (
            <motion.span
              className="absolute inset-0 rounded-full bg-sky-500/25"
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={label}
          whileHover={disabled ? undefined : { scale: 1.05 }}
          whileTap={disabled ? undefined : { scale: 0.93 }}
          className={cn(
            "relative z-10 flex h-14 w-14 items-center justify-center rounded-full shadow-md transition-colors",
            disabled
              ? "cursor-not-allowed bg-muted text-muted-foreground shadow-none"
              : isPlaying
              ? "bg-sky-500 text-white shadow-sky-500/30"
              : "bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-200 dark:hover:bg-sky-950/70"
          )}
        >
          <motion.span
            key={isPlaying ? "pause" : "play"}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="inline-flex"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" />
            )}
          </motion.span>
        </motion.button>
      </div>
      <span
        className={cn(
          "text-[11px] font-medium uppercase tracking-wider",
          disabled
            ? "text-muted-foreground"
            : isPlaying
            ? "text-sky-600 dark:text-sky-400"
            : "text-muted-foreground"
        )}
      >
        {disabled ? "—" : isPlaying ? "Playing..." : "Listen"}
      </span>
    </div>
  );
}
