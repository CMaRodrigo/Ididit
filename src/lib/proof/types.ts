export type CommitmentStatus =
  | "active"
  | "awaiting_verification"
  | "passed"
  | "failed";

export type VerificationMethod = "ai" | "data" | "referee";
export type Provider = "github" | "strava" | "google_calendar";

export type CriterionStatus = "met" | "progress" | "pending" | "failed";

export interface Criterion {
  id: string;
  description: string;
  target?: number;
  current?: number;
  unit?: string;
  status: CriterionStatus;
}

export interface Evidence {
  id: string;
  criterionId: string;
  type: "url" | "file" | "text" | "github";
  value: string;
  submittedAt: string;
}

export type VerdictStatus = "verified" | "failed" | "insufficient_evidence" | "needs_review";

export interface Verdict {
  criterionId: string;
  status: VerdictStatus;
  confidence: number;
  reasoning: string;
  evidenceUsed: string[];
}

export interface VerificationRun {
  id: string;
  ranAt: string;
  verdicts: Verdict[];
}

export interface Referee {
  name: string;
  email: string;
  token: string;
  status: "pending" | "approved" | "rejected";
  reason?: string | undefined;
}

export interface ActivityEvent {
  id: string;
  commitmentId: string;
  type:
    | "rules_created"
    | "locked"
    | "progress"
    | "evidence_submitted"
    | "verification"
    | "result";
  description: string;
  at: string;
}

export interface Commitment {
  id: string;
  title: string;
  measurableGoal: string;
  status: CommitmentStatus;
  createdAt: string;
  lockedAt: string;
  deadline: string;
  stake: number;
  currency: string;
  failureDestination: string;
  methods: VerificationMethod[];
  providers: Provider[];
  referee?: Referee | undefined;
  criteria: Criterion[];
  evidence: Evidence[];
  runs: VerificationRun[];
  headline?: { current: number; target: number; unit: string };
  completedAt?: string | undefined;
  demo?: boolean;
  verificationSource?: string;
  reflection?: string;
  contextMetric?: { value: string; label: string };
  progression?: string[];
}

export type AchievementCategory = "fitness" | "skills" | "career" | "creative" | "education" | "personal" | "other";

/** One per verified commitment. Mirrors the future `achievements` table. */
export interface Achievement {
  id: string;
  commitmentId: string;
  badgeName: string;
  badgeSubtitle: string;
  badgeDescription: string;
  badgeImageUrl?: string | undefined; // filled once AI image generation is wired
  category: AchievementCategory;
  visualPrompt: string;
  icon: string; // fallback artwork key
  earnedAt: string;
  createdAt: string;
}
