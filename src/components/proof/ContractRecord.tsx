import { useState } from "react";
import { ArrowDown, Check, Circle, Lock, Pencil, X } from "lucide-react";
import { BadgeArt } from "./Badge";
import { Button, Field, inputCls } from "./primitives";
import type { Achievement, Commitment } from "@/lib/proof/types";
import { longDate, money, verificationLabel } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";

const steps = ["Goal", "Rules", "Verification", "Stakes", "Review"] as const;

export function ContractRecord({ c, a }: { c: Commitment; a?: Achievement }) {
  const [step, setStep] = useState<(typeof steps)[number]>("Goal");
  const done = c.status === "passed" || c.status === "failed";
  const met = c.criteria.filter((cr) => cr.status === "met").length;
  const result = c.status === "passed" ? "VERIFIED" : c.status === "failed" ? "NOT COMPLETED" : "IN PROGRESS";
  return (
    <section className="mt-10">
      <nav aria-label="Commitment record" className="grid grid-cols-5 gap-0.5 border-b border-border pb-2" role="tablist">
        {steps.map((s) => <Button key={s} role="tab" aria-selected={s === step} aria-controls="contract-panel" id={`tab-${s}`} variant={s === step ? "primary" : "ghost"} size="sm" className="min-w-0 px-0.5 text-[10px] sm:px-3 sm:text-sm" onClick={() => setStep(s)}>{s}</Button>)}
      </nav>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" /> Original locked contract{c.demo ? " · Demo record · Dates are illustrative" : ""}</p>
      <div id="contract-panel" role="tabpanel" aria-labelledby={`tab-${step}`} className="min-h-64 py-8">
        {step === "Goal" && <div className="space-y-6"><Field label="Original challenge">{c.title}</Field><Field label="Original goal"><span className="font-normal leading-relaxed">{c.measurableGoal}</span></Field><div className="grid grid-cols-2 gap-5 border-t border-border pt-6 sm:grid-cols-3"><Field label="Started">{longDate(c.lockedAt)}</Field><Field label="Deadline">{longDate(c.deadline)}</Field>{c.completedAt && <Field label="Completed">{longDate(c.completedAt)}</Field>}</div></div>}
        {step === "Rules" && <div><h2 className="text-lg font-semibold">The rules you committed to</h2>{c.progression && <ol className="mt-5 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">{c.progression.map((label, i) => <li key={label} className="flex items-center gap-2">{i > 0 && <ArrowDown className="size-3.5 text-muted-foreground sm:-rotate-90" />}<span>{label}</span></li>)}</ol>}<RuleList c={c} /><p className="mt-4 text-xs text-muted-foreground">{met} / {c.criteria.length} criteria completed. Locked rules cannot be changed.</p></div>}
        {step === "Verification" && <div className="space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Verified by">{c.verificationSource ?? verificationLabel(c)}</Field><Field label={done ? "Final result" : "Current status"}><span className={c.status === "passed" ? "text-success" : "text-muted-foreground"}>{result}</span></Field></div>{c.demo && <p className="border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-muted-foreground">Supplied demo outcomes. These evidence entries are placeholders, not uploaded documents or independent verification.</p>}<div><h3 className="eyebrow">Evidence</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{c.evidence.map((e) => <li key={e.id} className="break-words">{e.value}</li>)}{c.evidence.length === 0 && <li>No evidence submitted.</li>}</ul></div><div className="border-t border-border pt-6"><h3 className="eyebrow">Individual criteria</h3><RuleList c={c} /></div></div>}
        {step === "Stakes" && <div className="space-y-6"><Field label="Amount at stake">{c.demo ? "Not specified" : money(c.stake, c.currency)}</Field><Field label="Failure destination">{c.failureDestination}</Field><Field label="Money movement">{c.demo ? "None — no financial stake was supplied for this demo." : "Simulation only — no real funds moved."}</Field></div>}
        {step === "Review" && <div><Field label="Result"><span className={`text-2xl font-semibold ${c.status === "passed" ? "text-success" : "text-muted-foreground"}`}>{result}</span></Field><p className="mt-3 text-sm text-muted-foreground">{met} / {c.criteria.length} criteria completed{c.status === "failed" ? " · No trophy earned." : c.status === "active" ? " · Trophy locked." : "."}</p><RuleList c={c} />{c.contextMetric && <div className="my-8 border-y border-border py-6"><div className="tabular text-5xl font-semibold">{c.contextMetric.value}</div><p className="mt-2 text-sm">{c.contextMetric.label}</p><p className="mt-1 text-xs text-muted-foreground">Original project context, not a live platform metric.</p></div>}{a && c.status === "passed" && <div className="mt-6 flex items-center gap-4 border-t border-border pt-6"><BadgeArt a={a} className="w-20 shrink-0" /><div><div className="eyebrow">Achievement earned</div><p className="mt-1 font-semibold">{a.badgeName}</p></div></div>}{done && <Reflection key={c.id} c={c} />}</div>}
      </div>
    </section>
  );
}

function RuleList({ c }: { c: Commitment }) {
  return <ul className="mt-4 divide-y divide-border">{c.criteria.map((cr) => <li key={cr.id} className="flex items-start gap-3 py-3"><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${cr.status === "met" ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"}`}>{cr.status === "met" ? <Check className="size-3.5" /> : cr.status === "failed" ? <X className="size-3.5" /> : <Circle className="size-3.5" />}</span><div className="text-sm leading-relaxed">{cr.description}<span className="ml-2 text-xs text-muted-foreground">{cr.status === "met" ? "Completed" : cr.status === "failed" ? "Not completed" : "Pending"}</span></div></li>)}</ul>;
}

function Reflection({ c }: { c: Commitment }) {
  const { saveReflection } = useProof();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.reflection ?? "");
  return <section className="mt-8 border-t border-border pt-6"><div className="flex items-center justify-between gap-3"><h3 className="eyebrow">{c.id === "detectivesql" ? "Why this mattered" : "Reflection"}</h3><Button variant="ghost" size="sm" onClick={() => { setText(c.reflection ?? ""); setEditing(!editing); }}><Pencil className="size-3.5" />{editing ? "Cancel" : c.reflection ? "Edit" : "Add reflection"}</Button></div>{editing ? <form className="mt-3" onSubmit={(e) => { e.preventDefault(); saveReflection(c.id, text); setEditing(false); }}><label className="sr-only" htmlFor="reflection">Reflection</label><textarea id="reflection" className={inputCls} rows={3} maxLength={600} value={text} onChange={(e) => setText(e.target.value)} /><Button size="sm" className="mt-3" type="submit"><Check className="size-3.5" />Save reflection</Button></form> : c.reflection && <blockquote className="mt-3 text-lg leading-relaxed">“{c.reflection}”</blockquote>}<p className="mt-3 text-xs text-muted-foreground">Personal retrospective · does not affect verification or locked rules.</p></section>;
}