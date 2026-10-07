import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/proof/Page";
import { PastAttempts } from "@/components/proof/PastAttempts";
import { TrophyRoom } from "@/components/proof/TrophyRoom";

export const Route = createFileRoute("/app/trophies/")({
  head: () => ({ meta: [
    { title: "Sala de Troféus — I Did It." },
    { name: "description", content: "Cada compromisso verificado, como um troféu com a prova por trás dele." },
    { property: "og:title", content: "Sala de Troféus — I Did It." },
    { property: "og:description", content: "O troféu é o símbolo. A prova está por trás dele." },
  ] }),
  component: () => <Page><TrophyRoom /><PastAttempts /></Page>,
});
