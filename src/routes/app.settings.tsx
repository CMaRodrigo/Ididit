import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/proof/Page";
import { Button, Field } from "@/components/proof/primitives";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Proof." },
      { name: "description", content: "Profile, connected accounts and notifications." },
      { property: "og:title", content: "Settings — Proof." },
      { property: "og:description", content: "Profile, connected accounts and notifications." },
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
        <div className={cn("text-sm", on ? "text-success" : "text-muted-foreground")}>{on ? "Connected" : desc}</div>
      </div>
      <Button variant={on ? "ghost" : "outline"} size="sm" onClick={toggle}>{on ? "Disconnect" : "Connect"}</Button>
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
  const { user, integrations, toggleIntegration, reset, signOut } = useProof();
  const nav = useNavigate();
  return (
    <Page narrow>
      <h1 className="display text-4xl sm:text-5xl">Settings</h1>

      <h2 className="eyebrow mb-4 mt-12">Profile</h2>
      <div className="grid grid-cols-2 gap-6 border-y border-border py-6">
        <Field label="Name">{user.name}</Field>
        <Field label="Email">{user.email}</Field>
        <Field label="Timezone">{user.timezone}</Field>
        <Field label="Default currency">{user.currency}</Field>
      </div>

      <h2 className="eyebrow mb-1 mt-12">Connected accounts</h2>
      <div className="divide-y divide-border border-b border-border">
        <IntegrationCard name="GitHub" desc="Verify commits and repositories" on={!!integrations["github"]} toggle={() => toggleIntegration("github")} />
        <IntegrationCard name="Strava" desc="Verify runs, rides and workouts" on={!!integrations["strava"]} toggle={() => toggleIntegration("strava")} />
        <IntegrationCard name="Google" desc="Verify calendar-tracked sessions" on={!!integrations["google_calendar"]} toggle={() => toggleIntegration("google_calendar")} />
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Connections are simulated in this preview.</p>

      <h2 className="eyebrow mb-1 mt-12">Notifications</h2>
      <div className="divide-y divide-border border-b border-border">
        <Toggle label="Deadline reminders" />
        <Toggle label="Progress warnings" />
        <Toggle label="Verification results" />
      </div>

      <div className="mt-12 flex flex-wrap gap-2">
        <Button variant="outline" onClick={reset}>Reset demo data</Button>
        <Button variant="ghost" onClick={() => { signOut(); nav({ to: "/" }); }}>Log out</Button>
      </div>
    </Page>
  );
}
