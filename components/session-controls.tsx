"use client";

import { useSession } from "@/lib/session-store";
import { Button } from "@/components/ui/button";

export function SessionControls() {
  const markCorrect = useSession((s) => s.markCorrect);
  const markWrong = useSession((s) => s.markWrong);
  const skip = useSession((s) => s.skip);
  const restartSame = useSession((s) => s.restartSame);
  const status = useSession((s) => s.status);

  const isDone = status === "completed";

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={markCorrect} disabled={isDone} variant="default">
        Mark Correct
      </Button>
      <Button onClick={markWrong} disabled={isDone} variant="destructive">
        Mark Wrong
      </Button>
      <Button onClick={skip} disabled={isDone} variant="outline">
        Continue (skip)
      </Button>
      <Button onClick={restartSame} variant="ghost">
        Reset
      </Button>
    </div>
  );
}
