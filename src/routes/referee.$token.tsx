import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock, X } from "lucide-react";
import { Button, inputCls, Logo } from "@/components/proof/primitives";
import { shortDate } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referee/$token")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Verifique um compromisso — I Did It." },
      { name: "description", content: "Pediram que você revise a prova de um compromisso." },
      { property: "og:title", content: "Verifique um compromisso — I Did It." },
      { property: "og:description", content: "Pediram que você revise a prova de um compromisso." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Referee,
});

function Referee() {
  const { token } = Route.useParams();
  const { commitments, user, refereeDecision, hydrated } = useProof();
  const c = commitments.find((x) => x.referee?.token === token);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!hydrated) return null;
  if (!c) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">Este link é inválido ou expirou.</div>;
  }
  const decided = c.referee!.status !== "pending";

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Logo />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" /> Link seguro de árbitro</span>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-10">
        <h1 className="display text-4xl sm:text-5xl">{user.name} pediu que você verifique um compromisso.</h1>

        <div className="panel mt-12 divide-y divide-border">
          <div className="p-6">
            <div className="eyebrow mb-2">Meta</div>
            <div className="text-xl font-semibold tracking-tight">{c.title} até {shortDate(c.deadline)}</div>
          </div>
          <div className="p-6">
            <div className="eyebrow mb-2">Critérios de sucesso</div>
            <p className="text-[15px]">{c.measurableGoal}</p>
          </div>
          <div className="p-6">
            <div className="eyebrow mb-2">Evidências enviadas</div>
            {c.evidence.length > 0 ? (
              <ul className="space-y-1 text-[15px]">{c.evidence.map((e) => <li key={e.id}>{e.value}</li>)}</ul>
            ) : c.headline ? (
              <div>
                <div className="text-[15px]">{c.providers[0] ? "Resumo de atividades do Strava" : "Dados monitorados"}</div>
                <div className="tabular mt-1 text-3xl font-semibold tracking-tight">{c.headline.current} {c.headline.unit}</div>
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma evidência ainda.</p>
            )}
          </div>
        </div>

        {decided ? (
          <div className={cn("mt-10 rounded-xl p-6", c.referee!.status === "approved" ? "bg-success-soft text-success" : "bg-danger-soft text-danger")}>
            <div className="font-semibold">{c.referee!.status === "approved" ? "Você aprovou esta prova." : "Você rejeitou esta prova."}</div>
            {c.referee!.reason && <p className="mt-1 text-sm">“{c.referee!.reason}”</p>}
            <p className="mt-2 text-sm text-muted-foreground">Avisamos {user.name}. Obrigado por manter o compromisso honesto.</p>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight">Esta evidência cumpre o compromisso?</h2>
            {rejecting ? (
              <div className="mt-6">
                <textarea autoFocus className={cn(inputCls, "min-h-24")} placeholder="Motivo da rejeição (obrigatório)" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="mt-3 flex gap-2">
                  <Button variant="danger" size="lg" disabled={reason.trim().length < 3} onClick={() => refereeDecision(token, false, reason.trim())}>Confirmar rejeição</Button>
                  <Button variant="ghost" size="lg" onClick={() => setRejecting(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="success" size="xl" onClick={() => refereeDecision(token, true)}><Check className="size-4" /> Aprovar</Button>
                <Button variant="outline" size="xl" onClick={() => setRejecting(true)}><X className="size-4" /> Rejeitar</Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
