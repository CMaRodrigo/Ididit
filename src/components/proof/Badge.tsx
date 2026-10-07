import { useId } from "react";
import { Award, BookOpen, Dumbbell, Footprints, Languages, PenLine, Rocket, Sunrise } from "lucide-react";
import type { Achievement, AchievementCategory } from "@/lib/proof/types";
import { cn } from "@/lib/utils";

const icons = { run: Footprints, ship: Rocket, language: Languages, sunrise: Sunrise, write: PenLine, study: BookOpen, fitness: Dumbbell, award: Award } as const;

function polygon(sides: number, r: number, rot = -90) {
  return Array.from({ length: sides }, (_, i) => {
    const a = ((rot + (360 / sides) * i) * Math.PI) / 180;
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
  }).join(" ");
}

function Shape({ category, r, ...p }: { category: AchievementCategory; r: number } & React.SVGProps<SVGElement>) {
  const props = p as React.SVGProps<SVGPolygonElement>;
  switch (category) {
    case "fitness": return <polygon points={polygon(6, r)} {...props} />;
    case "career": return <polygon points={polygon(8, r, -67.5)} {...props} />;
    case "creative": return <polygon points={polygon(4, r, -90)} {...props} />;
    case "education": return <path d={`M50 ${50 - r} L${50 + r} ${50 - r * 0.55} L${50 + r} ${50 + r * 0.2} Q${50 + r} ${50 + r * 0.8} 50 ${50 + r} Q${50 - r} ${50 + r * 0.8} ${50 - r} ${50 + r * 0.2} L${50 - r} ${50 - r * 0.55} Z`} {...(p as React.SVGProps<SVGPathElement>)} />;
    case "skills": return <polygon points={polygon(12, r)} {...props} />;
    default: return <circle cx={50} cy={50} r={r} {...(p as React.SVGProps<SVGCircleElement>)} />;
  }
}

/** Badge artwork. Uses AI image when available, otherwise a category seal with the icon. */
export function BadgeArt({ a, className }: { a: Pick<Achievement, "category" | "icon" | "badgeImageUrl" | "badgeName">; className?: string }) {
  const id = useId().replace(/:/g, "");
  const Icon = icons[a.icon as keyof typeof icons] ?? Award;
  if (a.badgeImageUrl) return <img src={a.badgeImageUrl} alt={a.badgeName} className={cn("aspect-square object-contain", className)} />;
  return (
    <div className={cn("relative aspect-square", className)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full drop-shadow-[0_10px_18px_oklch(0.2_0.01_80/0.25)]">
        <defs>
          <linearGradient id={`m${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--badge-metal-hi)" />
            <stop offset="0.55" stopColor="var(--badge-metal)" />
            <stop offset="1" stopColor="var(--badge-metal-lo)" />
          </linearGradient>
          <radialGradient id={`s${id}`} cx="0.3" cy="0.2" r="0.9">
            <stop offset="0" stopColor="var(--badge-face-hi)" />
            <stop offset="1" stopColor="var(--badge-face)" />
          </radialGradient>
        </defs>
        <Shape category={a.category} r={47} fill={`url(#m${id})`} />
        <Shape category={a.category} r={41} fill={`url(#s${id})`} />
        <Shape category={a.category} r={37} fill="none" stroke="var(--badge-accent)" strokeWidth={0.8} strokeOpacity={0.7} strokeDasharray="1 2" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <Icon className="size-[34%] text-[var(--badge-ink)]" strokeWidth={1.4} />
      </div>
    </div>
  );
}

export function MysteryBadge({ className }: { className?: string }) {
  return (
    <div className={cn("grid aspect-square place-items-center rounded-full border border-dashed border-border-strong text-2xl font-light text-muted-foreground/60", className)}>?</div>
  );
}
