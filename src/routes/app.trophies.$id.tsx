import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Download, Link2, Lock, Share2, ShieldCheck, X } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { BadgeArt } from "@/components/proof/Badge";
import { Button, Field, Logo } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";
import { longDate, methodName, money, providerName, verificationLabel } from "@/lib/proof/format";
import type { Achievement, Commitment } from "@/lib/proof/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/trophies/$id")({
  head: () => ({
    meta: [
      { title: "Achievement record — Proof." },
      { name: "description", content: "The permanent, read-only record behind a verified achievement." },
      { property: "og:title", content: "Achievement record — Proof." },
      { property: "og:description", content: "The permanent, read-only record behind a verified achievement." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Record,
});

const steps = ["Goal", "Rules", "Verification", "Stakes", "Review"] as const;
type Step = (typeof steps)[number];

function Record() {
  const { id } = Route.useParams();
  const { achievements, commitments, hydrated } = useProof();
  const a = achievements.find((x) => x.id === id);
  const c = a && commitments.find((x) => x.id === a.commitmentId);
  const [step, setStep] = useState<Step>("Goal");
  const [share, setShare] = useState(false);

  if (!a || !c)
    return (
      <Page narrow>
        <p className="text-muted-foreground">{hydrated ? "This achievement could not be found." : "Loading…"}</p>
        <Link to="/app/profile" className="mt-4 inline-block text-sm underline">Back to Trophy Room</Link>
      </Page>
    );

  return (
    <Page narrow>
      <Link to="/app/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Trophy Room
      </Link>

      <header className="mt-8 flex flex-col items-center text-center">
        <BadgeArt a={a} className="w-44 sm:w-52" />
        <h1 className="mt-8 text-3xl font-semibold tracking-[0.06em] sm:text-4xl">{a.badgeName}</h1>
        <p className="mt-2 text-muted-foreground">{a.badgeSubtitle}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 font-medium tracking-wide text-success">
            <ShieldCheck className="size-4" /> VERIFIED
          </span>
          <span className="text-muted-foreground">Completed {longDate(a.earnedAt)}</span>
        </div>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShare(true)}>
          <Share2 className="size-4" /> Share achievement
        </Button>
      </header>

      <div className="mt-14">
        <div className="eyebrow mb-3 text-center">The proof behind it</div>
        <nav className="flex items-center justify-between gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={cn("flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition", step === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <span className="tabular text-xs opacity-60">{i + 1}</span> {s}
            </button>
          ))}
        </nav>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" /> Read-only. This is the original locked contract.
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface p-6 sm:p-8">
          {step === "Goal" && <GoalTab c={c} />}
          {step === "Rules" && <RulesTab c={c} />}
          {step === "Verification" && <VerificationTab c={c} />}
          {step === "Stakes" && <StakesTab c={c} />}
          {step === "Review" && <ReviewTab c={c} a={a} />}
        </div>
      </div>

      {share && <ShareDialog a={a} c={c} onClose={() => setShare(false)} />}
    </Page>
  );
}

function GoalTab({ c }: { c: Commitment }) {
  return (
    <div className="space-y-6">
      <Field label="Original goal">“{c.title}”</Field>
      <Field label="Measurable goal"><span className="font-normal">{c.measurableGoal}</span></Field>
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
        <Field label="Start">{longDate(c.lockedAt)}</Field>
        <Field label="Deadline">{longDate(c.deadline)}</Field>
        <Field label="Completed">{longDate(c.completedAt ?? c.deadline)}</Field>
      </div>
    </div>
  );
}

function RulesTab({ c }: { c: Commitment }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">The rules you committed to</h3>
      <ul className="mt-4 divide-y divide-border">
        {c.criteria.map((cr) => (
          <li key={cr.id} className="flex items-center gap-3 py-3">
            <span className="grid size-6 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3.5" strokeWidth={2.5} /></span>
            <span className="text-[15px]">{cr.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" /> These rules were locked when the commitment started — {longDate(c.lockedAt)}.</p>
    </div>
  );
}

function VerificationTab({ c }: { c: Commitment }) {
  const run = c.runs[c.runs.length - 1];
  const conf = run ? Math.round((run.verdicts.reduce((n, v) => n + v.confidence, 0) / run.verdicts.length) * (run.verdicts[0]!.confidence <= 1 ? 100 : 1)) : null;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Verification method">{verificationLabel(c)}</Field>
        <Field label="Final result"><span className="text-success">VERIFIED</span></Field>
      </div>
      <div className="border-t border-border pt-6">
        <div className="eyebrow mb-2">Evidence</div>
        <ul className="space-y-1 text-[15px]">
          {c.headline && <li><span className="tabular font-medium">{c.headline.current} {c.headline.unit}</span> <span className="text-muted-foreground">recorded (target {c.headline.target})</span></li>}
          {c.providers.map((p) => <li key={p} className="text-muted-foreground">Data pulled from {providerName(p)}</li>)}
          {c.referee && <li className="text-muted-foreground">Referee {c.referee.name}: {c.referee.status}{c.referee.reason ? ` — “${c.referee.reason}”` : ""}</li>}
          {c.evidence.map((e) => <li key={e.id} className="truncate text-muted-foreground">{e.type}: {e.value}</li>)}
          <li className="text-muted-foreground">{longDate(c.lockedAt)} → {longDate(c.completedAt ?? c.deadline)}</li>
        </ul>
      </div>
      {run && (
        <div className="border-t border-border pt-6">
          <div className="flex items-baseline justify-between">
            <div className="eyebrow">AI Judge</div>
            <div className="text-sm text-muted-foreground">{run.verdicts.filter((v) => v.status === "verified").length} / {run.verdicts.length} verified · {conf}% confidence</div>
          </div>
          <ul className="mt-3 space-y-3">
            {run.verdicts.map((v) => (
              <li key={v.criterionId} className="text-sm">
                <div className="font-medium">{c.criteria.find((cr) => cr.id === v.criterionId)?.description}</div>
                <div className="text-muted-foreground">{v.reasoning}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Methods: {c.methods.map(methodName).join(", ")}</p>
    </div>
  );
}

function StakesTab({ c }: { c: Commitment }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount at stake">{money(c.stake, c.currency)}</Field>
        <Field label="Outcome"><span className="text-success">Completed — money returned</span></Field>
      </div>
      <Field label="Failure destination"><span className="font-normal text-muted-foreground">{c.failureDestination}</span></Field>
      <p className="rounded-lg bg-success-soft px-4 py-3 text-sm text-success">No consequence was triggered because the commitment was successfully completed.</p>
    </div>
  );
}

function ReviewTab({ c, a }: { c: Commitment; a: Achievement }) {
  const rows: [string, string][] = [
    ["Result", "PASSED"],
    ...(c.headline ? ([["Goal", `${c.headline.target} ${c.headline.unit}`], ["Achieved", `${c.headline.current} ${c.headline.unit}`]] as [string, string][]) : []),
    ["Deadline", longDate(c.deadline)],
    ["Completed", longDate(c.completedAt ?? c.deadline)],
    ["Verification", verificationLabel(c)],
    ["Stake", money(c.stake, c.currency)],
    ["Outcome", "Returned"],
  ];
  return (
    <div>
      <h3 className="text-lg font-semibold uppercase tracking-[0.04em]">{c.title}</h3>
      <dl className="mt-4 divide-y divide-border">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2.5 text-[15px]">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="tabular font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
        <BadgeArt a={a} className="w-16" />
        <div>
          <div className="eyebrow">Achievement earned</div>
          <div className="mt-1 font-semibold tracking-[0.06em]">{a.badgeName}</div>
        </div>
      </div>
    </div>
  );
}

function ShareDialog({ a, c, onClose }: { a: Achievement; c: Commitment; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-[var(--shadow-lift)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-medium">Share achievement</div>
          <button onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="mt-4 flex aspect-[4/5] flex-col items-center justify-between rounded-xl bg-primary p-7 text-center text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-60">Verified achievement</div>
          <div className="flex flex-col items-center">
            <BadgeArt a={a} className="w-32" />
            <div className="mt-5 text-2xl font-semibold tracking-[0.06em]">{a.badgeName}</div>
            {c.headline && <div className="mt-1 tabular text-sm opacity-80">{c.headline.target} {c.headline.unit.toUpperCase()}</div>}
            <div className="mt-3 text-xs opacity-60">Completed {longDate(a.earnedAt)} · Verified by {verificationLabel(c)}</div>
          </div>
          <Logo className="text-base" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copy}><Link2 className="size-4" /> {copied ? "Copied" : "Copy link"}</Button>
          <Button variant="outline" onClick={() => setNote("Image download arrives with online accounts.")}><Download className="size-4" /> Download</Button>
        </div>
        {note && <p className="mt-2 text-center text-xs text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
