"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MicButtonProps {
  isListening: boolean;
  disabled?: boolean;
  onToggle: () => void;
  label?: string;
}

export function MicButton({ isListening, disabled, onToggle, label }: MicButtonProps) {
  const buttonLabel =
    label ?? (disabled ? "Mic unavailable" : isListening ? "Stop listening" : "Start reading");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Pulsing rings — only while listening */}
        <AnimatePresence>
          {isListening && !disabled && (
            <>
              {[0, 0.4, 0.8].map((delay) => (
                <motion.span
                  key={delay}
                  className="absolute inset-0 rounded-full bg-rose-500/25"
                  initial={{ scale: 0.9, opacity: 0.55 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay,
                    ease: "easeOut",
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={buttonLabel}
          whileHover={disabled ? undefined : { scale: 1.04 }}
          whileTap={disabled ? undefined : { scale: 0.94 }}
          className={cn(
            "relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-colors",
            disabled
              ? "cursor-not-allowed bg-muted text-muted-foreground shadow-none"
              : isListening
              ? "bg-rose-500 text-white shadow-rose-500/40"
              : "bg-primary text-primary-foreground shadow-primary/30 hover:bg-primary/90"
          )}
        >
          {disabled ? (
            <MicOff className="h-8 w-8" />
          ) : (
            <motion.span
              key={isListening ? "on" : "off"}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="inline-flex"
            >
              <Mic className="h-8 w-8" />
            </motion.span>
          )}
        </motion.button>
      </div>

      <span
        className={cn(
          "text-xs font-medium uppercase tracking-wider",
          disabled
            ? "text-muted-foreground"
            : isListening
            ? "text-rose-600 dark:text-rose-400"
            : "text-muted-foreground"
        )}
      >
        {disabled
          ? "Not supported"
          : isListening
          ? "Listening..."
          : "Tap to start"}
      </span>
    </div>
  );
}
