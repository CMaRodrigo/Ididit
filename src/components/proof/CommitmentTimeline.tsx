import type { ActivityEvent } from "@/lib/proof/types";
import { shortDate, time } from "@/lib/proof/format";
import { cn } from "@/lib/utils";

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return shortDate(iso);
}

const dot: Record<ActivityEvent["type"], string> = {
  rules_created: "bg-muted-foreground",
  locked: "bg-foreground",
  progress: "bg-accent",
  evidence_submitted: "bg-warning",
  verification: "bg-foreground",
  result: "bg-success",
};

export function CommitmentTimeline({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) return <p className="text-sm text-muted-foreground">No events yet.</p>;
  const groups: { label: string; items: ActivityEvent[] }[] = [];
  [...events].sort((a, b) => b.at.localeCompare(a.at)).forEach((e) => {
    const l = dayLabel(e.at);
    const g = groups[groups.length - 1];
    if (g && g.label === l) g.items.push(e);
    else groups.push({ label: l, items: [e] });
  });
  return (
    <div className="space-y-8" suppressHydrationWarning>
      {groups.map((g) => (
        <div key={g.label} className="grid gap-3 sm:grid-cols-[120px_1fr]">
          <div className="text-sm font-medium" suppressHydrationWarning>{g.label}</div>
          <ul className="space-y-0 border-l border-border">
            {g.items.map((e) => (
              <li key={e.id} className="relative pb-5 pl-6 last:pb-0">
                <span className={cn("absolute -left-[4.5px] top-1.5 size-2 rounded-full ring-4 ring-background", dot[e.type], e.type === "result" && /Failed/.test(e.description) && "bg-danger")} />
                <div className="text-[15px]">{e.description}</div>
                <div className="tabular mt-0.5 text-xs text-muted-foreground" suppressHydrationWarning>{time(e.at)}</div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
