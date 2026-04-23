export type WordStatus = "pending" | "active" | "correct" | "error" | "skipped";

export type SessionStatus = "idle" | "active" | "completed";

export type SessionPhase = "setup" | "reading" | "results";

export type AgeGroup = "preschool" | "school" | "highschool" | "college" | "professional";

export type Difficulty = "easy" | "medium" | "hard";

export interface Word {
  id: number;
  text: string;
  normalized: string;
  status: WordStatus;
  attempts: number;
}

export interface SessionStats {
  correct: number;
  wrong: number;
  total: number;
  accuracy: number;
  durationMs: number;
}

export interface AgeGroupMeta {
  id: AgeGroup;
  label: string;
  sublabel: string;
  emoji: string;
}

export interface DifficultyMeta {
  id: Difficulty;
  label: string;
  description: string;
}

export const MAX_ATTEMPTS = 3;

export const AGE_GROUPS: AgeGroupMeta[] = [
  { id: "preschool", label: "Pre-School", sublabel: "Nursery · LKG · UKG", emoji: "🧸" },
  { id: "school", label: "School", sublabel: "Class 1 – 7", emoji: "📚" },
  { id: "highschool", label: "High School", sublabel: "Class 8 – 10", emoji: "🎒" },
  { id: "college", label: "College", sublabel: "+2 · Degree", emoji: "🎓" },
  { id: "professional", label: "Professional", sublabel: "Communication · Self-grooming", emoji: "💼" },
];

export const DIFFICULTIES: DifficultyMeta[] = [
  { id: "easy", label: "Easy", description: "Short and gentle" },
  { id: "medium", label: "Medium", description: "A bit more challenging" },
  { id: "hard", label: "Hard", description: "Push your reading" },
];
