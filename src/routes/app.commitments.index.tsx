import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import { CommitmentCard } from "@/components/proof/CommitmentCard";
import { Page } from "@/components/proof/Page";
import { btn } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";
import type { CommitmentStatus } from "@/lib/proof/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/commitments/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Compromissos — I Did It." },
      { name: "description", content: "Todos os compromissos que você assumiu, e como terminaram." },
      { property: "og:title", content: "Compromissos — I Did It." },
      { property: "og:description", content: "Todos os compromissos que você assumiu, e como terminaram." },
    ],
  }),
  component: Commitments,
});

const TABS: { id: CommitmentStatus; label: string }[] = [
  { id: "active", label: "Ativos" },
  { id: "awaiting_verification", label: "Aguardando verificação" },
  { id: "passed", label: "Concluídos" },
  { id: "failed", label: "Não concluídos" },
];

function Commitments() {
  const { commitments } = useProof();
  const [tab, setTab] = useState<CommitmentStatus>("active");
  const list = commitments.filter((c) => c.status === tab);
  return (
    <Page>
      <div className="flex items-end justify-between">
        <h1 className="display text-4xl sm:text-5xl">Compromissos</h1>
        <Link to="/app/new" className={btn({ size: "sm", className: "hidden sm:inline-flex" })}><Plus className="size-4" /> Novo</Link>
      </div>
      <div className="mt-10 flex gap-6 overflow-x-auto border-b border-border">
        {TABS.map((t) => {
          const n = commitments.filter((c) => c.status === t.id).length;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("-mb-px shrink-0 border-b-2 pb-3 text-sm transition", tab === t.id ? "border-foreground font-medium text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
              {t.label} <span className="tabular ml-1 text-muted-foreground">{n}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">Nada por aqui.</p>
        ) : (
          list.map((c) => <CommitmentCard key={c.id} c={c} />)
        )}
      </div>
    </Page>
  );
}
