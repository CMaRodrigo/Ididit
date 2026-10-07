import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Lock, ScanSearch } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { Button } from "@/components/proof/primitives";
import { EvidenceUploader } from "@/components/proof/EvidenceUploader";
import { aiJudge } from "@/lib/proof/ai";
import type { Evidence } from "@/lib/proof/types";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/commitments/$id/proof")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Envie a prova — I Did It." },
      { name: "description", content: "Envie evidências para cada objetivo travado." },
      { property: "og:title", content: "Envie a prova — I Did It." },
      { property: "og:description", content: "Envie evidências para cada objetivo travado." },
    ],
  }),
  component: SubmitProof,
});

function SubmitProof() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { get, submitEvidence, recordVerdicts } = useProof();
  const c = get(id);
  const [ev, setEv] = useState<Evidence[]>([]);
  const [judging, setJudging] = useState(false);
  if (!c) return null;

  const submit = async () => {
    setJudging(true);
    submitEvidence(c.id, ev);
    const verdicts = await aiJudge(c, [...c.evidence, ...ev]);
    recordVerdicts(c.id, verdicts);
    nav({ to: "/app/commitments/$id/result", params: { id: c.id } });
  };

  if (judging) {
    return (
      <Page narrow className="grid min-h-[75vh] place-items-center text-center">
        <div>
          <ScanSearch className="mx-auto size-8 animate-pulse text-accent" strokeWidth={1.5} />
          <h1 className="display mt-8 text-4xl">Verificando…</h1>
          <p className="mt-3 text-muted-foreground">Conferindo suas evidências com {c.criteria.length === 1 ? "o objetivo travado" : `os ${c.criteria.length} objetivos travados`}.</p>
          <ul className="mx-auto mt-10 max-w-sm space-y-2 text-left text-sm">
            {c.criteria.map((cr, i) => (
              <li key={cr.id} className="rise flex items-center gap-2 text-muted-foreground" style={{ animationDelay: `${i * 300}ms` }}>
                <span className="size-1.5 animate-pulse rounded-full bg-accent" /> {cr.description}
              </li>
            ))}
          </ul>
        </div>
      </Page>
    );
  }

  return (
    <Page narrow>
      <Link to="/app/commitments/$id" params={{ id: c.id }} className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> {c.title}
      </Link>
      <h1 className="display text-5xl sm:text-7xl">Prove que fez<span className="text-accent">.</span></h1>
      <p className="mt-4 text-lg text-muted-foreground">Envie evidências para cada objetivo.</p>

      <ol className="mt-12 space-y-4">
        {c.criteria.map((cr, i) => (
          <li key={cr.id} className="panel p-5 sm:p-6">
            <div className="mb-4 flex items-start gap-3">
              <span className="tabular mt-0.5 text-sm text-muted-foreground">{i + 1}.</span>
              <div className="flex-1 font-medium">{cr.description}</div>
              {cr.status === "met" && <span className="flex items-center gap-1 text-xs text-success"><Check className="size-3.5" /> Verificado por dados</span>}
            </div>
            {cr.status !== "met" && (
              <EvidenceUploader
                criterionId={cr.id}
                items={ev.filter((e) => e.criterionId === cr.id)}
                onChange={(items) => setEv([...ev.filter((e) => e.criterionId !== cr.id), ...items])}
              />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-10 border-t border-border pt-6">
        <p className="mb-5 flex items-center gap-2 text-sm text-muted-foreground"><Lock className="size-3.5" /> Suas evidências serão avaliadas com base nos objetivos originais travados.</p>
        <Button size="xl" className="w-full sm:w-auto" disabled={ev.length === 0} onClick={submit}>
          Enviar para verificação
        </Button>
      </div>
    </Page>
  );
}
