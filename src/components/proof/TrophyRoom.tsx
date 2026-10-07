import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BadgeArt } from "./Badge";
import { useProof } from "@/lib/proof/store";

const order = ["projeto-rondon", "liga-financeira", "toninhathon", "pratham-books", "detectivesql", "torneio-empreendedor"];

/** Every verified commitment's trophy, shared by the profile and the Trophy Room page. */
export function TrophyRoom() {
  const { commitments, achievements, hydrated } = useProof();
  const passed = commitments.filter((c) => c.status === "passed");
  const trophies = achievements.filter((a) => passed.some((c) => c.id === a.commitmentId)).sort((a, b) => {
    const ai = order.indexOf(a.commitmentId), bi = order.indexOf(b.commitmentId);
    return ai >= 0 && bi >= 0 ? ai - bi : b.earnedAt.localeCompare(a.earnedAt);
  });
  return (
    <section id="trophy-room" className="pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="eyebrow">Trophy Room</h2><p className="mt-2 text-3xl font-semibold sm:text-4xl">Proof of what you actually finished.</p></div><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 text-success" />Earned, not given</span></div>
       <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:gap-x-12 lg:gap-y-16">
        {trophies.map((a) => { const c = passed.find((c) => c.id === a.commitmentId); if (!c) return null; return <Link key={a.id} to="/app/trophies/$id" params={{ id: a.id }} className="group min-w-0 text-center" aria-label={`${a.badgeName} — ${c.title} — View proof`}>
           <BadgeArt a={a} className="collectible-art mx-auto w-full max-w-56" />
          <div className="mt-4 text-sm font-semibold leading-snug">{a.badgeName}</div><div className="mt-1 text-sm text-muted-foreground">{c.title}</div><div className="mt-2 text-xs leading-relaxed text-muted-foreground">{a.badgeSubtitle}</div><div className="mt-1 text-xs text-muted-foreground">{new Date(a.earnedAt).getFullYear()}{c.demo ? " · Demo" : ""}</div><div className="mt-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-foreground">View proof <ArrowRight className="size-3" /></div>
        </Link>; })}
      </div>
      {hydrated && trophies.length === 0 && <p className="py-10 text-sm text-muted-foreground">Complete and verify a commitment to earn your first trophy.</p>}
    </section>
  );
}
