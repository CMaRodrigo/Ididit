import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/proof/Page";
import { BadgeArt, MysteryBadge } from "@/components/proof/Badge";
import { useProof } from "@/lib/proof/store";
import { money, shortDate } from "@/lib/proof/format";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Trophy Room — Proof." },
      { name: "description", content: "Your verified accomplishments, each one backed by rules, evidence and a stake." },
      { property: "og:title", content: "Profile & Trophy Room — Proof." },
      { property: "og:description", content: "Your verified accomplishments, each one backed by rules, evidence and a stake." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, commitments, achievements } = useProof();
  const passed = commitments.filter((c) => c.status === "passed");
  const decided = commitments.filter((c) => c.status === "passed" || c.status === "failed").length;
  const rate = decided ? Math.round((passed.length / decided) * 100) : 0;
  const defended = passed.reduce((n, c) => n + c.stake, 0);
  const trophies = [...achievements]
    .filter((a) => commitments.some((c) => c.id === a.commitmentId && c.status === "passed"))
    .sort((a, b) => b.earnedAt.localeCompare(a.earnedAt));
  const stats = [
    { v: String(passed.length), l: "commitments completed" },
    { v: money(defended, user.currency), l: "successfully defended" },
    { v: `${rate}%`, l: "success rate" },
    { v: String(trophies.length), l: "trophies earned" },
  ];

  return (
    <Page>
      <div className="flex items-center gap-5">
        <div className="grid size-20 shrink-0 place-items-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
          {user.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <h1 className="display text-3xl sm:text-4xl">{user.name}</h1>
          {user.bio && <p className="mt-1 text-muted-foreground">{user.bio}</p>}
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.l} className="bg-surface p-5">
            <dt className="tabular text-2xl font-semibold tracking-tight">{s.v}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{s.l}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-16">
        <h2 className="eyebrow">Trophy Room</h2>
        <p className="display mt-2 text-2xl sm:text-3xl">Proof of what you actually finished.</p>
        <p className="mt-2 text-sm text-muted-foreground">The badge is the symbol. The proof is behind it — open any trophy to see the original contract.</p>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {trophies.map((a) => {
            const c = commitments.find((c) => c.id === a.commitmentId)!;
            return (
              <Link key={a.id} to="/app/trophies/$id" params={{ id: a.id }} className="group text-center">
                <BadgeArt a={a} className="mx-auto w-[78%] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.03]" />
                <div className="mt-4 text-sm font-semibold tracking-[0.08em]">{a.badgeName}</div>
                <div className="mt-1 line-clamp-1 text-sm text-muted-foreground">{c.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground/80">Completed {shortDate(a.earnedAt)}, {new Date(a.earnedAt).getFullYear()}</div>
              </Link>
            );
          })}
          {Array.from({ length: Math.max(1, 2 - (trophies.length % 2)) }).map((_, i) => (
            <Link key={i} to="/app/new" className="text-center opacity-70 transition hover:opacity-100">
              <MysteryBadge className="mx-auto w-[64%]" />
              <div className="mt-4 text-sm text-muted-foreground">Your next achievement</div>
            </Link>
          ))}
        </div>
        {trophies.length === 0 && <p className="mt-6 text-sm text-muted-foreground">Complete and verify a commitment to earn your first trophy.</p>}
      </section>
    </Page>
  );
}
