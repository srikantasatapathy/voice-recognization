"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { AGE_GROUPS, DIFFICULTIES } from "@/lib/types";
import { isMatch } from "@/lib/match";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { ParagraphView } from "./paragraph-view";
import { SessionStats } from "./session-stats";
import { MicButton } from "./mic-button";
import { PlayButton } from "./play-button";
import { BrowserSupportBanner } from "./browser-support-banner";
import { Button } from "@/components/ui/button";

export function ReadingScreen() {
  const paragraph = useSession((s) => s.paragraph);
  const selectedGroup = useSession((s) => s.selectedGroup);
  const selectedLevel = useSession((s) => s.selectedLevel);
  const backToSetup = useSession((s) => s.backToSetup);
  const restartSame = useSession((s) => s.restartSame);
  const skip = useSession((s) => s.skip);

  const group = AGE_GROUPS.find((g) => g.id === selectedGroup);
  const level = DIFFICULTIES.find((d) => d.id === selectedLevel);

  const handleWordHeard = useCallback((spoken: string) => {
    const state = useSession.getState();
    if (state.status === "completed") return;
    const current = state.words[state.currentIndex];
    if (!current) return;
    if (isMatch(spoken, current.normalized)) {
      state.markCorrect();
    } else {
      state.markWrong();
    }
  }, []);

  const {
    isSupported: micSupported,
    isListening,
    error: micError,
    start: startMic,
    stop: stopMic,
  } = useSpeechRecognition({ onWordHeard: handleWordHeard });

  const {
    isSupported: ttsSupported,
    isPlaying,
    activeWordIndex: previewIndex,
    play: playTts,
    stop: stopTts,
  } = useSpeechSynthesis({ rate: 0.9 });

  const togglePlay = () => {
    if (!paragraph) return;
    if (isPlaying) {
      stopTts();
    } else {
      if (isListening) stopMic();
      playTts(paragraph.text);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopMic();
    } else {
      if (isPlaying) stopTts();
      startMic();
    }
  };

  const stopEverything = () => {
    stopTts();
    stopMic();
  };

  const showPermissionBanner =
    micError === "not-allowed" || micError === "service-not-allowed";

  if (!paragraph) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:py-14">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            stopEverything();
            backToSetup();
          }}
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

      {(!micSupported || showPermissionBanner) && (
        <BrowserSupportBanner error={micError} />
      )}

      <SessionStats />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
      >
        <ParagraphView previewIndex={isPlaying ? previewIndex : null} />
      </motion.div>

      <div className="flex flex-col items-center gap-5 pt-2">
        <div className="flex items-end gap-8 sm:gap-10">
          <PlayButton
            isPlaying={isPlaying}
            disabled={!ttsSupported || isListening}
            onToggle={togglePlay}
          />
          <MicButton
            isListening={isListening}
            disabled={!micSupported || isPlaying}
            onToggle={toggleMic}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            onClick={skip}
            variant="outline"
            size="sm"
            className="gap-1"
            disabled={isPlaying}
          >
            <ChevronRight className="h-4 w-4" />
            Skip word
          </Button>
          <Button
            onClick={() => {
              stopEverything();
              restartSame();
            }}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <RotateCcw className="h-4 w-4" />
            Restart
          </Button>
        </div>
        <p className="max-w-md text-center text-xs text-muted-foreground">
          Tap <em>Listen</em> to hear the paragraph first, then tap the mic and read
          it aloud. Words turn green when recognized.
        </p>
      </div>
    </div>
  );
}
