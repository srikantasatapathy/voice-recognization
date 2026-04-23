export function normalizeWord(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9']/g, "");
}

export interface Token {
  text: string;
  normalized: string;
}

export function tokenize(text: string): Token[] {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((raw) => ({ text: raw, normalized: normalizeWord(raw) }))
    .filter((t) => t.normalized.length > 0);
}
