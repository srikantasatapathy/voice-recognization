"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface UseSpeechRecognitionOptions {
  lang?: string;
  onWordHeard: (word: string) => void;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  error: string | null;
  start: () => void;
  stop: () => void;
}

function getConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition({
  lang = "en-US",
  onWordHeard,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);
  const processedCountRef = useRef(0);
  const onWordHeardRef = useRef(onWordHeard);
  onWordHeardRef.current = onWordHeard;

  const isSupported = useMemo(() => getConstructor() !== null, []);

  useEffect(() => {
    const Ctor = getConstructor();
    if (!Ctor) return;

    const r = new Ctor();
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;
    r.maxAlternatives = 1;

    r.onstart = () => {
      setIsListening(true);
      setError(null);
      processedCountRef.current = 0;
    };

    r.onend = () => {
      setIsListening(false);
      // Chrome stops continuous recognition after ~60s of silence.
      // Auto-restart if the user still wants to be listening.
      if (shouldListenRef.current) {
        try {
          r.start();
        } catch {
          // If start fails (e.g. already started), the browser will emit its own event.
        }
      }
    };

    r.onerror = (ev) => {
      setError(ev.error || "unknown");
      if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
        shouldListenRef.current = false;
      }
    };

    r.onresult = (ev) => {
      // Build the full transcript across all results (finals + current interim).
      const parts: string[] = [];
      for (let i = 0; i < ev.results.length; i++) {
        const result = ev.results[i];
        if (result && result[0]) parts.push(result[0].transcript);
      }
      const fullTranscript = parts.join(" ");
      const words = fullTranscript.split(/\s+/).filter(Boolean);

      for (let i = processedCountRef.current; i < words.length; i++) {
        onWordHeardRef.current(words[i]);
      }
      processedCountRef.current = words.length;
    };

    recognitionRef.current = r;

    return () => {
      shouldListenRef.current = false;
      try {
        r.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    shouldListenRef.current = true;
    setError(null);
    processedCountRef.current = 0;
    try {
      r.start();
    } catch {
      // Already started — fine.
    }
  }, []);

  const stop = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    shouldListenRef.current = false;
    try {
      r.stop();
    } catch {
      // ignore
    }
  }, []);

  return { isSupported, isListening, error, start, stop };
}
