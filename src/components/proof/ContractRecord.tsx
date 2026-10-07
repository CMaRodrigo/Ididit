import { useEffect, useRef, useState } from "react";
import { ArrowDown, Check, Circle, ExternalLink, FileText, Lock, Pencil, Trash2, Upload, X } from "lucide-react";
import { BadgeArt } from "./Badge";
import { btn, Button, Field, inputCls } from "./primitives";
import type { Achievement, Commitment, ProofDocument } from "@/lib/proof/types";
import { longDate, money, uid, verificationLabel } from "@/lib/proof/format";
import { deleteFile, getFile, putFile } from "@/lib/proof/documents";
import { useProof } from "@/lib/proof/store";

const steps = ["Goal", "Verification", "Stakes", "Review"] as const;

export function ContractRecord({ c, a }: { c: Commitment; a?: Achievement }) {
  const [step, setStep] = useState<(typeof steps)[number]>("Goal");
  const done = c.status === "passed" || c.status === "failed";
  const met = c.criteria.filter((cr) => cr.status === "met").length;
  const result = c.status === "passed" ? "VERIFIED" : c.status === "failed" ? "NOT COMPLETED" : "IN PROGRESS";
  return (
    <section className="mt-10">
      <nav aria-label="Commitment record" className="grid grid-cols-4 gap-0.5 border-b border-border pb-2" role="tablist">
        {steps.map((s) => <Button key={s} role="tab" aria-selected={s === step} aria-controls="contract-panel" id={`tab-${s}`} variant={s === step ? "primary" : "ghost"} size="sm" className="min-w-0 px-0.5 text-[10px] sm:px-3 sm:text-sm" onClick={() => setStep(s)}>{s}</Button>)}
      </nav>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" /> Original locked contract{c.demo ? ` · Demo record · ${c.datesFromDocuments ? "Dates from the attached documents" : "Dates are illustrative"}` : ""}</p>
      <div id="contract-panel" role="tabpanel" aria-labelledby={`tab-${step}`} className="min-h-64 py-8">
        {step === "Goal" && <div className="space-y-6"><Field label="Original challenge">{c.title}</Field><Meaning key={c.id} c={c} /><div className="border-t border-border pt-6"><h3 className="eyebrow">Objectives</h3>{c.progression && <ol className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:items-center">{c.progression.map((label, i) => <li key={label} className="flex items-center gap-2">{i > 0 && <ArrowDown className="size-3.5 text-muted-foreground sm:-rotate-90" />}<span>{label}</span></li>)}</ol>}<ObjectiveList c={c} /><p className="mt-3 text-xs text-muted-foreground">{met} / {c.criteria.length} objectives completed · locked when the commitment started.</p></div><div className="grid grid-cols-2 gap-5 border-t border-border pt-6 sm:grid-cols-3"><Field label="Started">{longDate(c.lockedAt)}</Field><Field label="Deadline">{longDate(c.deadline)}</Field>{c.completedAt && <Field label="Completed">{longDate(c.completedAt)}</Field>}</div></div>}
        {step === "Verification" && <div className="space-y-6"><div className="grid gap-5 sm:grid-cols-2"><Field label="Verified by">{c.verificationSource ?? verificationLabel(c)}</Field><Field label={done ? "Final result" : "Current status"}><span className={c.status === "passed" ? "text-success" : "text-muted-foreground"}>{result}</span></Field></div><ProofDocuments c={c} />{c.demo && <p className="border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-muted-foreground">Supplied demo outcomes. The evidence entries below are placeholders, not independent verification.</p>}<div><h3 className="eyebrow">Evidence</h3><ul className="mt-3 space-y-2 text-sm text-muted-foreground">{c.evidence.map((e) => <li key={e.id} className="break-words">{e.value}</li>)}{c.evidence.length === 0 && <li>No evidence submitted.</li>}</ul></div><div className="border-t border-border pt-6"><h3 className="eyebrow">Objectives</h3><ObjectiveList c={c} /></div></div>}
        {step === "Stakes" && <div className="space-y-6"><StakeBreakdown c={c} /><Field label="Failure destination">{c.failureDestination}</Field><Field label="Money movement">Simulation only — no real funds moved.</Field></div>}
        {step === "Review" && <div><Field label="Result"><span className={`text-2xl font-semibold ${c.status === "passed" ? "text-success" : "text-muted-foreground"}`}>{result}</span></Field><p className="mt-3 text-sm text-muted-foreground">{met} / {c.criteria.length} objectives completed{c.status === "failed" ? " · No trophy earned." : c.status === "active" ? " · Trophy locked." : "."}</p><ObjectiveList c={c} />{c.contextMetric && <div className="my-8 border-y border-border py-6"><div className="tabular text-5xl font-semibold">{c.contextMetric.value}</div><p className="mt-2 text-sm">{c.contextMetric.label}</p><p className="mt-1 text-xs text-muted-foreground">Original project context, not a live platform metric.</p></div>}{a && c.status === "passed" && <div className="mt-6 flex items-center gap-4 border-t border-border pt-6"><BadgeArt a={a} className="w-20 shrink-0" /><div><div className="eyebrow">Achievement earned</div><p className="mt-1 font-semibold">{a.badgeName}</p></div></div>}{done && <Reflection key={c.id} c={c} />}</div>}
      </div>
    </section>
  );
}

function ObjectiveList({ c }: { c: Commitment }) {
  return <ul className="mt-4 divide-y divide-border">{c.criteria.map((cr) => <li key={cr.id} className="flex items-start gap-3 py-3"><span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${cr.status === "met" ? "bg-success-soft text-success" : "bg-secondary text-muted-foreground"}`}>{cr.status === "met" ? <Check className="size-3.5" /> : cr.status === "failed" ? <X className="size-3.5" /> : <Circle className="size-3.5" />}</span><div className="text-sm leading-relaxed">{cr.description}<span className="ml-2 text-xs text-muted-foreground">{cr.status === "met" ? "Completed" : cr.status === "failed" ? "Not completed" : "Pending"}</span></div></li>)}</ul>;
}

function Reflection({ c }: { c: Commitment }) {
  const { saveReflection } = useProof();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.reflection ?? "");
  return <section className="mt-8 border-t border-border pt-6"><div className="flex items-center justify-between gap-3"><h3 className="eyebrow">{c.id === "detectivesql" ? "Why this mattered" : "Reflection"}</h3><Button variant="ghost" size="sm" onClick={() => { setText(c.reflection ?? ""); setEditing(!editing); }}><Pencil className="size-3.5" />{editing ? "Cancel" : c.reflection ? "Edit" : "Add reflection"}</Button></div>{editing ? <form className="mt-3" onSubmit={(e) => { e.preventDefault(); saveReflection(c.id, text); setEditing(false); }}><label className="sr-only" htmlFor="reflection">Reflection</label><textarea id="reflection" className={inputCls} rows={3} maxLength={600} value={text} onChange={(e) => setText(e.target.value)} /><Button size="sm" className="mt-3" type="submit"><Check className="size-3.5" />Save reflection</Button></form> : c.reflection && <blockquote className="mt-3 text-lg leading-relaxed">“{c.reflection}”</blockquote>}<p className="mt-3 text-xs text-muted-foreground">Personal retrospective · does not affect verification or locked rules.</p></section>;
}

function Meaning({ c }: { c: Commitment }) {
  const { saveMeaning } = useProof();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(c.meaning ?? "");
  return <div><div className="flex items-center justify-between gap-3"><h3 className="eyebrow">Meaning to me</h3><Button variant="ghost" size="sm" onClick={() => { setText(c.meaning ?? ""); setEditing(!editing); }}><Pencil className="size-3.5" />{editing ? "Cancel" : c.meaning ? "Edit" : "Add meaning"}</Button></div>{editing ? <form className="mt-3" onSubmit={(e) => { e.preventDefault(); saveMeaning(c.id, text); setEditing(false); }}><label className="sr-only" htmlFor="meaning">Meaning to me</label><textarea id="meaning" className={inputCls} rows={5} maxLength={1200} value={text} onChange={(e) => setText(e.target.value)} placeholder="What is this project, and why does it matter to you?" /><Button size="sm" className="mt-3" type="submit"><Check className="size-3.5" />Save</Button></form> : <p className={`mt-1.5 text-[15px] leading-relaxed ${c.meaning ? "" : "text-muted-foreground"}`}>{c.meaning || "Describe what this project is and what it means to you."}</p>}</div>;
}

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function ProofDocuments({ c }: { c: Commitment }) {
  const { addDocuments, removeDocument } = useProof();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const docs = c.documents ?? [];
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: ProofDocument[] = [];
    try {
      for (const file of Array.from(files)) {
        if (file.size > MAX_FILE_BYTES) { setError(`${file.name} is larger than 25 MB.`); continue; }
        const id = uid("doc");
        await putFile(id, file);
        added.push({ id, name: file.name, mimeType: file.type || "application/octet-stream", size: file.size, addedAt: new Date().toISOString() });
      }
    } catch {
      setError("This browser could not store the file.");
    }
    if (added.length) addDocuments(c.id, added);
    setBusy(false);
    if (input.current) input.current.value = "";
  }
  return <div><div className="flex items-center justify-between gap-3"><h3 className="eyebrow">Proof documents</h3><label className={btn({ variant: "outline", size: "sm", className: `cursor-pointer ${busy ? "pointer-events-none opacity-40" : ""}` })}><Upload className="size-3.5" />{busy ? "Saving…" : "Add documents"}<input ref={input} type="file" multiple accept="image/*,application/pdf,.doc,.docx" className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files)} /></label></div>{error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}{docs.length > 0 ? <ul className="mt-3 grid gap-3 sm:grid-cols-2">{docs.map((d) => <DocumentItem key={d.id} d={d} onRemove={() => { deleteFile(d.id).catch(() => {}); removeDocument(c.id, d.id); }} />)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No documents yet. Add certificates, screenshots, photos or PDFs that prove this record.</p>}<p className="mt-3 text-xs text-muted-foreground">Added by you as supporting proof{docs.some((d) => !d.src) ? " · uploads are stored in this browser" : ""} · not independently verified.</p></div>;
}

function DocumentItem({ d, onRemove }: { d: ProofDocument; onRemove: () => void }) {
  const [url, setUrl] = useState(d.src);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    if (d.src) return;
    let live = true;
    let objectUrl: string | undefined;
    getFile(d.id).then((blob) => {
      if (!live) return;
      if (!blob) return setMissing(true);
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => live && setMissing(true));
    return () => { live = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [d.id, d.src]);
  const label = d.caption ?? d.name;
  const link = d.href ?? url;
  const image = d.mimeType.startsWith("image/") || d.href ? url : undefined;
  const preview = d.embed ? <LivePreview src={d.embed} width={d.embedWidth ?? 1280} fallback={image} label={label} /> : image ? <img src={image} alt={label} className="aspect-[4/3] w-full object-cover object-top" /> : <div className="grid aspect-[4/3] place-items-center bg-secondary text-muted-foreground"><FileText className="size-8" /></div>;
  return <li className="overflow-hidden rounded-lg border border-border bg-surface">{link ? <a href={link} target="_blank" rel="noreferrer" className="block" aria-label={`Open ${label}`}>{preview}</a> : preview}<div className="flex items-start justify-between gap-2 p-3"><div className="min-w-0"><p className="truncate text-sm font-medium" title={label}>{label}</p><p className="mt-0.5 text-xs text-muted-foreground">{missing ? "File not available in this browser" : d.href ? <span className="inline-flex items-center gap-1"><ExternalLink className="size-3" />{new URL(d.href).hostname.replace(/^www\./, "")}</span> : longDate(d.addedAt)}</p></div>{!d.src && <Button variant="ghost" size="sm" aria-label={`Remove ${label}`} onClick={onRemove}><Trash2 className="size-3.5" /></Button>}</div></li>;
}

// Renders the page at its natural width, scaled down to the card; the screenshot shows until the frame loads.
function LivePreview({ src, width, fallback, label }: { src: string; width: number; fallback?: string | undefined; label: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => entry && setScale(entry.contentRect.width / width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return <div ref={box} className="relative aspect-[4/3] overflow-hidden bg-secondary">{fallback && <img src={fallback} alt={label} className="absolute inset-0 size-full object-cover object-top" />}{scale > 0 && <iframe src={src} title={label} loading="lazy" tabIndex={-1} aria-hidden="true" scrolling="no" onLoad={() => setLoaded(true)} className={`pointer-events-none absolute left-0 top-0 origin-top-left border-0 transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`} style={{ width, height: width * 0.75, transform: `scale(${scale})` }} />}<span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground">Live</span></div>;
}

const stakeState = { met: ["Secured", "text-success"], failed: ["Lost", "text-danger"], progress: ["At stake", "text-foreground"], pending: ["At stake", "text-foreground"] } as const;

// Each objective carries part of the stake; the commitment total is their sum.
function StakeBreakdown({ c }: { c: Commitment }) {
  const sum = (status: Commitment["criteria"][number]["status"][]) => c.criteria.filter((cr) => status.includes(cr.status)).reduce((t, cr) => t + (cr.stake ?? 0), 0);
  const totals = [["Total at stake", c.stake, ""], ["Secured", sum(["met"]), "text-success"], ["Lost", sum(["failed"]), "text-danger"], ["Still at stake", sum(["pending", "progress"]), ""]] as const;
  return <div><div className="grid grid-cols-2 gap-5 sm:grid-cols-4">{totals.filter(([, value], i) => i === 0 || value > 0).map(([label, value, tone]) => <Field key={label} label={label}><span className={`tabular text-2xl font-semibold ${tone}`}>{money(value, c.currency)}</span></Field>)}</div><ul className="mt-6 divide-y divide-border border-y border-border">{c.criteria.map((cr) => { const [state, tone] = stakeState[cr.status]; return <li key={cr.id} className="flex items-start justify-between gap-4 py-3 text-sm"><span className="leading-relaxed">{cr.description}</span><span className="shrink-0 text-right"><span className="tabular block font-semibold">{money(cr.stake ?? 0, c.currency)}</span><span className={`text-xs ${tone}`}>{state}</span></span></li>; })}</ul></div>;
}
