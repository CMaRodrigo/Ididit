import { describe, expect, it } from "vitest";
import { demoCommitments, DEMO_USER } from "@/lib/proof/demo-data";
import { badgeGenerator } from "@/lib/proof/badges";

describe("Rodrigo demo portfolio", () => {
  it("keeps six accomplishments, one failure and one active commitment", () => {
    expect(DEMO_USER.name).toBe("Rodrigo");
    expect(demoCommitments.filter((c) => c.status === "passed")).toHaveLength(6);
    expect(demoCommitments.filter((c) => c.status === "failed")).toHaveLength(1);
    expect(demoCommitments.filter((c) => c.status === "active")).toHaveLength(1);
  });
  it("earns six distinct named images only for completed criteria", () => {
    const trophies = demoCommitments.filter((c) => c.status === "passed").map(badgeGenerator);
    expect(new Set(trophies.map((a) => a.badgeImageUrl)).size).toBe(6);
    expect(trophies.some((a) => a.badgeName === "CASE CLOSED")).toBe(true);
    for (const c of demoCommitments.filter((c) => c.status !== "passed")) expect(() => badgeGenerator(c)).toThrow();
    const first = demoCommitments[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(() => badgeGenerator({ ...first, criteria: [] })).toThrow();
  });
  it("preserves partial success and labels all evidence as illustrative", () => {
    const failed = demoCommitments.find((c) => c.id === "techfellow");
    const active = demoCommitments.find((c) => c.id === "behring-founders");
    expect(failed?.criteria.filter((c) => c.status === "met")).toHaveLength(2);
    expect(active?.criteria.filter((c) => c.status === "met")).toHaveLength(3);
    expect(active?.completedAt).toBeUndefined();
    expect(demoCommitments.every((c) => c.evidence.every((e) => e.value.startsWith("Demo placeholder")))).toBe(true);
  });
});
