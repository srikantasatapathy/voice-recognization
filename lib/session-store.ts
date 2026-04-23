"use client";

import { create } from "zustand";
import {
  AgeGroup,
  Difficulty,
  MAX_ATTEMPTS,
  SessionPhase,
  SessionStats,
  SessionStatus,
  Word,
  WordStatus,
} from "./types";
import { tokenize } from "./tokenize";
import { Paragraph, pickParagraph } from "./content";

interface SessionState {
  // Phase + selection
  phase: SessionPhase;
  selectedGroup: AgeGroup | null;
  selectedLevel: Difficulty | null;
  paragraph: Paragraph | null;

  // Reading state
  words: Word[];
  currentIndex: number;
  status: SessionStatus;
  startTime: number | null;
  endTime: number | null;

  // Phase + selection actions
  setGroup: (g: AgeGroup) => void;
  setLevel: (l: Difficulty) => void;
  startReading: () => boolean;
  backToSetup: () => void;
  restartSame: () => void;
  tryAnother: () => boolean;

  // Word state actions
  markCorrect: () => void;
  markWrong: () => void;
  skip: () => void;
  getStats: () => SessionStats;
}

function initialWordsFromText(text: string): Word[] {
  const tokens = tokenize(text);
  return tokens.map((t, i) => ({
    id: i,
    text: t.text,
    normalized: t.normalized,
    status: (i === 0 ? "active" : "pending") as WordStatus,
    attempts: 0,
  }));
}

function advanceActive(index: number, words: Word[]): Word[] {
  const next = index + 1;
  if (next >= words.length) return words;
  const updated = [...words];
  updated[next] = { ...updated[next], status: "active" };
  return updated;
}

export const useSession = create<SessionState>((set, get) => ({
  phase: "setup",
  selectedGroup: null,
  selectedLevel: null,
  paragraph: null,

  words: [],
  currentIndex: 0,
  status: "idle",
  startTime: null,
  endTime: null,

  setGroup: (g) => set({ selectedGroup: g }),
  setLevel: (l) => set({ selectedLevel: l }),

  startReading: () => {
    const { selectedGroup, selectedLevel } = get();
    if (!selectedGroup || !selectedLevel) return false;
    const paragraph = pickParagraph(selectedGroup, selectedLevel);
    if (!paragraph) return false;
    set({
      phase: "reading",
      paragraph,
      words: initialWordsFromText(paragraph.text),
      currentIndex: 0,
      status: "idle",
      startTime: null,
      endTime: null,
    });
    return true;
  },

  backToSetup: () => {
    set({
      phase: "setup",
      paragraph: null,
      words: [],
      currentIndex: 0,
      status: "idle",
      startTime: null,
      endTime: null,
    });
  },

  restartSame: () => {
    const { paragraph } = get();
    if (!paragraph) return;
    set({
      phase: "reading",
      words: initialWordsFromText(paragraph.text),
      currentIndex: 0,
      status: "idle",
      startTime: null,
      endTime: null,
    });
  },

  tryAnother: () => {
    const { selectedGroup, selectedLevel, paragraph } = get();
    if (!selectedGroup || !selectedLevel) return false;
    const next = pickParagraph(selectedGroup, selectedLevel, paragraph?.id);
    if (!next) return false;
    set({
      phase: "reading",
      paragraph: next,
      words: initialWordsFromText(next.text),
      currentIndex: 0,
      status: "idle",
      startTime: null,
      endTime: null,
    });
    return true;
  },

  markCorrect: () => {
    const { words, currentIndex, status, startTime } = get();
    if (status === "completed" || currentIndex >= words.length) return;

    let updated = [...words];
    updated[currentIndex] = { ...updated[currentIndex], status: "correct" };
    updated = advanceActive(currentIndex, updated);

    const nextIndex = currentIndex + 1;
    const isDone = nextIndex >= words.length;

    set({
      words: updated,
      currentIndex: nextIndex,
      status: isDone ? "completed" : "active",
      startTime: startTime ?? Date.now(),
      endTime: isDone ? Date.now() : null,
      phase: isDone ? "results" : "reading",
    });
  },

  markWrong: () => {
    const { words, currentIndex, status, startTime } = get();
    if (status === "completed" || currentIndex >= words.length) return;

    const updated = [...words];
    const current = updated[currentIndex];
    const nextAttempts = current.attempts + 1;
    const exhausted = nextAttempts >= MAX_ATTEMPTS;

    updated[currentIndex] = {
      ...current,
      attempts: nextAttempts,
      status: exhausted ? "error" : "active",
    };

    if (!exhausted) {
      set({
        words: updated,
        status: "active",
        startTime: startTime ?? Date.now(),
      });
      return;
    }

    const afterAdvance = advanceActive(currentIndex, updated);
    const nextIndex = currentIndex + 1;
    const isDone = nextIndex >= words.length;

    set({
      words: afterAdvance,
      currentIndex: nextIndex,
      status: isDone ? "completed" : "active",
      startTime: startTime ?? Date.now(),
      endTime: isDone ? Date.now() : null,
      phase: isDone ? "results" : "reading",
    });
  },

  skip: () => {
    const { words, currentIndex, status, startTime } = get();
    if (status === "completed" || currentIndex >= words.length) return;

    let updated = [...words];
    updated[currentIndex] = { ...updated[currentIndex], status: "skipped" };
    updated = advanceActive(currentIndex, updated);

    const nextIndex = currentIndex + 1;
    const isDone = nextIndex >= words.length;

    set({
      words: updated,
      currentIndex: nextIndex,
      status: isDone ? "completed" : "active",
      startTime: startTime ?? Date.now(),
      endTime: isDone ? Date.now() : null,
      phase: isDone ? "results" : "reading",
    });
  },

  getStats: () => {
    const { words, startTime, endTime } = get();
    const correct = words.filter((w) => w.status === "correct").length;
    const wrong = words.filter((w) => w.status === "error" || w.status === "skipped").length;
    const total = words.length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    const durationMs =
      startTime && endTime
        ? endTime - startTime
        : startTime
        ? Date.now() - startTime
        : 0;
    return { correct, wrong, total, accuracy, durationMs };
  },
}));
