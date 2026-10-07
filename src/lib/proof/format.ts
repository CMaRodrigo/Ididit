import type { Commitment, Provider, VerificationMethod } from "./types";

export function money(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function time(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function daysLeft(iso: string, now = Date.now()) {
  return Math.ceil((new Date(iso).getTime() - now) / 86_400_000);
}

export type Urgency = "calm" | "soon" | "urgent" | "past";

export function deadlineLabel(iso: string): { text: string; urgency: Urgency } {
  const d = daysLeft(iso);
  if (d < 0) return { text: "Deadline passed", urgency: "past" };
  if (d === 0) return { text: "Proof due today", urgency: "urgent" };
  if (d === 1) return { text: "Due tomorrow", urgency: "urgent" };
  if (d <= 3) return { text: `${d} days remaining`, urgency: "soon" };
  return { text: `${d} days remaining`, urgency: "calm" };
}

const providerNames: Record<Provider, string> = {
  github: "GitHub",
  strava: "Strava",
  google_calendar: "Google Calendar",
};

export function providerName(p: Provider) {
  return providerNames[p];
}

const methodNames: Record<VerificationMethod, string> = {
  ai: "AI Judge",
  data: "Automatic data",
  referee: "Referee",
};

export function methodName(m: VerificationMethod) {
  return methodNames[m];
}

export function verificationLabel(c: Pick<Commitment, "methods" | "providers">) {
  const parts: string[] = [];
  if (c.methods.includes("ai")) parts.push("AI Judge");
  c.providers.forEach((p) => parts.push(providerName(p)));
  if (c.methods.includes("referee")) parts.push("Referee");
  if (parts.length === 0) parts.push("Automatic data");
  return parts.join(" + ");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
