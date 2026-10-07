import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/proof/Page";
import { CommitmentTimeline } from "@/components/proof/CommitmentTimeline";
import { useProof } from "@/lib/proof/store";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Activity — Proof." },
      { name: "description", content: "A transparent, chronological record of every rule, proof and decision." },
      { property: "og:title", content: "Activity — Proof." },
      { property: "og:description", content: "A transparent, chronological record of every rule, proof and decision." },
    ],
  }),
  component: () => {
    const { activity } = useProof();
    return (
      <Page narrow>
        <h1 className="display text-4xl sm:text-5xl">Activity</h1>
        <p className="mt-3 text-muted-foreground">Every rule, proof and decision — on the record.</p>
        <div className="mt-12"><CommitmentTimeline events={activity} /></div>
      </Page>
    );
  },
});
