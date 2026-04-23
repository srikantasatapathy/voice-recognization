"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { AGE_GROUPS, DIFFICULTIES } from "@/lib/types";
import { ParagraphView } from "./paragraph-view";
import { SessionStats } from "./session-stats";
import { SessionControls } from "./session-controls";
import { Button } from "@/components/ui/button";

export function ReadingScreen() {
  const paragraph = useSession((s) => s.paragraph);
  const selectedGroup = useSession((s) => s.selectedGroup);
  const selectedLevel = useSession((s) => s.selectedLevel);
  const backToSetup = useSession((s) => s.backToSetup);

  const group = AGE_GROUPS.find((g) => g.id === selectedGroup);
  const level = DIFFICULTIES.find((d) => d.id === selectedLevel);

  if (!paragraph) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={backToSetup}
          className="gap-1 text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-xs">
          {group && (
            <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-medium">
              {group.emoji} {group.label}
            </span>
          )}
          {level && (
            <span className="rounded-full border border-border bg-background/60 px-2.5 py-1 font-medium capitalize">
              {level.label}
            </span>
          )}
        </div>
      </div>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-1"
      >
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {paragraph.kind}
        </span>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {paragraph.title}
        </h1>
      </motion.header>

      <SessionStats />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      >
        <ParagraphView />
      </motion.div>

      <SessionControls />

      <p className="text-center text-xs text-muted-foreground">
        Voice input coming next — for now, use the debug buttons above.
      </p>
    </div>
  );
}
