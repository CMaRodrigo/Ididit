import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Database, Lock, ScanSearch, UserCheck } from "lucide-react";
import { btn, Logo, ProgressBar } from "@/components/proof/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proof. — Don't say you did it. Prove it." },
      { name: "description", content: "Put money on the line, define exactly what success means, and prove you followed through." },
      { property: "og:title", content: "Proof. — Don't say you did it. Prove it." },
      { property: "og:description", content: "Commitment contracts with real stakes. Verified by data, AI or someone you trust." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const flow = ["Commit", "Lock", "Do", "Prove", "Verify", "Result"];

function Landing() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link to="/auth" className={btn({ variant: "ghost", size: "sm" })}>
            Log in
          </Link>
          <Link to="/auth" search={{ mode: "signup" }} className={btn({ size: "sm" })}>
            Get started
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:pt-28">
        <div className="rise mb-8 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
          {flow.map((f, i) => (
            <span key={f} className="flex items-center gap-2">
              <span className={i === 3 ? "text-accent" : ""}>{f.toUpperCase()}</span>
              {i < flow.length - 1 && <span className="opacity-40">→</span>}
            </span>
          ))}
        </div>
        <h1 className="display rise max-w-4xl text-[3.25rem] sm:text-[5.5rem]">
          Goals are easy.
          <br />
          <span className="text-muted-foreground">Commitments need</span> proof<span className="text-accent">.</span>
        </h1>
        <p className="rise mt-8 max-w-xl text-lg text-muted-foreground sm:text-xl" style={{ animationDelay: "80ms" }}>
          Put money on the line, define exactly what success means, and prove you followed through.
        </p>
        <div className="rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "140ms" }}>
          <Link to="/app/new" className={btn({ variant: "primary", size: "lg" })}>
            Create a commitment <ArrowRight className="size-4" />
          </Link>
          <a href="#how" className={btn({ variant: "outline", size: "lg" })}>
            See how it works
          </a>
        </div>

        <div className="rise mt-20 max-w-3xl" style={{ animationDelay: "220ms" }}>
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <span className="text-sm font-semibold tracking-[0.08em]">RUN 100 KM THIS MONTH</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="size-3" /> Rules locked
              </span>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {[
                ["Stake", "$100"],
                ["Deadline", "Oct 31"],
                ["Verification", "Strava"],
                ["Status", "72 / 100 km"],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface px-6 py-5">
                  <div className="eyebrow mb-1.5">{k}</div>
                  <div className="tabular text-xl font-semibold tracking-tight">{v}</div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4">
              <ProgressBar value={72} max={100} />
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:grid-cols-3">
          {[
            ["Make a commitment", "Set a goal, a deadline and something meaningful at stake."],
            ["Define the proof", "Choose how your goal will be verified: AI, data or someone you trust."],
            ["Follow through", "Prove you did it. If you succeed, you keep your money. If not, the consequence you chose happens."],
          ].map(([t, d], i) => (
            <div key={t}>
              <div className="tabular mb-6 font-mono text-sm text-muted-foreground">0{i + 1}</div>
              <h3 className="text-2xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-3 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="display max-w-2xl text-4xl sm:text-6xl">Your word isn't the verification system.</h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {[
              [Database, "Data", "Connect services like GitHub or Strava and let the data speak."],
              [ScanSearch, "AI", "Submit evidence and let AI evaluate it against rules defined before you started."],
              [UserCheck, "Referee", "Choose someone you trust to review your proof."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof Database;
              return (
                <div key={t as string} className="bg-background p-8">
                  <I className="size-5" strokeWidth={1.75} />
                  <div className="eyebrow mt-10 text-foreground">{t as string}</div>
                  <p className="mt-3 text-[15px] text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-24 sm:grid-cols-2 sm:items-center">
          <div>
            <Lock className="mb-8 size-6 text-accent" strokeWidth={1.75} />
            <h2 className="display text-4xl sm:text-6xl">The rules are locked before you start.</h2>
          </div>
          <p className="text-lg text-muted-foreground sm:text-xl">
            You define what success means while you're still thinking clearly. Once the commitment begins, the criteria can't be quietly rewritten because the goal got difficult.
          </p>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="display text-5xl sm:text-7xl">
            Put something
            <br />
            on the line<span className="text-accent">.</span>
          </h2>
          <Link to="/app/new" className={btn({ variant: "accent", size: "xl" })}>
            Create a commitment <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <Logo className="text-base text-foreground" />
        <span>Don't say you did it. Prove it.</span>
      </footer>
    </div>
  );
}
