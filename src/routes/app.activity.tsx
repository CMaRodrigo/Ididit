import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/proof/Page";
import { CommitmentTimeline } from "@/components/proof/CommitmentTimeline";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Atividade — I Did It." },
      { name: "description", content: "Um registro transparente e cronológico de cada regra, prova e decisão." },
      { property: "og:title", content: "Atividade — I Did It." },
      { property: "og:description", content: "Um registro transparente e cronológico de cada regra, prova e decisão." },
    ],
  }),
  component: () => {
    const { activity } = useProof();
    return (
      <Page narrow>
        <h1 className="display text-4xl sm:text-5xl">Atividade</h1>
        <p className="mt-3 text-muted-foreground">Cada regra, prova e decisão — registrada.</p>
        <div className="mt-12"><CommitmentTimeline events={activity} /></div>
      </Page>
    );
  },
});
