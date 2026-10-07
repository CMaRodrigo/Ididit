import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => { throw redirect({ to: "/app/profile", replace: true }); },
  head: () => ({ meta: [
    { title: "Your Account — Proof." },
    { name: "description", content: "Open Rodrigo’s personal achievement portfolio and commitments." },
    { property: "og:title", content: "Your Account — Proof." },
    { property: "og:description", content: "Open Rodrigo’s personal achievement portfolio and commitments." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
