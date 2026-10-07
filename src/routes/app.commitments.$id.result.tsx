import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { btn } from "@/components/proof/primitives";
import { VerificationResult } from "@/components/proof/VerificationResult";
import { daysLeft, money } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";
import { ContractRecord } from "@/components/proof/ContractRecord";

export const Route = createFileRoute("/app/commitments/$id/result")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Verification result — Proof." },
      { name: "description", content: "How your evidence measured up against the locked rules." },
      { property: "og:title", content: "Verification result — Proof." },
      { property: "og:description", content: "How your evidence measured up against the locked rules." },
    ],
  }),
  component: Result,
});

function Result() {
  const { id } = Route.useParams();
  const { get } = useProof();
  const c = get(id);
  if (!c) return null;
  if (c.demo) return <Page narrow><Link to="/app/commitments/$id" params={{ id: c.id }} className="text-sm text-muted-foreground">← {c.title}</Link><h1 className="mt-6 text-3xl font-semibold">{c.status === "failed" ? "Not completed" : c.status === "passed" ? "Verified" : "In progress"}</h1><ContractRecord c={c} /></Page>;
  const run = c.runs[c.runs.length - 1];
  if (!run) return <Page narrow><p className="text-muted-foreground">No verification yet.</p></Page>;
  const ok = run.verdicts.filter((v) => v.status === "verified").length;
  const left = daysLeft(c.deadline);

  return (
    <Page narrow>
      <Link to="/app/commitments/$id" params={{ id: c.id }} className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {c.title}
      </Link>
      <div className="eyebrow">Verification complete</div>
      <h1 className="display mt-3 text-5xl sm:text-6xl">
        <span className="tabular">{ok} / {run.verdicts.length}</span> <span className="text-muted-foreground">objectives verified</span>
      </h1>

      <div className="mt-12">
        <VerificationResult criteria={c.criteria} verdicts={run.verdicts} />
      </div>

      <div className="mt-12">
        {c.status === "passed" && (
          <div className="rise rounded-xl border border-success/30 bg-success-soft p-8">
            <div className="stamp inline-block rounded border-2 border-success px-3 py-1 font-mono text-sm font-semibold tracking-[0.2em] text-success">PASSED</div>
            <h2 className="display mt-6 text-4xl">You followed through.</h2>
            <p className="mt-2 text-lg"><span className="tabular font-semibold text-success">{money(c.stake, c.currency)}</span> returned <span className="text-sm text-muted-foreground">(simulated)</span></p>
          </div>
        )}
        {c.status === "failed" && (
          <div className="rise rounded-xl border border-danger/30 bg-danger-soft p-8">
            <div className="stamp inline-block rounded border-2 border-danger px-3 py-1 font-mono text-sm font-semibold tracking-[0.2em] text-danger">FAILED</div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div><dt className="eyebrow">Amount</dt><dd className="tabular text-2xl font-semibold text-danger">{money(c.stake, c.currency)}</dd></div>
              <div><dt className="eyebrow">Outcome</dt><dd className="font-medium">Stake destination initiated <span className="text-sm font-normal text-muted-foreground">(simulated)</span></dd></div>
            </dl>
          </div>
        )}
        {(c.status === "active" || c.status === "awaiting_verification") && (
          <div className="rise rounded-xl border border-border-strong p-8">
            <div className="font-mono text-sm font-semibold tracking-[0.15em]">COMMITMENT NOT YET VERIFIED</div>
            <p className="mt-3 text-lg text-muted-foreground">
              You still have <span className="font-medium text-foreground">{left} day{left === 1 ? "" : "s"}</span> to submit additional evidence.
            </p>
            <Link to="/app/commitments/$id/proof" params={{ id: c.id }} className={btn({ size: "lg", className: "mt-6" })}>
              <Plus className="size-4" /> Add evidence
            </Link>
          </div>
        )}
      </div>
    </Page>
  );
}
