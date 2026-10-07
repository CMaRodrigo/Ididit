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
      { title: "Commitments — Proof." },
      { name: "description", content: "Every commitment you've made, and how it ended." },
      { property: "og:title", content: "Commitments — Proof." },
      { property: "og:description", content: "Every commitment you've made, and how it ended." },
    ],
  }),
  component: Commitments,
});

const TABS: { id: CommitmentStatus; label: string }[] = [
  { id: "active", label: "Active" },
  { id: "awaiting_verification", label: "Awaiting verification" },
  { id: "passed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

function Commitments() {
  const { commitments } = useProof();
  const [tab, setTab] = useState<CommitmentStatus>("active");
  const list = commitments.filter((c) => c.status === tab);
  return (
    <Page>
      <div className="flex items-end justify-between">
        <h1 className="display text-4xl sm:text-5xl">Commitments</h1>
        <Link to="/app/new" className={btn({ size: "sm", className: "hidden sm:inline-flex" })}><Plus className="size-4" /> New</Link>
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
          <p className="py-16 text-center text-muted-foreground">Nothing here.</p>
        ) : (
          list.map((c) => <CommitmentCard key={c.id} c={c} />)
        )}
      </div>
    </Page>
  );
}
