import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock, X } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { btn, Button, inputCls } from "@/components/proof/primitives";
import { CriteriaEditor, GoalArchitect, StakeSelector, StepHeader, VerificationMethodSelector } from "@/components/proof/wizard";
import type { GoalArchitectResult } from "@/lib/proof/ai";
import type { Provider, VerificationMethod } from "@/lib/proof/types";
import { longDate, money, time, uid, verificationLabel } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/new")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "New commitment — I Did It." },
      { name: "description", content: "Define a goal, set the rules, put something on the line." },
      { property: "og:title", content: "New commitment — I Did It." },
      { property: "og:description", content: "Define a goal, set the rules, put something on the line." },
    ],
  }),
  component: NewCommitment,
});

function toLocalInputs(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return { date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`, time: `${pad(d.getHours())}:${pad(d.getMinutes())}` };
}

function NewCommitment() {
  const nav = useNavigate();
  const { lock } = useProof();
  const [step, setStep] = useState(0);
  const [raw, setRaw] = useState("");
  const [ai, setAi] = useState<GoalArchitectResult | null>(null);
  const [goal, setGoal] = useState("");
  const [criteria, setCriteria] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [tm, setTm] = useState("23:59");
  const [methods, setMethods] = useState<VerificationMethod[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [referee, setReferee] = useState({ name: "", email: "" });
  const [amount, setAmount] = useState(100);
  const [dest, setDest] = useState("Donate it");
  const [destDetail, setDestDetail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [locking, setLocking] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);

  const deadlineIso = date ? new Date(`${date}T${tm}`).toISOString() : "";
  const title = ai?.title ?? raw;

  const next = () => {
    if (step === 0 && ai) {
      setCriteria(ai.criteria);
      const l = toLocalInputs(ai.suggestedDeadline);
      setDate(l.date);
      setTm(l.time);
      setMethods(ai.suggestedMethods);
      setProviders(ai.suggestedProviders);
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0 });
  };

  const valid = [
    !!ai && goal.trim().length > 5,
    criteria.filter((c) => c.trim()).length > 0 && !!date && new Date(deadlineIso).getTime() > Date.now(),
    methods.length > 0 && (!methods.includes("data") || providers.length > 0) && (!methods.includes("referee") || (referee.name && /@/.test(referee.email))),
    amount > 0,
    agreed,
  ][step];

  const destination = `${dest}${destDetail ? ` — ${destDetail}` : ""}`;

  const doLock = async () => {
    setLocking(true);
    const id = await lock({
      title,
      measurableGoal: goal,
      deadline: deadlineIso,
      stake: amount,
      currency: "USD",
      failureDestination: destination,
      methods,
      providers: methods.includes("data") ? providers : [],
      referee: methods.includes("referee") ? { ...referee, token: uid("rf"), status: "pending" } : undefined,
      criteria: criteria.filter((c) => c.trim()).map((d) => ({ id: uid("cr"), description: d.trim(), status: "pending" })),
    });
    await new Promise((r) => setTimeout(r, 700));
    setDoneId(id);
  };

  if (doneId) {
    return (
      <Page narrow className="grid min-h-[80vh] place-items-center text-center">
        <div>
          <div className="stamp mx-auto mb-10 inline-flex items-center gap-2 rounded-md border-2 border-foreground px-5 py-2 font-mono text-sm font-medium tracking-[0.2em]">
            <Lock className="size-4" /> LOCKED
          </div>
          <h1 className="display rise text-5xl sm:text-6xl">You're committed.</h1>
          <p className="rise mt-4 text-lg text-muted-foreground" style={{ animationDelay: "120ms" }}>No more editing the rules. Now do the work.</p>
          <Link to="/app/commitments/$id" params={{ id: doneId }} className={cn(btn({ size: "lg" }), "rise mt-10")} style={{ animationDelay: "200ms" }}>
            View commitment <ArrowRight className="size-4" />
          </Link>
        </div>
      </Page>
    );
  }

  return (
    <Page narrow>
      <div className="mb-14 flex items-center gap-4">
        <div className="flex-1"><StepHeader step={step} /></div>
        <button onClick={() => nav({ to: "/app" })} className="text-muted-foreground hover:text-foreground" aria-label="Cancel"><X className="size-5" /></button>
      </div>

      <div key={step} className="rise">
        {step === 0 && <GoalArchitect raw={raw} setRaw={setRaw} result={ai} setResult={setAi} goal={goal} setGoal={setGoal} />}

        {step === 1 && (
          <div>
            <h1 className="display text-4xl sm:text-5xl">What exactly counts as success?</h1>
            <p className="mt-4 text-muted-foreground">{goal}</p>
            <div className="mt-10"><CriteriaEditor items={criteria} setItems={setCriteria} /></div>
            <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-3.5" /> These rules will be locked when the commitment begins.</p>
            <h2 className="mt-12 text-xl font-semibold tracking-tight">Deadline</h2>
            <div className="mt-4 grid max-w-md grid-cols-[1fr_auto] gap-2">
              <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
              <input type="time" className={inputCls} value={tm} onChange={(e) => setTm(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="display text-4xl sm:text-5xl">Who decides whether you did it?</h1>
            <p className="mt-4 text-muted-foreground">Pick one or combine them. There is no "mark as done".</p>
            <div className="mt-10">
              <VerificationMethodSelector methods={methods} setMethods={setMethods} providers={providers} setProviders={setProviders} referee={referee} setReferee={setReferee} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="display mb-10 text-4xl sm:text-5xl">What's on the line?</h1>
            <StakeSelector amount={amount} setAmount={setAmount} dest={dest} setDest={setDest} destDetail={destDetail} setDestDetail={setDestDetail} />
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="display mb-10 text-4xl sm:text-5xl">Your commitment</h1>
            <div className="overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[var(--shadow-lift)]">
              <div className="border-b border-border px-6 py-6 sm:px-8">
                <div className="eyebrow mb-2">Commitment contract</div>
                <div className="text-2xl font-semibold uppercase tracking-tight sm:text-3xl">{title}</div>
                <p className="mt-2 text-[15px] text-muted-foreground">{goal}</p>
              </div>
              <dl className="grid grid-cols-2 gap-px bg-border">
                {[
                  ["Deadline", `${longDate(deadlineIso)}\n${time(deadlineIso)}`],
                  ["Stake", money(amount)],
                  ["If you fail", destination],
                  ["Verification", verificationLabel({ methods, providers: methods.includes("data") ? providers : [] })],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface px-6 py-5 sm:px-8">
                    <dt className="eyebrow mb-1.5">{k}</dt>
                    <dd className="tabular whitespace-pre-line text-[15px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="contract-paper border-t border-border px-6 py-6 sm:px-8">
                <div className="eyebrow mb-3">Success requires</div>
                <ol className="space-y-2 text-[15px] leading-[24px]">
                  {criteria.filter((c) => c.trim()).map((c, i) => (
                    <li key={i} className="flex gap-3"><span className="tabular text-muted-foreground">{i + 1}.</span>{c}</li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="mt-8 font-medium">Once you start, your deadline, criteria and stake cannot be changed.</p>
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-[15px] text-muted-foreground">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 size-4 accent-[var(--color-foreground)]" />
              I understand that the rules are locked once this commitment begins.
            </label>
          </div>
        )}
      </div>

      <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="size-4" /> Back</Button>
        ) : <span />}
        {step < 4 ? (
          <Button size="lg" disabled={!valid} onClick={next}>Continue <ArrowRight className="size-4" /></Button>
        ) : (
          <Button size="xl" variant="accent" disabled={!valid || locking} onClick={doLock}>
            <Lock className="size-4" /> {locking ? "Locking…" : "Lock my commitment"}
          </Button>
        )}
      </div>
    </Page>
  );
}
