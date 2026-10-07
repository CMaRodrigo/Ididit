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
      { title: "Resultado da verificação — I Did It." },
      { name: "description", content: "Como suas evidências se saíram diante dos objetivos travados." },
      { property: "og:title", content: "Resultado da verificação — I Did It." },
      { property: "og:description", content: "Como suas evidências se saíram diante dos objetivos travados." },
    ],
  }),
  component: Result,
});

function Result() {
  const { id } = Route.useParams();
  const { get } = useProof();
  const c = get(id);
  if (!c) return null;
  if (c.demo) return <Page narrow><Link to="/app/commitments/$id" params={{ id: c.id }} className="text-sm text-muted-foreground">← {c.title}</Link><h1 className="mt-6 text-3xl font-semibold">{c.status === "failed" ? "Não concluído" : c.status === "passed" ? "Verificado" : "Em andamento"}</h1><ContractRecord c={c} /></Page>;
  const run = c.runs[c.runs.length - 1];
  if (!run) return <Page narrow><p className="text-muted-foreground">Nenhuma verificação ainda.</p></Page>;
  const ok = run.verdicts.filter((v) => v.status === "verified").length;
  const left = daysLeft(c.deadline);

  return (
    <Page narrow>
      <Link to="/app/commitments/$id" params={{ id: c.id }} className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {c.title}
      </Link>
      <div className="eyebrow">Verificação concluída</div>
      <h1 className="display mt-3 text-5xl sm:text-6xl">
        <span className="tabular">{ok} / {run.verdicts.length}</span> <span className="text-muted-foreground">{run.verdicts.length === 1 ? "objetivo verificado" : "objetivos verificados"}</span>
      </h1>

      <div className="mt-12">
        <VerificationResult criteria={c.criteria} verdicts={run.verdicts} />
      </div>

      <div className="mt-12">
        {c.status === "passed" && (
          <div className="rise rounded-xl border border-success/30 bg-success-soft p-8">
            <div className="stamp inline-block rounded border-2 border-success px-3 py-1 font-mono text-sm font-semibold tracking-[0.2em] text-success">CONCLUÍDO</div>
            <h2 className="display mt-6 text-4xl">Você cumpriu.</h2>
            <p className="mt-2 text-lg"><span className="tabular font-semibold text-success">{money(c.stake, c.currency)}</span> devolvido <span className="text-sm text-muted-foreground">(simulado)</span></p>
          </div>
        )}
        {c.status === "failed" && (
          <div className="rise rounded-xl border border-danger/30 bg-danger-soft p-8">
            <div className="stamp inline-block rounded border-2 border-danger px-3 py-1 font-mono text-sm font-semibold tracking-[0.2em] text-danger">NÃO CONCLUÍDO</div>
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div><dt className="eyebrow">Valor</dt><dd className="tabular text-2xl font-semibold text-danger">{money(c.stake, c.currency)}</dd></div>
              <div><dt className="eyebrow">Resultado</dt><dd className="font-medium">Envio do valor em jogo iniciado <span className="text-sm font-normal text-muted-foreground">(simulado)</span></dd></div>
            </dl>
          </div>
        )}
        {(c.status === "active" || c.status === "awaiting_verification") && (
          <div className="rise rounded-xl border border-border-strong p-8">
            <div className="font-mono text-sm font-semibold tracking-[0.15em]">COMPROMISSO AINDA NÃO VERIFICADO</div>
            <p className="mt-3 text-lg text-muted-foreground">
              Você ainda tem <span className="font-medium text-foreground">{left} dia{left === 1 ? "" : "s"}</span> para enviar mais evidências.
            </p>
            <Link to="/app/commitments/$id/proof" params={{ id: c.id }} className={btn({ size: "lg", className: "mt-6" })}>
              <Plus className="size-4" /> Adicionar evidência
            </Link>
          </div>
        )}
      </div>
    </Page>
  );
}
