/**
 * AI Badge Generator. Deterministic local mock behind a stable contract —
 * swap the body for a server function that calls an LLM (text) and an image
 * model (visualPrompt -> badgeImageUrl). Only ever called for passed commitments.
 */
import type { Achievement, AchievementCategory, Commitment } from "./types";
import { longDate, uid, verificationLabel } from "./format";
import { demoTrophies } from "./demo-trophies";

export interface BadgeGeneratorOutput {
  badge_name: string;
  badge_subtitle: string;
  badge_description: string;
  achievement_category: AchievementCategory;
  visual_prompt: string;
  icon: string;
}

const spanishNums: Record<number, string> = { 5: "CINCO", 10: "DIEZ", 15: "QUINCE", 20: "VEINTE", 30: "TREINTA", 40: "CUARENTA", 50: "CINCUENTA", 100: "CIEN" };

function month(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long" });
}

export function generateBadge(c: Commitment): BadgeGeneratorOutput {
  const demo = c.demo && demoTrophies[c.id];
  if (demo) return demo;
  const t = `${c.title} ${c.measurableGoal}`.toLowerCase();
  const n = c.headline?.target ?? Number((c.title.match(/\d+(\.\d+)?/) || [])[0]);
  const when = month(c.completedAt ?? c.deadline);
  const style = "minimal premium achievement seal, clean geometric line art, dark brushed metal with a single warm accent, no text";

  if (/\b(run|km|marathon|miles?)\b/.test(t)) {
    const name = n >= 100 ? "CENTURY RUNNER" : n >= 42 ? "LONG HAUL" : `${n || ""} KM RUNNER`.trim();
    return { badge_name: name, badge_subtitle: `${n} km completed in ${when}`, badge_description: `Ran ${n} km, verified by ${verificationLabel(c)}.`, achievement_category: "fitness", visual_prompt: `${style}, running shoe crossing a ${n} km milestone marker`, icon: "run" };
  }
  if (/portfolio|ship|launch|deploy|website|app\b/.test(t))
    return { badge_name: "SHIPPED.", badge_subtitle: "Portfolio launched successfully", badge_description: c.measurableGoal, achievement_category: "career", visual_prompt: `${style}, minimal rocket with subtle code brackets`, icon: "ship" };
  if (/spanish|español/.test(t))
    return { badge_name: `${spanishNums[n] ?? n} HORAS`, badge_subtitle: `${n} hours of Spanish completed`, badge_description: c.measurableGoal, achievement_category: "education", visual_prompt: `${style}, open book merging into a speech bubble`, icon: "language" };
  if (/wake|morning|6:00|sunrise/.test(t))
    return { badge_name: "EARLY BIRD", badge_subtitle: `${n || 30} mornings in a row`, badge_description: c.measurableGoal, achievement_category: "personal", visual_prompt: `${style}, sun rising over a horizon line`, icon: "sunrise" };
  if (/article|write|blog|essay|book/.test(t))
    return { badge_name: "IN PRINT", badge_subtitle: `${n || ""} pieces published`.trim(), badge_description: c.measurableGoal, achievement_category: "creative", visual_prompt: `${style}, fountain pen nib over lined paper`, icon: "write" };
  if (/study|learn|course|hours|read/.test(t))
    return { badge_name: "DEEP WORK", badge_subtitle: c.title, badge_description: c.measurableGoal, achievement_category: "skills", visual_prompt: `${style}, layered book spines`, icon: "study" };
  if (/gym|lift|swim|ride|cycle|workout|steps/.test(t))
    return { badge_name: "IRON WILL", badge_subtitle: c.title, badge_description: c.measurableGoal, achievement_category: "fitness", visual_prompt: `${style}, dumbbell silhouette`, icon: "fitness" };
  const words = c.title.replace(/[^\w\s]/g, "").split(/\s+/).slice(0, 2).join(" ").toUpperCase();
  return { badge_name: words, badge_subtitle: `Completed ${longDate(c.completedAt ?? c.deadline)}`, badge_description: c.measurableGoal, achievement_category: "other", visual_prompt: `${style}, abstract laurel`, icon: "award" };
}

export function badgeGenerator(c: Commitment): Achievement {
  if (c.status !== "passed" || c.criteria.length === 0 || c.criteria.some((cr) => cr.status !== "met")) {
    throw new Error("A trophy requires a successfully verified commitment.");
  }
  const b = generateBadge(c);
  const now = new Date().toISOString();
  return {
    id: uid("ach"),
    commitmentId: c.id,
    badgeName: b.badge_name,
    badgeSubtitle: b.badge_subtitle,
    badgeDescription: b.badge_description,
    badgeImageUrl: c.demo ? demoTrophies[c.id]?.image : undefined,
    category: b.achievement_category,
    visualPrompt: b.visual_prompt,
    icon: b.icon,
    earnedAt: c.completedAt ?? now,
    createdAt: now,
  };
}
