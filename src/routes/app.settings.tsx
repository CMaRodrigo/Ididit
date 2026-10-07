import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/proof/Page";
import { Button, Field } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Configurações — I Did It." },
      { name: "description", content: "Perfil, contas conectadas e notificações." },
      { property: "og:title", content: "Configurações — I Did It." },
      { property: "og:description", content: "Perfil, contas conectadas e notificações." },
    ],
  }),
  component: Settings,
});

function IntegrationCard({ name, desc, on, toggle }: { name: string; desc: string; on: boolean; toggle: () => void }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="grid size-10 place-items-center rounded-lg border border-border bg-surface text-sm font-semibold">{name[0]}</div>
      <div className="flex-1">
        <div className="font-medium">{name}</div>
        <div className={cn("text-sm", on ? "text-success" : "text-muted-foreground")}>{on ? "Conectado" : desc}</div>
      </div>
      <Button variant={on ? "ghost" : "outline"} size="sm" onClick={toggle}>{on ? "Desconectar" : "Conectar"}</Button>
    </div>
  );
}

function Toggle({ label, defaultOn = true }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex cursor-pointer items-center justify-between py-4">
      <span>{label}</span>
      <button role="switch" aria-checked={on} onClick={() => setOn(!on)} className={cn("relative h-6 w-10 rounded-full transition", on ? "bg-foreground" : "bg-border-strong")}>
        <span className={cn("absolute top-0.5 size-5 rounded-full bg-background shadow transition-all", on ? "left-[18px]" : "left-0.5")} />
      </button>
    </label>
  );
}

function Settings() {
  const { user, integrations, toggleIntegration, reset } = useProof();
  return (
    <Page narrow>
      <h1 className="display text-4xl sm:text-5xl">Configurações</h1>

      <h2 className="eyebrow mb-4 mt-12">Perfil</h2>
      <div className="grid grid-cols-2 gap-6 border-y border-border py-6">
        <Field label="Nome">{user.name}</Field>
        <Field label="E-mail">{user.email}</Field>
        <Field label="Fuso horário">{user.timezone}</Field>
        <Field label="Moeda padrão">{user.currency}</Field>
      </div>

      <h2 className="eyebrow mb-1 mt-12">Contas conectadas</h2>
      <div className="divide-y divide-border border-b border-border">
        <IntegrationCard name="GitHub" desc="Verifique commits e repositórios" on={!!integrations["github"]} toggle={() => toggleIntegration("github")} />
        <IntegrationCard name="Strava" desc="Verifique corridas, pedaladas e treinos" on={!!integrations["strava"]} toggle={() => toggleIntegration("strava")} />
        <IntegrationCard name="Google" desc="Verifique sessões registradas na agenda" on={!!integrations["google_calendar"]} toggle={() => toggleIntegration("google_calendar")} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">As conexões são simuladas nesta prévia.</p>

      <h2 className="eyebrow mb-1 mt-12">Notificações</h2>
      <div className="divide-y divide-border border-b border-border">
        <Toggle label="Lembretes de prazo" />
        <Toggle label="Alertas de progresso" />
        <Toggle label="Resultados de verificação" />
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        <Button variant="outline" onClick={reset}>Redefinir dados demo</Button>
      </div>
    </Page>
  );
}
