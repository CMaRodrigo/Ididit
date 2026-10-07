import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { TrophyRoom } from "@/components/proof/TrophyRoom";
import { btn, ProgressBar } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/profile")({
  head: () => ({ meta: [
    { title: "Rodrigo's Trophy Room — I Did It." },
    { name: "description", content: "A personal timeline of verified accomplishments, ongoing commitments and honest past attempts." },
    { property: "og:title", content: "Rodrigo's Trophy Room — I Did It." },
    { property: "og:description", content: "The badge is the symbol. The proof is behind it." },
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
      <p className="mt-5 text-base text-muted-foreground">Things I said I would do — and the proof behind them.</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm"><span><strong className="tabular font-semibold">{passed.length}</strong> verified achievements</span><span><strong className="tabular font-semibold">{failed.length}</strong> failed {failed.length === 1 ? "challenge" : "challenges"}</span><span><strong className="tabular font-semibold">{active.length}</strong> active {active.length === 1 ? "commitment" : "commitments"}</span></div>
    </header>
    {active.map((c) => { const met = c.criteria.filter((cr) => cr.status === "met").length; return <section key={c.id} className="grid items-center gap-6 border-b border-border py-8 sm:grid-cols-[1fr_120px]">
      <div><div className="eyebrow">Current commitment</div><div className="mt-3 flex flex-wrap items-center gap-3"><h2 className="text-2xl font-semibold">{c.title}</h2><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-accent" />In progress</span></div><div className="mt-4 flex max-w-md items-center gap-4"><span className="tabular shrink-0 text-sm">{met} / {c.criteria.length} milestones</span><ProgressBar value={met} max={c.criteria.length} /></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">{c.id === "behring-founders" && ["Apply", "Study deeply", "Speak with Bibi"].map((label) => <span key={label} className="flex items-center gap-1"><Check className="size-3 text-success" />{label}</span>)}</div><Link to="/app/commitments/$id" params={{ id: c.id }} className={btn({ variant: "outline", size: "sm", className: "mt-5" })}>View commitment <ArrowRight className="size-3.5" /></Link></div>
      <div className="hidden text-center sm:block"><div className="mx-auto grid size-20 place-items-center text-muted-foreground"><Lock className="size-8" strokeWidth={1.25} /></div><span className="mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground"><Lock className="size-3" />Trophy locked</span></div>
    </section>; })}
    <TrophyRoom />
    <section className="mt-12 border-t border-border pt-8"><h2 className="eyebrow">Past Attempts</h2><p className="mt-2 text-sm text-muted-foreground">Not every commitment ends in a trophy. The record still stays.</p><div className="mt-4 divide-y divide-border">{failed.map((c) => <Link key={c.id} to="/app/commitments/$id" params={{ id: c.id }} className="flex items-center justify-between gap-4 py-5"><div><h3 className="text-lg font-semibold">{c.title}</h3><p className="mt-1 text-sm text-muted-foreground">{c.criteria.filter((cr) => cr.status === "met").length} / {c.criteria.length} objectives completed · No trophy earned</p></div><div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground"><span>Not completed</span><ArrowRight className="size-4" /></div></Link>)}</div></section>
  </Page>;
}
