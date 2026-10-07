import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useProof } from "@/lib/proof/store";

/** Commitments that ended without a trophy, shown under the trophies on the profile and in the Trophy Room. */
export function PastAttempts() {
  const { commitments } = useProof();
  const failed = commitments.filter((c) => c.status === "failed").sort((a, b) => (b.completedAt ?? b.deadline).localeCompare(a.completedAt ?? a.deadline));
  if (failed.length === 0) return null;
  return (
    <section className="mt-12 border-t border-border pt-8"><h2 className="eyebrow">Tentativas anteriores</h2><p className="mt-2 text-sm text-muted-foreground">Nem todo compromisso termina em troféu. O registro permanece.</p><div className="mt-4 divide-y divide-border">{failed.map((c) => <Link key={c.id} to="/app/commitments/$id" params={{ id: c.id }} className="flex items-center justify-between gap-4 py-5"><div><h3 className="text-lg font-semibold">{c.title}</h3><p className="mt-1 text-sm text-muted-foreground">{c.criteria.filter((cr) => cr.status === "met").length} / {c.criteria.length} objetivos concluídos · Nenhum troféu conquistado</p></div><div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground"><span>Não concluído</span><ArrowRight className="size-4" /></div></Link>)}</div></section>
  );
}
