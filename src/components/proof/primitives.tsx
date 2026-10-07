import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, Circle, CircleDot, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CommitmentStatus, CriterionStatus, Criterion, VerdictStatus } from "@/lib/proof/types";
import { deadlineLabel, money } from "@/lib/proof/format";

export const btn = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:opacity-90",
        accent: "bg-accent text-accent-foreground hover:brightness-105 shadow-[var(--shadow-soft)]",
        outline: "border border-border-strong bg-surface text-foreground hover:bg-secondary",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-secondary",
        danger: "bg-danger text-primary-foreground hover:opacity-90",
        success: "bg-success text-primary-foreground hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3 text-sm rounded-md",
        md: "h-10 px-4 text-sm rounded-md",
        lg: "h-12 px-6 text-[15px] rounded-lg",
        xl: "h-14 px-8 text-base rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof btn>>(
  ({ className, variant, size, ...p }, ref) => <button ref={ref} className={cn(btn({ variant, size }), className)} {...p} />,
);
Button.displayName = "Button";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-xl font-semibold tracking-[-0.04em]", className)}>
      I Did It<span className="text-accent">.</span>
    </span>
  );
}

const statusMap: Record<CommitmentStatus, { label: string; cls: string }> = {
  active: { label: "In progress", cls: "bg-secondary text-foreground" },
  awaiting_verification: { label: "Awaiting verification", cls: "bg-warning-soft text-warning" },
  passed: { label: "Passed", cls: "bg-success-soft text-success" },
  failed: { label: "Failed", cls: "bg-danger-soft text-danger" },
};

export function StatusBadge({ status, className }: { status: CommitmentStatus; className?: string }) {
  const s = statusMap[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", s.cls, className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

export function MoneyAtStake({ amount, currency, size = "md", tone = "default" }: { amount: number; currency: string; size?: "md" | "lg"; tone?: "default" | "danger" | "success" }) {
  return (
    <span
      className={cn(
        "tabular font-semibold tracking-tight",
        size === "lg" ? "text-4xl" : "text-base",
        tone === "danger" && "text-danger",
        tone === "success" && "text-success",
      )}
    >
      {money(amount, currency)}
    </span>
  );
}

export function DeadlineLabel({ iso, className }: { iso: string; className?: string }) {
  const d = deadlineLabel(iso);
  return (
    <span
      className={cn(
        "text-sm",
        d.urgency === "calm" && "text-muted-foreground",
        d.urgency === "soon" && "text-warning font-medium",
        d.urgency === "urgent" && "text-danger font-medium",
        d.urgency === "past" && "text-muted-foreground",
        className,
      )}
    >
      {d.text}
    </span>
  );
}

const critIcon: Record<CriterionStatus, ReactNode> = {
  met: <Check className="size-3.5" strokeWidth={2.5} />,
  progress: <CircleDot className="size-3.5" />,
  pending: <Circle className="size-3.5" />,
  failed: <X className="size-3.5" strokeWidth={2.5} />,
};

export function CriteriaList({ criteria, numbered }: { criteria: Criterion[]; numbered?: boolean }) {
  return (
    <ul className="divide-y divide-border">
      {criteria.map((c, i) => (
        <li key={c.id} className="flex items-center gap-3 py-3.5">
          {numbered ? (
            <span className="tabular w-5 text-sm text-muted-foreground">{i + 1}.</span>
          ) : (
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full",
                c.status === "met" && "bg-success-soft text-success",
                c.status === "progress" && "bg-accent-soft text-accent",
                c.status === "pending" && "bg-secondary text-muted-foreground",
                c.status === "failed" && "bg-danger-soft text-danger",
              )}
            >
              {critIcon[c.status]}
            </span>
          )}
          <span className={cn("flex-1 text-[15px]", c.status === "pending" && !numbered && "text-muted-foreground")}>{c.description}</span>
          {c.target !== undefined && c.current !== undefined && (
            <span className="tabular text-sm text-muted-foreground">
              {c.current} / {c.target} {c.unit}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ProgressBar({ value, max, tone = "accent" }: { value: number; max: number; tone?: "accent" | "success" | "danger" }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", tone === "accent" && "bg-accent", tone === "success" && "bg-success", tone === "danger" && "bg-danger")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="eyebrow mb-1.5">{label}</div>
      <div className="text-[15px] font-medium">{children}</div>
    </div>
  );
}

export const verdictMeta: Record<VerdictStatus, { label: string; icon: ReactNode; cls: string }> = {
  verified: { label: "Verified", icon: <Check className="size-4" strokeWidth={2.5} />, cls: "bg-success-soft text-success" },
  failed: { label: "Not met", icon: <X className="size-4" strokeWidth={2.5} />, cls: "bg-danger-soft text-danger" },
  insufficient_evidence: { label: "Insufficient evidence", icon: <X className="size-4" strokeWidth={2.5} />, cls: "bg-danger-soft text-danger" },
  needs_review: { label: "Needs review", icon: <AlertCircle className="size-4" />, cls: "bg-warning-soft text-warning" },
};

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-secondary", className)} />;
}

export const inputCls =
  "w-full rounded-lg border border-input bg-surface px-3.5 py-2.5 text-[15px] placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring/15 focus:border-foreground/40 transition";
