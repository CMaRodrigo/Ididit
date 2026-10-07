/**
 * AI roles. These are mocked locally with deterministic heuristics so the
 * whole journey works offline. Swap the bodies for a server function that
 * calls an LLM — the input/output contracts are the stable interface.
 */
import type { Commitment, Evidence, VerificationMethod, Verdict, Provider } from "./types";

export interface GoalArchitectResult {
  isVerifiable: boolean;
  warning?: string;
  measurableGoal: string;
  title: string;
  criteria: string[];
  suggestedMethods: VerificationMethod[];
  suggestedProviders: Provider[];
  suggestedDeadline: string; // ISO
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function endOfMonth() {
  const d = new Date();
  const e = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59);
  if ((e.getTime() - d.getTime()) / 86_400_000 < 7) e.setDate(e.getDate() + 14);
  return e;
}

function range(end: Date) {
  const s = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const e = end.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  return `between ${s} and ${e}`;
}

function titleCase(s: string) {
  const t = s.replace(/^i (want|will|need) to /i, "").replace(/[.!]$/, "").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export async function goalArchitect(raw: string): Promise<GoalArchitectResult> {
  await delay(1400);
  const g = raw.toLowerCase();
  const end = endOfMonth();
  const deadline = end.toISOString();
  const r = range(end);
  const hasNumber = /\d/.test(g);

  if (/(run|km|marathon|jog)/.test(g)) {
    const km = g.match(/(\d+)\s*km/)?.[1] ?? "100";
    return {
      isVerifiable: hasNumber,
      warning: hasNumber ? undefined : "“Run more” can't be checked. Distance can.",
      title: `Run ${km} km`,
      measurableGoal: `Complete at least ${km} km of running ${r}.`,
      criteria: [`Run at least ${km} km total ${r}`, "Activities recorded via Strava with GPS", "No single activity counts more than 30% of the total"],
      suggestedMethods: ["data"],
      suggestedProviders: ["strava"],
      suggestedDeadline: deadline,
    };
  }
  if (/(portfolio|ship|launch|website|app|build)/.test(g)) {
    return {
      isVerifiable: true,
      title: titleCase(raw).replace(/ by .*/i, ""),
      measurableGoal: `Publish a working version publicly with its source on GitHub ${r}.`,
      criteria: [
        "Website is publicly accessible",
        "Source code exists on GitHub",
        "At least 10 commits were made during the commitment period",
        "README explains the project",
        "Main functionality can be demonstrated",
      ],
      suggestedMethods: ["ai", "data"],
      suggestedProviders: ["github"],
      suggestedDeadline: deadline,
    };
  }
  if (/(study|learn|spanish|read|practice)/.test(g)) {
    const subject = g.match(/(spanish|french|guitar|piano|math|coding)/)?.[1];
    const s = subject ? subject[0].toUpperCase() + subject.slice(1) : "focused study";
    const hours = g.match(/(\d+)\s*h/)?.[1] ?? "20";
    return {
      isVerifiable: hasNumber,
      warning: hasNumber ? undefined : "This goal is difficult to verify. “More” has no finish line.",
      title: `Study ${s} for ${hours} hours`,
      measurableGoal: `Study at least ${hours} hours of ${s} ${r}.`,
      criteria: [`At least ${hours} hours of tracked study sessions`, "Sessions logged in Google Calendar, 25+ minutes each", "Study spread across at least 3 separate weeks"],
      suggestedMethods: ["data", "ai"],
      suggestedProviders: ["google_calendar"],
      suggestedDeadline: deadline,
    };
  }
  if (/(exercise|workout|gym|fit)/.test(g)) {
    return {
      isVerifiable: false,
      warning: "This goal isn't objective enough to verify.",
      title: "Complete 12 workouts",
      measurableGoal: `Complete at least 12 workouts of 30+ minutes ${r}.`,
      criteria: ["12 workouts of at least 30 minutes", "Each workout recorded in Strava", "No more than one workout counted per day"],
      suggestedMethods: ["data"],
      suggestedProviders: ["strava"],
      suggestedDeadline: deadline,
    };
  }
  if (/(publish|write|article|blog|post)/.test(g)) {
    const n = g.match(/(\d+)/)?.[1] ?? "4";
    return {
      isVerifiable: true,
      title: `Publish ${n} articles`,
      measurableGoal: `Publish ${n} original articles of 800+ words ${r}.`,
      criteria: [`${n} articles publicly published at distinct URLs`, "Each article is at least 800 words", "Each article was first published during the commitment period"],
      suggestedMethods: ["ai"],
      suggestedProviders: [],
      suggestedDeadline: deadline,
    };
  }
  return {
    isVerifiable: hasNumber,
    warning: hasNumber ? undefined : "This goal is difficult to verify. Add a number and a finish line.",
    title: titleCase(raw),
    measurableGoal: `${titleCase(raw)} — with a concrete, checkable output ${r}.`,
    criteria: ["A specific, measurable output exists", "Evidence is dated within the commitment period", "A third party could confirm it without asking you"],
    suggestedMethods: ["ai", "referee"],
    suggestedProviders: [],
    suggestedDeadline: deadline,
  };
}

/**
 * AI Judge. Evaluates evidence ONLY against the locked criteria. It never
 * rewrites, adds or removes rules.
 */
export async function aiJudge(
  commitment: Pick<Commitment, "criteria" | "measurableGoal">,
  evidence: Evidence[],
): Promise<Verdict[]> {
  await delay(2200);
  return commitment.criteria.map((c) => {
    const ev = evidence.filter((e) => e.criterionId === c.id);
    if (c.status === "met") {
      return { criterionId: c.id, status: "verified", confidence: 0.98, reasoning: "Confirmed by connected data source.", evidenceUsed: ["Connected data"] };
    }
    if (ev.length === 0) {
      return { criterionId: c.id, status: "insufficient_evidence", confidence: 0.9, reasoning: "No evidence was submitted for this requirement.", evidenceUsed: [] };
    }
    const joined = ev.map((e) => e.value).join(" ");
    const isVideo = /\.(mp4|mov|webm)$/i.test(joined);
    const isUrl = /https?:\/\/|\.[a-z]{2,}\//i.test(joined) || /^[\w-]+\.[a-z]{2,}/i.test(joined);
    const thin = joined.trim().length < 12;
    if (c.target && c.current !== undefined && c.current < c.target) {
      return { criterionId: c.id, status: "failed", confidence: 0.95, reasoning: `Only ${c.current} of ${c.target} ${c.unit ?? ""} detected. The locked target has not been reached.`, evidenceUsed: ev.map((e) => e.value) };
    }
    if (isVideo && /function|demo|work/i.test(c.description)) {
      return { criterionId: c.id, status: "needs_review", confidence: 0.54, reasoning: "The video may show the feature, but the main flow isn't clearly demonstrated end to end. Flagged for human review rather than a forced decision.", evidenceUsed: ev.map((e) => e.value) };
    }
    if (thin && !isUrl) {
      return { criterionId: c.id, status: "insufficient_evidence", confidence: 0.82, reasoning: "The explanation alone isn't verifiable. Attach a link, file or data that can be checked.", evidenceUsed: ev.map((e) => e.value) };
    }
    return { criterionId: c.id, status: "verified", confidence: isUrl ? 0.93 : 0.81, reasoning: isUrl ? "The submitted link resolves and its content matches the requirement." : "The submitted evidence satisfies the requirement as written.", evidenceUsed: ev.map((e) => e.value) };
  });
}
