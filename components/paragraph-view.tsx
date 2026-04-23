"use client";

import { useSession } from "@/lib/session-store";
import { WordToken } from "./word-token";

interface ParagraphViewProps {
  previewIndex?: number | null;
}

export function ParagraphView({ previewIndex = null }: ParagraphViewProps) {
  const words = useSession((s) => s.words);
  const currentIndex = useSession((s) => s.currentIndex);

  if (words.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        No paragraph loaded.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2 font-serif text-2xl leading-relaxed sm:text-3xl sm:leading-[1.7]">
      {words.map((w, i) => (
        <WordToken
          key={w.id}
          word={w}
          isCurrent={i === currentIndex}
          isPreviewHighlight={previewIndex !== null && i === previewIndex}
        />
      ))}
    </div>
  );
}
