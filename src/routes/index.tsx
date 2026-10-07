import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/app/profile", replace: true }); },
  head: () => ({ meta: [
    { title: "Rodrigo’s Portfolio — Proof." },
    { name: "description", content: "Rodrigo’s achievements, active commitments and the proof behind them." },
    { property: "og:title", content: "Rodrigo’s Portfolio — Proof." },
    { property: "og:description", content: "Rodrigo’s achievements, active commitments and the proof behind them." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
