import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/proof/Page";
import { TrophyRoom } from "@/components/proof/TrophyRoom";

export const Route = createFileRoute("/app/trophies/")({
  head: () => ({ meta: [
    { title: "Trophy Room — I Did It." },
    { name: "description", content: "Every verified commitment, as a trophy with the proof behind it." },
    { property: "og:title", content: "Trophy Room — I Did It." },
    { property: "og:description", content: "The badge is the symbol. The proof is behind it." },
  ] }),
  component: () => <Page><TrophyRoom /></Page>,
});
