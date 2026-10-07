import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Lock, X } from "lucide-react";
import { Button, inputCls, Logo } from "@/components/proof/primitives";
import { shortDate } from "@/lib/proof/format";
import { useProof } from "@/lib/proof/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/referee/$token")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Verify a commitment — I Did It." },
      { name: "description", content: "You've been asked to review proof for a commitment." },
      { property: "og:title", content: "Verify a commitment — I Did It." },
      { property: "og:description", content: "You've been asked to review proof for a commitment." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Referee,
});

function Referee() {
  const { token } = Route.useParams();
  const { commitments, user, refereeDecision, hydrated } = useProof();
  const c = commitments.find((x) => x.referee?.token === token);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!hydrated) return null;
  if (!c) {
    return <div className="grid min-h-screen place-items-center text-muted-foreground">This link is invalid or has expired.</div>;
  }
  const decided = c.referee!.status !== "pending";

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-2xl items-center justify-between px-6 py-6">
        <Logo />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3" /> Secure referee link</span>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-20 pt-10">
        <h1 className="display text-4xl sm:text-5xl">{user.name} asked you to verify a commitment.</h1>

        <div className="panel mt-12 divide-y divide-border">
          <div className="p-6">
            <div className="eyebrow mb-2">Goal</div>
            <div className="text-xl font-semibold tracking-tight">{c.title} before {shortDate(c.deadline)}</div>
          </div>
          <div className="p-6">
            <div className="eyebrow mb-2">Success criteria</div>
            <p className="text-[15px]">{c.measurableGoal}</p>
          </div>
          <div className="p-6">
            <div className="eyebrow mb-2">Evidence submitted</div>
            {c.evidence.length > 0 ? (
              <ul className="space-y-1 text-[15px]">{c.evidence.map((e) => <li key={e.id}>{e.value}</li>)}</ul>
            ) : c.headline ? (
              <div>
                <div className="text-[15px]">{c.providers[0] ? "Strava activity summary" : "Tracked data"}</div>
                <div className="tabular mt-1 text-3xl font-semibold tracking-tight">{c.headline.current} {c.headline.unit}</div>
              </div>
            ) : (
              <p className="text-muted-foreground">No evidence yet.</p>
            )}
          </div>
        </div>

        {decided ? (
          <div className={cn("mt-10 rounded-xl p-6", c.referee!.status === "approved" ? "bg-success-soft text-success" : "bg-danger-soft text-danger")}>
            <div className="font-semibold">{c.referee!.status === "approved" ? "You approved this proof." : "You rejected this proof."}</div>
            {c.referee!.reason && <p className="mt-1 text-sm">“{c.referee!.reason}”</p>}
            <p className="mt-2 text-sm text-muted-foreground">{user.name} has been notified. Thanks for keeping them honest.</p>
          </div>
        ) : (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold tracking-tight">Does this evidence satisfy the commitment?</h2>
            {rejecting ? (
              <div className="mt-6">
                <textarea autoFocus className={cn(inputCls, "min-h-24")} placeholder="Reason for rejecting (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
                <div className="mt-3 flex gap-2">
                  <Button variant="danger" size="lg" disabled={reason.trim().length < 3} onClick={() => refereeDecision(token, false, reason.trim())}>Confirm rejection</Button>
                  <Button variant="ghost" size="lg" onClick={() => setRejecting(false)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="success" size="xl" onClick={() => refereeDecision(token, true)}><Check className="size-4" /> Approve</Button>
                <Button variant="outline" size="xl" onClick={() => setRejecting(true)}><X className="size-4" /> Reject</Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
