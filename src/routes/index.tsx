import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/app/profile", replace: true }); },
  head: () => ({ meta: [
    { title: "Portfólio do Rodrigo — I Did It." },
    { name: "description", content: "As conquistas do Rodrigo, compromissos ativos e a prova por trás deles." },
    { property: "og:title", content: "Portfólio do Rodrigo — I Did It." },
    { property: "og:description", content: "As conquistas do Rodrigo, compromissos ativos e a prova por trás deles." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
