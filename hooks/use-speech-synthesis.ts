"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseSpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
}

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isPlaying: boolean;
  activeWordIndex: number | null;
  play: (text: string) => void;
  stop: () => void;
}

function wordIndexAtChar(text: string, charIndex: number): number {
  if (charIndex <= 0) return 0;
  const before = text.slice(0, Math.min(charIndex + 1, text.length));
  const tokens = before.split(/\s+/).filter(Boolean);
  return Math.max(0, tokens.length - 1);
}

export function useSpeechSynthesis({
  lang = "en-US",
  rate = 0.9,
  pitch = 1,
}: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    []
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, []);

  const play = useCallback(
    (text: string) => {
      if (!isSupported || !text) return;
      const synth = window.speechSynthesis;
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = rate;
      utter.pitch = pitch;

      utter.onstart = () => {
        setIsPlaying(true);
        setActiveWordIndex(0);
      };
      utter.onboundary = (ev) => {
        if (ev.name === "word") {
          setActiveWordIndex(wordIndexAtChar(text, ev.charIndex));
        }
      };
      utter.onend = () => {
        setIsPlaying(false);
        setActiveWordIndex(null);
        utteranceRef.current = null;
      };
      utter.onerror = () => {
        setIsPlaying(false);
        setActiveWordIndex(null);
        utteranceRef.current = null;
      };

      utteranceRef.current = utter;
      synth.speak(utter);
    },
    [isSupported, lang, rate, pitch]
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveWordIndex(null);
    utteranceRef.current = null;
  }, [isSupported]);

  return { isSupported, isPlaying, activeWordIndex, play, stop };
}
