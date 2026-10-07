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
      { title: "Registro de conquista — I Did It." },
      { name: "description", content: "O registro permanente e somente leitura por trás de uma conquista verificada." },
      { property: "og:title", content: "Registro de conquista — I Did It." },
      { property: "og:description", content: "O registro permanente e somente leitura por trás de uma conquista verificada." },
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
        <p className="text-muted-foreground">{hydrated ? "Esta conquista não foi encontrada." : "Carregando…"}</p>
        <Link to="/app/profile" className="mt-4 inline-block text-sm underline">Voltar à Sala de Troféus</Link>
      </Page>
    );

  return (
    <Page narrow>
      <Link to="/app/profile" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Sala de Troféus
      </Link>

      <header className="mt-8 flex flex-col items-center text-center">
        <BadgeArt a={a} className="w-44 sm:w-52" />
        <h1 className="mt-8 text-3xl font-semibold tracking-normal sm:text-4xl">{a.badgeName}</h1>
        <p className="mt-2 text-lg font-medium">{c.title}</p>
        <p className="mt-2 text-muted-foreground">{a.badgeSubtitle}</p>
        <p className="mt-3 text-xs text-muted-foreground">Este troféu representa um compromisso verificado.{c.demo ? " Registro demo." : ""}</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 font-medium tracking-wide text-success">
            <ShieldCheck className="size-4" /> VERIFICADO
          </span>
          <span className="text-muted-foreground">Concluído em {longDate(a.earnedAt)}</span>
        </div>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setShare(true)}>
          <Share2 className="size-4" /> Compartilhar conquista
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
          <div className="font-medium">Compartilhar conquista</div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Fechar"><X className="size-4" /></Button>
        </div>
        <div className="mt-4 flex aspect-[4/5] flex-col items-center justify-between rounded-xl bg-primary p-7 text-center text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] opacity-60">Conquista verificada</div>
          <div className="flex flex-col items-center">
            <BadgeArt a={a} className="w-32" />
            <div className="mt-5 text-2xl font-semibold tracking-normal">{a.badgeName}</div>
            {c.headline && <div className="mt-1 tabular text-sm opacity-80">{c.headline.target} {c.headline.unit.toUpperCase()}</div>}
            <div className="mt-3 text-xs opacity-60">Concluído em {longDate(a.earnedAt)} · Verificado por {verificationLabel(c)}</div>
          </div>
          <Logo className="text-base" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={copy}><Link2 className="size-4" /> {copied ? "Copiado" : "Copiar link"}</Button>
          <Button variant="outline" onClick={() => setNote("O download da imagem chega com as contas online.")}><Download className="size-4" /> Baixar</Button>
        </div>
        {note && <p className="mt-2 text-center text-xs text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
