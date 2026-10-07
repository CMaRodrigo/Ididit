import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Commitment } from "@/lib/proof/types";
import { money, shortDate, verificationLabel } from "@/lib/proof/format";
import { DeadlineLabel, ProgressBar, StatusBadge } from "./primitives";

export function CommitmentCard({ c }: { c: Commitment }) {
  const met = c.criteria.filter((x) => x.status === "met").length;
  const done = c.status === "passed" || c.status === "failed";
  const h = c.headline;
  return (
    <Link
      to="/app/commitments/$id"
      params={{ id: c.id }}
      className="group panel block p-5 transition-all hover:-translate-y-px hover:shadow-[var(--shadow-lift)] sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <StatusBadge status={c.status} />
            {!done && <DeadlineLabel iso={c.deadline} />}
            {done && <span className="text-sm text-muted-foreground">Ended {shortDate(c.deadline)}</span>}
          </div>
          <h3 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{c.title}</h3>
          <div className="mt-3 max-w-md">
            {h ? (
              <>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="tabular font-medium">
                    {h.current} / {h.target} {h.unit}
                  </span>
                  <span className="text-muted-foreground">{Math.round(Math.min(100, (h.current / h.target) * 100))}%</span>
                </div>
                <ProgressBar value={h.current} max={h.target} tone={c.status === "failed" ? "danger" : c.status === "passed" ? "success" : "accent"} />
              </>
            ) : (
              <>
                <div className="mb-1.5 text-sm">
                  <span className="tabular font-medium">
                    {met} / {c.criteria.length}
                  </span>{" "}
                  <span className="text-muted-foreground">objectives verified</span>
                </div>
                <ProgressBar value={met} max={c.criteria.length} tone={c.status === "failed" ? "danger" : c.status === "passed" ? "success" : "accent"} />
              </>
            )}
          </div>
        </div>
        <div className="flex items-end justify-between gap-8 border-t border-border pt-4 sm:block sm:border-0 sm:pt-0 sm:text-right">
          <div>
            <div className="eyebrow">
              {c.status === "passed" ? (c.demo ? "Secured" : "Returned") : c.status === "failed" ? (c.demo ? "Total stake" : "Consequence") : "At stake"}
            </div>
            <div className={`tabular text-xl font-semibold tracking-tight ${c.status === "failed" ? "text-danger" : c.status === "passed" ? "text-success" : ""}`}>
              {money(c.stake, c.currency)}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground sm:justify-end">
            {verificationLabel(c)}
            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
