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
  play: (text: string) => void;
  stop: () => void;
}

export function useSpeechSynthesis({
  lang = "en-US",
  rate = 0.9,
  pitch = 1,
}: UseSpeechSynthesisOptions = {}): UseSpeechSynthesisReturn {
  const [isPlaying, setIsPlaying] = useState(false);
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
      // Cancel any in-flight utterance before starting a new one.
      synth.cancel();

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.onstart = () => setIsPlaying(true);
      utter.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };
      utter.onerror = () => {
        setIsPlaying(false);
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
    utteranceRef.current = null;
  }, [isSupported]);

  return { isSupported, isPlaying, play, stop };
}
