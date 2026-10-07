import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  beforeLoad: () => { throw redirect({ to: "/app/profile", replace: true }); },
  head: () => ({ meta: [
    { title: "Sua conta — I Did It." },
    { name: "description", content: "Abra o portfólio pessoal de conquistas e os compromissos do Rodrigo." },
    { property: "og:title", content: "Sua conta — I Did It." },
    { property: "og:description", content: "Abra o portfólio pessoal de conquistas e os compromissos do Rodrigo." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
