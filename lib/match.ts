import { doubleMetaphone } from "double-metaphone";
import { compareTwoStrings } from "string-similarity";
import { normalizeWord } from "./tokenize";

export const FUZZY_THRESHOLD = 0.72;

export type MatchKind = "exact" | "phonetic" | "fuzzy" | "none";

export interface MatchResult {
  kind: MatchKind;
  score: number;
}

export function matchWord(spokenRaw: string, targetRaw: string): MatchResult {
  const spoken = normalizeWord(spokenRaw);
  const target = normalizeWord(targetRaw);
  if (!spoken || !target) return { kind: "none", score: 0 };

  if (spoken === target) return { kind: "exact", score: 1 };

  const [spokenPrimary, spokenSecondary] = doubleMetaphone(spoken);
  const [targetPrimary, targetSecondary] = doubleMetaphone(target);
  const phoneticHit =
    (!!spokenPrimary && !!targetPrimary && spokenPrimary === targetPrimary) ||
    (!!spokenPrimary && !!targetSecondary && spokenPrimary === targetSecondary) ||
    (!!spokenSecondary && !!targetPrimary && spokenSecondary === targetPrimary);
  if (phoneticHit) return { kind: "phonetic", score: 0.95 };

  const score = compareTwoStrings(spoken, target);
  if (score >= FUZZY_THRESHOLD) return { kind: "fuzzy", score };

  return { kind: "none", score };
}

export function isMatch(spoken: string, target: string): boolean {
  return matchWord(spoken, target).kind !== "none";
}
