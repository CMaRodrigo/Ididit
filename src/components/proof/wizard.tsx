import { useState } from "react";
import { AlertTriangle, Check, Database, Plus, ScanSearch, Sparkles, Trash2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { goalArchitect, type GoalArchitectResult } from "@/lib/proof/ai";
import type { Provider, VerificationMethod } from "@/lib/proof/types";
import { Button, inputCls, Skeleton } from "./primitives";

export const STEPS = ["Meta", "Objetivos", "Verificação", "Em jogo", "Revisão"] as const;

export function StepHeader({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <span className={cn("transition-colors", i === step ? "font-medium text-foreground" : i < step ? "text-foreground/60" : "text-muted-foreground/50", i !== step && "hidden sm:inline")}>
            {i < step ? <Check className="mr-1 inline size-3.5" /> : null}
            {s}
          </span>
          {i < STEPS.length - 1 && <span className="hidden text-muted-foreground/40 sm:inline">→</span>}
        </div>
      ))}
      <span className="ml-auto tabular text-muted-foreground sm:hidden">{step + 1} / {STEPS.length}</span>
    </div>
  );
}

const SUGGESTIONS = ["Correr 100 km este mês", "Lançar meu portfólio até 31 de outubro", "Estudar espanhol por 20 horas", "Publicar 4 artigos este mês"];

export function GoalArchitect({
  raw,
  setRaw,
  result,
  setResult,
  goal,
  setGoal,
}: {
  raw: string;
  setRaw: (s: string) => void;
  result: GoalArchitectResult | null;
  setResult: (r: GoalArchitectResult | null) => void;
  goal: string;
  setGoal: (s: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    setResult(null);
    const r = await goalArchitect(raw);
    setResult(r);
    setGoal(r.measurableGoal);
    setLoading(false);
  };
  return (
    <div>
      <h1 className="display text-4xl sm:text-5xl">Com o que você vai se comprometer?</h1>
      <textarea
        autoFocus
        value={raw}
        onChange={(e) => { setRaw(e.target.value); setResult(null); }}
        placeholder="Eu quero..."
        rows={2}
        className="mt-10 w-full resize-none border-0 border-b border-border-strong bg-transparent pb-4 text-2xl font-medium tracking-tight placeholder:text-muted-foreground/50 focus:border-foreground focus:outline-none sm:text-3xl"
      />
      <div className="mt-5 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => { setRaw(s); setResult(null); }} className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition hover:border-border-strong hover:text-foreground">
            {s}
          </button>
        ))}
        <button onClick={() => { setRaw("Quero estudar mais"); setResult(null); }} className="rounded-full border border-dashed border-border px-3.5 py-1.5 text-sm text-muted-foreground transition hover:text-foreground">
          Teste uma meta vaga
        </button>
      </div>

      {!result && (
        <Button className="mt-10" size="lg" disabled={raw.trim().length < 4 || loading} onClick={run}>
          <Sparkles className="size-4" /> {loading ? "Analisando…" : "Torne mensurável"}
        </Button>
      )}

      {loading && (
        <div className="panel mt-10 space-y-3 p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Sparkles className="size-4 animate-pulse text-accent" /> O Arquiteto de Metas está conferindo se isso pode ser verificado…</div>
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      )}

      {result && (
        <div className="rise panel mt-10 p-6">
          {result.warning ? (
            <div className="mb-5 flex items-start gap-2.5 text-[15px] text-warning">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" /> {result.warning}
            </div>
          ) : (
            <div className="mb-5 flex items-center gap-2 text-[15px] text-success">
              <Check className="size-4" /> Isso pode ser verificado. Aqui está uma versão mais precisa.
            </div>
          )}
          <div className="eyebrow mb-2">Compromisso sugerido</div>
          <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className={cn(inputCls, "resize-none text-lg font-medium")} />
          <p className="mt-4 text-sm text-muted-foreground">Um compromisso forte tem um resultado mensurável, um prazo e evidências que podem ser conferidas.</p>
        </div>
      )}
    </div>
  );
}

export function CriteriaEditor({ items, setItems }: { items: string[]; setItems: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {items.map((c, i) => (
        <div key={i} className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-1.5 focus-within:border-foreground/40">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3" strokeWidth={3} /></span>
          <input value={c} onChange={(e) => setItems(items.map((x, j) => (j === i ? e.target.value : x)))} className="flex-1 bg-transparent py-1.5 text-[15px] focus:outline-none" />
          <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-muted-foreground opacity-60 transition hover:text-danger group-hover:opacity-100" aria-label="Remover objetivo">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button onClick={() => setItems([...items, ""])} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-3 text-sm text-muted-foreground transition hover:border-border-strong hover:text-foreground">
        <Plus className="size-4" /> Adicionar objetivo
      </button>
    </div>
  );
}

const METHODS: { id: VerificationMethod; icon: typeof Database; title: string; desc: string; extra: string }[] = [
  { id: "ai", icon: ScanSearch, title: "Juiz de IA", desc: "Envie evidências. A IA confere tudo com os objetivos que você definiu.", extra: "Capturas de tela · vídeos · documentos · URLs · repositórios do GitHub" },
  { id: "data", icon: Database, title: "Dados automáticos", desc: "Conecte um serviço externo e verifique o progresso automaticamente.", extra: "GitHub · Strava · Google Calendar" },
  { id: "referee", icon: UserCheck, title: "Árbitro", desc: "Escolha alguém de confiança para revisar suas evidências.", extra: "A pessoa vai receber um link seguro para aprovar ou rejeitar sua prova." },
];

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "github", label: "GitHub" },
  { id: "strava", label: "Strava" },
  { id: "google_calendar", label: "Google Calendar" },
];

export function VerificationMethodSelector({
  methods, setMethods, providers, setProviders, referee, setReferee,
}: {
  methods: VerificationMethod[]; setMethods: (m: VerificationMethod[]) => void;
  providers: Provider[]; setProviders: (p: Provider[]) => void;
  referee: { name: string; email: string }; setReferee: (r: { name: string; email: string }) => void;
}) {
  const toggle = (m: VerificationMethod) => setMethods(methods.includes(m) ? methods.filter((x) => x !== m) : [...methods, m]);
  return (
    <div className="space-y-3">
      {METHODS.map((m) => {
        const on = methods.includes(m.id);
        return (
          <div key={m.id} className={cn("rounded-xl border bg-surface transition-all", on ? "border-foreground shadow-[var(--shadow-soft)]" : "border-border hover:border-border-strong")}>
            <button onClick={() => toggle(m.id)} className="flex w-full items-start gap-4 p-5 text-left">
              <m.icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
              <div className="flex-1">
                <div className="font-semibold tracking-tight">{m.title}</div>
                <div className="mt-1 text-[15px] text-muted-foreground">{m.desc}</div>
                <div className="mt-2 text-xs text-muted-foreground/80">{m.extra}</div>
              </div>
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-md border transition", on ? "border-foreground bg-foreground text-background" : "border-border-strong")}>
                {on && <Check className="size-3.5" strokeWidth={3} />}
              </span>
            </button>
            {on && m.id === "data" && (
              <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
                {PROVIDERS.map((p) => {
                  const sel = providers.includes(p.id);
                  return (
                    <button key={p.id} onClick={() => setProviders(sel ? providers.filter((x) => x !== p.id) : [...providers, p.id])} className={cn("rounded-full border px-3.5 py-1.5 text-sm transition", sel ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground")}>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            )}
            {on && m.id === "referee" && (
              <div className="grid gap-2 border-t border-border px-5 py-4 sm:grid-cols-2">
                <input className={inputCls} placeholder="Nome do árbitro" value={referee.name} onChange={(e) => setReferee({ ...referee, name: e.target.value })} />
                <input className={inputCls} type="email" placeholder="E-mail do árbitro" value={referee.email} onChange={(e) => setReferee({ ...referee, email: e.target.value })} />
              </div>
            )}
          </div>
        );
      })}
      {methods.length > 1 && (
        <p className="pt-1 text-sm text-muted-foreground">
          Verificação híbrida: {methods.includes("referee") && methods.includes("ai") ? "seu árbitro revisa quando a confiança da IA é baixa." : "todos os métodos selecionados precisam concordar."}
        </p>
      )}
    </div>
  );
}

const PRESETS = [25, 50, 100, 250];
const DESTS = ["Doar", "Enviar para um amigo", "Escolher outro destino"];

export function StakeSelector({
  amount, setAmount, dest, setDest, destDetail, setDestDetail,
}: { amount: number; setAmount: (n: number) => void; dest: string; setDest: (s: string) => void; destDetail: string; setDestDetail: (s: string) => void }) {
  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-semibold text-muted-foreground sm:text-7xl">$</span>
        <input
          type="number"
          min={1}
          value={amount || ""}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="tabular w-full bg-transparent text-6xl font-semibold tracking-[-0.05em] focus:outline-none sm:text-8xl"
        />
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setAmount(p)} className={cn("tabular rounded-lg border px-5 py-2.5 text-[15px] font-medium transition", amount === p ? "border-foreground bg-foreground text-background" : "border-border bg-surface hover:border-border-strong")}>
            ${p}
          </button>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-semibold tracking-tight">O que acontece se você falhar?</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {DESTS.map((d) => (
          <button key={d} onClick={() => setDest(d)} className={cn("rounded-lg border px-4 py-3.5 text-left text-[15px] transition", dest === d ? "border-foreground bg-surface font-medium shadow-[var(--shadow-soft)]" : "border-border text-muted-foreground hover:border-border-strong")}>
            {d}
          </button>
        ))}
      </div>
      <input
        className={cn(inputCls, "mt-3")}
        placeholder={dest === "Doar" ? "Instituição (ex.: GiveDirectly)" : dest === "Enviar para um amigo" ? "Nome ou e-mail do amigo" : "Descreva o destino"}
        value={destDetail}
        onChange={(e) => setDestDetail(e.target.value)}
      />
      <p className="mt-8 border-l-2 border-accent pl-4 text-[15px] text-muted-foreground">A ideia não é perder dinheiro. A ideia é tornar a desistência cara.</p>
      <p className="mt-4 text-xs text-muted-foreground">Os pagamentos são simulados nesta prévia. Nenhum valor é cobrado ou retido.</p>
    </div>
  );
}
