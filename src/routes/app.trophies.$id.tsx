import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Download, Link2, Lock, Share2, ShieldCheck, X } from "lucide-react";
import { Page } from "@/components/proof/Page";
import { BadgeArt } from "@/components/proof/Badge";
import { Button, Logo } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";
import { longDate, verificationLabel } from "@/lib/proof/format";
import type { Achievement, Commitment } from "@/lib/proof/types";
import { ContractRecord } from "@/components/proof/ContractRecord";

export const Route = createFileRoute("/app/trophies/$id")({
  head: () => ({
    meta: [
      { title: "Achievement record — I Did It." },
      { name: "description", content: "The permanent, read-only record behind a verified achievement." },
      { property: "og:title", content: "Achievement record — I Did It." },
      { property: "og:description", content: "The permanent, read-only record behind a verified achievement." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Record,
});

function Record() {
  const { id } = Route.useParams();
  const { achievements, commitments, hydrated } = useProof();
  const a = achievements.find((x) => x.id === id);
  const c = a && commitments.find((x) => x.id === a.commitmentId);
  const [share, setShare] = useState(false);

  if (!a || !c)
    return (
      <Page narrow>
        <p className="text-muted-foreground">{hydrated ? "This achievement could not be found." : "Loading…"}</p>
        <Link to="/app/profile" className="mt-4 inline-block text-sm underline">Back to Trophy Room</Link>
      </Page>
    );

  return (
    <Page narrow>
      <Link to="/app/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Trophy Room
      </Link>

      <header className="mt-8 flex flex-col items-center text-center">
        <BadgeArt a={a} className="w-44 sm:w-52" />
        <h1 className="mt-8 text-3xl font-semibold tracking-normal sm:text-4xl">{a.badgeName}</h1>
        <p className="mt-2 text-lg font-medium">{c.title}</p>
        <p className="mt-2 text-muted-foreground">{a.badgeSubtitle}</p>
        <p className="mt-3 text-xs text-muted-foreground">This trophy represents a verified commitment.{c.demo ? " Demo record." : ""}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 font-medium tracking-wide text-success">
            <ShieldCheck className="size-4" /> VERIFIED
          </span>
          <span className="text-muted-foreground">Completed {longDate(a.earnedAt)}</span>
        </div>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShare(true)}>
          <Share2 className="size-4" /> Share achievement
        </Button>
      </header>

      <ContractRecord c={c} a={a} />

      {share && <ShareDialog a={a} c={c} onClose={() => setShare(false)} />}
    </Page>
  );
}

function ShareDialog({ a, c, onClose }: { a: Achievement; c: Commitment; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const copy = async () => {
    await navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
  };
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-background p-5 shadow-[var(--shadow-lift)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="font-medium">Share achievement</div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close"><X className="size-4" /></Button>
        </div>
        <div className="mt-4 flex aspect-[4/5] flex-col items-center justify-between rounded-xl bg-primary p-7 text-center text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-60">Verified achievement</div>
          <div className="flex flex-col items-center">
            <BadgeArt a={a} className="w-32" />
            <div className="mt-5 text-2xl font-semibold tracking-normal">{a.badgeName}</div>
            {c.headline && <div className="mt-1 tabular text-sm opacity-80">{c.headline.target} {c.headline.unit.toUpperCase()}</div>}
            <div className="mt-3 text-xs opacity-60">Completed {longDate(a.earnedAt)} · Verified by {verificationLabel(c)}</div>
          </div>
          <Logo className="text-base" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copy}><Link2 className="size-4" /> {copied ? "Copied" : "Copy link"}</Button>
          <Button variant="outline" onClick={() => setNote("Image download arrives with online accounts.")}><Download className="size-4" /> Download</Button>
        </div>
        {note && <p className="mt-2 text-center text-xs text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
