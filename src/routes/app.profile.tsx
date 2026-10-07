import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { PastAttempts } from "@/components/proof/PastAttempts";
import { TrophyRoom } from "@/components/proof/TrophyRoom";
import { btn, ProgressBar } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [
    { title: "Sala de Troféus do Rodrigo — I Did It." },
    { name: "description", content: "Uma linha do tempo pessoal de conquistas verificadas, compromissos em andamento e tentativas anteriores honestas." },
    { property: "og:title", content: "Sala de Troféus do Rodrigo — I Did It." },
    { property: "og:description", content: "O troféu é o símbolo. A prova está por trás dele." },
    { property: "og:type", content: "profile" }, { name: "twitter:card", content: "summary" },
  ] }), component: Profile,
});

function Profile() {
  const { user, commitments, achievements } = useProof();
  const passed = commitments.filter((c) => c.status === "passed");
  const active = commitments.filter((c) => c.status === "active" || c.status === "awaiting_verification");
  const failed = commitments.filter((c) => c.status === "failed");
  return <Page>
    <header className="border-b border-border pb-8">
      <div className="flex items-center gap-4"><div className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-xl font-medium text-primary-foreground">{user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div><div><h1 className="display text-4xl sm:text-5xl">{user.name}</h1><p className="mt-2 text-sm text-muted-foreground sm:text-base">{user.bio}</p></div></div>
      <p className="mt-5 text-base text-muted-foreground">Coisas que eu disse que faria — e a prova por trás delas.</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm"><span><strong className="tabular font-semibold">{passed.length}</strong> {passed.length === 1 ? "conquista verificada" : "conquistas verificadas"}</span><span><strong className="tabular font-semibold">{failed.length}</strong> {failed.length === 1 ? "desafio não concluído" : "desafios não concluídos"}</span><span><strong className="tabular font-semibold">{active.length}</strong> {active.length === 1 ? "compromisso ativo" : "compromissos ativos"}</span></div>
    </header>
    {active.map((c) => { const met = c.criteria.filter((cr) => cr.status === "met").length; return <section key={c.id} className="grid items-center gap-6 border-b border-border py-8 sm:grid-cols-[1fr_120px]">
      <div><div className="eyebrow">Compromisso atual</div><div className="mt-3 flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold">{c.title}</h2><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-accent" />Em andamento</span></div><div className="mt-4 flex max-w-md items-center gap-4"><span className="tabular shrink-0 text-sm">{met} / {c.criteria.length} objetivos</span><ProgressBar value={met} max={c.criteria.length} /></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">{c.id === "behring-founders" && ["Candidatar-se", "Estudar a fundo", "Conversar com a Bibi"].map((label) => <span key={label} className="flex items-center gap-1"><Check className="size-3 text-success" />{label}</span>)}</div><Link to="/app/commitments/$id" params={{ id: c.id }} className={btn({ variant: "outline", size: "sm", className: "mt-5" })}>Ver compromisso <ArrowRight className="size-3.5" /></Link></div>
      <div className="hidden text-center sm:block"><div className="mx-auto grid size-20 place-items-center text-muted-foreground"><Lock className="size-8" strokeWidth={1.25} /></div><span className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground"><Lock className="size-3" />Troféu bloqueado</span></div>
    </section>; })}
    <TrophyRoom />
    <PastAttempts />
  </Page>;
}
