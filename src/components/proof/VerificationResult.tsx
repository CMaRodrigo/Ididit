import type { Criterion, Verdict } from "@/lib/proof/types";
import { cn } from "@/lib/utils";
import { verdictMeta } from "./primitives";

export function VerificationResult({ criteria, verdicts }: { criteria: Criterion[]; verdicts: Verdict[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {verdicts.map((v, i) => {
        const cr = criteria.find((c) => c.id === v.criterionId);
        const m = verdictMeta[v.status];
        return (
          <li key={v.criterionId} className="rise flex gap-4 py-6" style={{ animationDelay: `${i * 90}ms` }}>
            <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", m.cls)}>{m.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-medium">{cr?.description}</span>
                <span className={cn("text-sm font-medium", v.status === "verified" ? "text-success" : v.status === "needs_review" ? "text-warning" : "text-danger")}>{m.label}</span>
              </div>
              {v.evidenceUsed.length > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Evidence reviewed: <span className="text-foreground">{v.evidenceUsed.join(", ")}</span>
                </div>
              )}
              <p className="mt-1.5 text-sm text-muted-foreground">{v.reasoning}</p>
              <div className="tabular mt-2 text-xs text-muted-foreground/80">Confidence {Math.round(v.confidence * 100)}%</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
