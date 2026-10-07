import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Copy, Lock } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/proof/Page";
import { btn, CriteriaList, DeadlineLabel, Field, MoneyAtStake, StatusBadge } from "@/components/proof/primitives";
import { CommitmentTimeline } from "@/components/proof/CommitmentTimeline";
import { longDate, shortDate, verificationLabel } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";
import { ContractRecord } from "@/components/proof/ContractRecord";

export const Route = createFileRoute("/app/commitments/$id/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Commitment — Proof." },
      { name: "description", content: "Locked objectives, live progress and proof for this commitment." },
      { property: "og:title", content: "Commitment — Proof." },
      { property: "og:description", content: "Locked objectives, live progress and proof for this commitment." },
    ],
  }),
  component: Detail,
});

function NotFound() {
  return (
    <Page narrow className="text-center">
      <p className="text-muted-foreground">This commitment doesn't exist.</p>
      <Link to="/app" className={btn({ variant: "outline", className: "mt-6" })}>Back home</Link>
    </Page>
  );
}

function Detail() {
  const { id } = Route.useParams();
  const { get, activity, hydrated } = useProof();
  const c = get(id);
  if (!c) return hydrated ? <NotFound /> : null;
  const done = c.status === "passed" || c.status === "failed";
  const lastRun = c.runs[c.runs.length - 1];

  return (
    <Page narrow>
      <Link to="/app/commitments" className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Commitments
      </Link>
      <div className="flex flex-wrap items-center gap-3">
        {c.demo && c.status === "failed" ? <span className="text-sm text-muted-foreground">Not completed</span> : <StatusBadge status={c.status} />}
        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="size-3" /> Objectives locked</span>
      </div>
      <h1 className="display mt-4 text-4xl uppercase sm:text-5xl">{c.title}</h1>
      <p className="mt-3 text-muted-foreground">{c.measurableGoal}</p>

      {c.demo ? <ContractRecord c={c} /> : <>
      <div className="mt-10 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-3">
        <div>
          <div className="eyebrow mb-1.5">Deadline</div>
          <div className="text-[15px] font-medium">{shortDate(c.deadline)}</div>
          {!done && <DeadlineLabel iso={c.deadline} />}
        </div>
        <div>
          <div className="eyebrow mb-1.5">{c.status === "passed" ? "Returned" : c.status === "failed" ? "Consequence" : "At stake"}</div>
          <MoneyAtStake amount={c.stake} currency={c.currency} tone={c.status === "failed" ? "danger" : c.status === "passed" ? "success" : "default"} />
        </div>
        <Field label="Verification">{verificationLabel(c)}</Field>
      </div>

      <h2 className="eyebrow mb-1 mt-12">Success criteria</h2>
      <CriteriaList criteria={c.criteria} />

      {!done && (
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/app/commitments/$id/proof" params={{ id: c.id }} className={btn({ size: "xl", className: "flex-1" })}>
            Submit proof <ArrowRight className="size-4" />
          </Link>
          {lastRun && (
            <Link to="/app/commitments/$id/result" params={{ id: c.id }} className={btn({ variant: "outline", size: "xl" })}>
              Last verification
            </Link>
          )}
        </div>
      )}
      {done && lastRun && (
        <Link to="/app/commitments/$id/result" params={{ id: c.id }} className={btn({ variant: "outline", size: "lg", className: "mt-10" })}>
          View verification result
        </Link>
      )}

      {c.referee && (
        <div className="panel mt-10 flex flex-wrap items-center gap-4 p-5">
          <div className="flex-1">
            <div className="eyebrow mb-1">Referee</div>
            <div className="text-[15px] font-medium">{c.referee.name} <span className="font-normal text-muted-foreground">· {c.referee.email}</span></div>
            <div className={cn("mt-1 text-sm", c.referee.status === "approved" ? "text-success" : c.referee.status === "rejected" ? "text-danger" : "text-muted-foreground")}>
              {c.referee.status === "pending" ? "Awaiting review" : c.referee.status === "approved" ? "Approved your proof" : `Rejected: ${c.referee.reason}`}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { navigator.clipboard?.writeText(`${location.origin}/referee/${c.referee?.token}`); toast("Secure referee link copied"); }}
              className={btn({ variant: "outline", size: "sm" })}
            >
              <Copy className="size-3.5" /> Copy link
            </button>
            <Link to="/referee/$token" params={{ token: c.referee.token }} className={btn({ variant: "ghost", size: "sm" })}>Preview</Link>
          </div>
        </div>
      )}

      <div className="mt-14 rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-sm font-semibold">Commitment contract</h2>
          <Lock className="size-4 text-muted-foreground" />
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 px-6 py-5 sm:grid-cols-3">
          <Field label="Created">{longDate(c.createdAt)}</Field>
          <Field label="Locked">{longDate(c.lockedAt)}</Field>
          <Field label="Deadline">{longDate(c.deadline)}</Field>
          <Field label="Stake">{`$${c.stake}`}</Field>
          <Field label="If you fail">{c.failureDestination}</Field>
          <Field label="Objectives">Locked · cannot be edited</Field>
        </dl>
      </div>

      <h2 className="eyebrow mb-4 mt-14">Audit trail</h2>
      <CommitmentTimeline events={activity.filter((e) => e.commitmentId === c.id)} />
      </>}
    </Page>
  );
}
