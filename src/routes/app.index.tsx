import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { CommitmentCard } from "@/components/proof/CommitmentCard";
import { Page } from "@/components/proof/Page";
import { btn, Skeleton } from "@/components/proof/primitives";
import { money } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Home — I Did It." },
      { name: "description", content: "Your active commitments at a glance." },
      { property: "og:title", content: "Home — I Did It." },
      { property: "og:description", content: "Your active commitments at a glance." },
    ],
  }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

function Dashboard() {
  const { commitments, user, hydrated } = useProof();
  const active = commitments.filter((c) => c.status === "active" || c.status === "awaiting_verification");
  const atStake = active.reduce((s, c) => s + c.stake, 0);
  const awaiting = active.filter((c) => c.status === "awaiting_verification" || c.criteria.some((x) => x.status === "pending")).length;

  return (
    <Page>
      <h1 className="display text-4xl sm:text-5xl" suppressHydrationWarning>
        {greeting()}, {user.name}.
      </h1>
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[15px]">
        <span><span className="tabular font-semibold">{active.length}</span> <span className="text-muted-foreground">active</span></span>
        <span><span className="tabular font-semibold">{money(atStake, active[0]?.currency ?? user.currency)}</span> <span className="text-muted-foreground">at stake</span></span>
        <span><span className="tabular font-semibold">{awaiting}</span> <span className="text-muted-foreground">awaiting proof</span></span>
      </div>

      <div className="mb-4 mt-14 flex items-center justify-between">
        <h2 className="eyebrow">Active commitments</h2>
        <Link to="/app/commitments" className="text-sm text-muted-foreground hover:text-foreground">View all</Link>
      </div>

      {!hydrated ? (
        <div className="space-y-3">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : active.length === 0 ? (
        <div className="panel px-8 py-16 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">No commitments yet.</h3>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">Make a promise your future self can't quietly ignore.</p>
          <Link to="/app/new" className={btn({ size: "lg", className: "mt-8" })}>
            <Plus className="size-4" /> Create your first commitment
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((c) => (
            <CommitmentCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </Page>
  );
}
