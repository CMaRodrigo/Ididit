import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoActivity, demoCommitments, DEMO_USER } from "./demo-data";
import type { Achievement, ActivityEvent, Commitment, Evidence, ProofDocument, Verdict } from "./types";
import { badgeGenerator } from "./badges";
import { demoTrophies } from "./demo-trophies";
import { uid } from "./format";
import { simulatedStakes } from "./payments";

interface State {
  user: typeof DEMO_USER;
  signedIn: boolean;
  commitments: Commitment[];
  activity: ActivityEvent[];
  achievements: Achievement[];
  integrations: Record<string, boolean>;
}

const initial: State = {
  user: DEMO_USER,
  signedIn: true,
  commitments: demoCommitments,
  activity: demoActivity,
  achievements: [],
  integrations: { github: true, strava: true, google_calendar: false },
};

const KEY = "proof.state.v2";

interface Ctx extends State {
  hydrated: boolean;
  get: (id: string) => Commitment | undefined;
  lock: (c: Omit<Commitment, "id" | "createdAt" | "lockedAt" | "status" | "evidence" | "runs">) => Promise<string>;
  submitEvidence: (id: string, evidence: Evidence[]) => void;
  recordVerdicts: (id: string, verdicts: Verdict[]) => void;
  refereeDecision: (token: string, approved: boolean, reason?: string) => void;
  toggleIntegration: (p: string) => void;
  signIn: (name?: string, email?: string) => void;
  signOut: () => void;
  reset: () => void;
  saveReflection: (id: string, reflection: string) => void;
  saveMeaning: (id: string, meaning: string) => void;
  addDocuments: (id: string, documents: ProofDocument[]) => void;
  removeDocument: (id: string, documentId: string) => void;
}

// Supplied records refresh their bundled text, dates, objectives, stakes, meaning, reflection and documents while keeping the owner's edits and uploads.
function refreshDemo(c: Commitment): Commitment {
  const seed = c.demo ? demoCommitments.find((d) => d.id === c.id) : undefined;
  if (!seed) return c;
  const bundled = seed.documents ?? [];
  const uploaded = (c.documents ?? []).filter((d) => !bundled.some((b) => b.id === d.id));
  const meaning = c.meaningEdited ? c.meaning : seed.meaning;
  const reflection = c.reflectionEdited ? c.reflection : seed.reflection;
  return { ...c, title: seed.title, measurableGoal: seed.measurableGoal, failureDestination: seed.failureDestination, evidence: seed.evidence, ...(seed.verificationSource !== undefined && { verificationSource: seed.verificationSource }), ...(seed.progression !== undefined && { progression: seed.progression }), ...(seed.contextMetric !== undefined && { contextMetric: seed.contextMetric }), ...(reflection !== undefined && { reflection }), createdAt: seed.createdAt, lockedAt: seed.lockedAt, deadline: seed.deadline, completedAt: seed.completedAt, datesFromDocuments: seed.datesFromDocuments, stake: seed.stake, currency: seed.currency, criteria: seed.criteria, runs: seed.runs, ...(meaning !== undefined && { meaning }), documents: [...bundled, ...uploaded] };
}

const StoreCtx = createContext<Ctx | null>(null);

export function ProofStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        const oldDemoIds = new Set(["run-100", "portfolio", "spanish", "early-bird", "articles"]);
        const hasNewDemo = saved.commitments?.some((c) => c.id === "projeto-rondon");
        const migrated = hasNewDemo ? saved.commitments : [...demoCommitments, ...(saved.commitments ?? []).filter((c) => !oldDemoIds.has(c.id))];
        setState({ ...initial, ...saved, commitments: [...(migrated ?? demoCommitments).map(refreshDemo), ...demoCommitments.filter((d) => !migrated?.some((c) => c.id === d.id))],
          activity: hasNewDemo ? [...(saved.activity ?? demoActivity).map((e) => demoActivity.find((d) => d.id === e.id) ?? e), ...demoActivity.filter((d) => !saved.activity?.some((e) => e.id === d.id))].sort((a, b) => b.at.localeCompare(a.at)) : [...demoActivity, ...(saved.activity ?? []).filter((e) => !oldDemoIds.has(e.commitmentId))],
          achievements: (saved.achievements ?? []).filter((a) => !oldDemoIds.has(a.commitmentId)).map((a) => {
            const trophy = demoTrophies[a.commitmentId];
            const isDemo = migrated?.some((c) => c.id === a.commitmentId && c.demo);
            const seed = demoCommitments.find((c) => c.id === a.commitmentId);
            return trophy && isDemo ? { ...a, badgeName: trophy.badge_name, badgeSubtitle: trophy.badge_subtitle, badgeImageUrl: trophy.image, earnedAt: seed?.completedAt ?? a.earnedAt } : a;
          }),
          user: { ...initial.user, ...saved.user, name: DEMO_USER.name, bio: DEMO_USER.bio },
          signedIn: true,
        });
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  // Every verified commitment earns exactly one achievement. Failed ones never do.
  useEffect(() => {
    if (!hydrated) return;
    const missing = state.commitments.filter((c) => c.status === "passed" && c.criteria.length > 0 && c.criteria.every((cr) => cr.status === "met") && !state.achievements.some((a) => a.commitmentId === c.id));
    if (missing.length === 0) return;
    setState((s) => ({
      ...s,
      achievements: [
        ...missing.filter((c) => !s.achievements.some((a) => a.commitmentId === c.id)).map((c) => badgeGenerator(c)),
        ...s.achievements,
      ],
    }));
  }, [hydrated, state.commitments, state.achievements]);

  const log = (s: State, e: Omit<ActivityEvent, "id" | "at">): State => ({
    ...s,
    activity: [{ ...e, id: uid("ev"), at: new Date().toISOString() }, ...s.activity],
  });

  const get = useCallback((id: string) => state.commitments.find((c) => c.id === id), [state.commitments]);

  const lock: Ctx["lock"] = useCallback(async (draft) => {
    const id = uid("c");
    await simulatedStakes.authorize({ commitmentId: id, amount: draft.stake, currency: draft.currency });
    const now = new Date().toISOString();
    setState((s) => {
      const c: Commitment = { ...draft, id, createdAt: now, lockedAt: now, status: "active", evidence: [], runs: [] };
      let n = { ...s, commitments: [c, ...s.commitments] };
      n = log(n, { commitmentId: id, type: "rules_created", description: `${c.criteria.length} ${c.criteria.length === 1 ? "objetivo definido" : "objetivos definidos"} para “${c.title}”` });
      n = log(n, { commitmentId: id, type: "locked", description: `Compromisso travado — “${c.title}”` });
      return n;
    });
    return id;
  }, []);

  const update = (s: State, id: string, fn: (c: Commitment) => Commitment): State => ({
    ...s,
    commitments: s.commitments.map((c) => (c.id === id ? fn(c) : c)),
  });

  const submitEvidence: Ctx["submitEvidence"] = useCallback((id, evidence) => {
    setState((s) => {
      const c = s.commitments.find((x) => x.id === id);
      let n = update(s, id, (c) => ({ ...c, evidence: [...c.evidence, ...evidence], status: "awaiting_verification" }));
      n = log(n, { commitmentId: id, type: "evidence_submitted", description: `Prova enviada para “${c?.title}” (${evidence.length} ${evidence.length === 1 ? "item" : "itens"})` });
      return n;
    });
  }, []);

  const recordVerdicts: Ctx["recordVerdicts"] = useCallback((id, verdicts) => {
    setState((s) => {
      const c = s.commitments.find((x) => x.id === id);
      if (!c) return s;
      const ok = verdicts.filter((v) => v.status === "verified").length;
      const allOk = ok === verdicts.length;
      const past = new Date(c.deadline).getTime() < Date.now();
      const status = allOk ? "passed" : past ? "failed" : "active";
      let n = update(s, id, (c) => ({
        ...c,
        status,
        completedAt: status === "passed" ? new Date().toISOString() : c.completedAt,
        runs: [...c.runs, { id: uid("run"), ranAt: new Date().toISOString(), verdicts }],
        criteria: c.criteria.map((cr) => {
          const v = verdicts.find((v) => v.criterionId === cr.id);
          return v?.status === "verified" ? { ...cr, status: "met" } : cr;
        }),
      }));
      n = log(n, { commitmentId: id, type: "verification", description: `Juiz de IA verificou ${ok} / ${verdicts.length} objetivos de “${c.title}”` });
      if (status !== "active")
        n = log(n, { commitmentId: id, type: "result", description: status === "passed" ? `Concluído — valor em jogo devolvido em “${c.title}” (simulado)` : `Não concluído — consequência acionada em “${c.title}” (simulado)` });
      return n;
    });
  }, []);

  const refereeDecision: Ctx["refereeDecision"] = useCallback((token, approved, reason) => {
    setState((s) => {
      const c = s.commitments.find((x) => x.referee?.token === token);
      if (!c?.referee) return s;
      const referee = c.referee;
      let n = update(s, c.id, (c) => ({ ...c, referee: { ...referee, status: approved ? "approved" : "rejected", reason } }));
      n = log(n, { commitmentId: c.id, type: "verification", description: `${referee.name} ${approved ? "aprovou" : "rejeitou"} a prova de “${c.title}”${reason ? ` — “${reason}”` : ""}` });
      return n;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      hydrated,
      get,
      lock,
      submitEvidence,
      recordVerdicts,
      refereeDecision,
      toggleIntegration: (p) => setState((s) => ({ ...s, integrations: { ...s.integrations, [p]: !s.integrations[p] } })),
      signIn: (name, email) => setState((s) => ({ ...s, signedIn: true, user: { ...s.user, name: name || s.user.name, email: email || s.user.email } })),
      signOut: () => setState((s) => ({ ...s, signedIn: false })),
      reset: () => setState(initial),
      saveMeaning: (id, meaning) => setState((s) => update(s, id, (c) => ({ ...c, meaning: meaning.trim(), meaningEdited: true }))),
      addDocuments: (id, documents) => setState((s) => {
        const c = s.commitments.find((x) => x.id === id);
        const n = update(s, id, (c) => ({ ...c, documents: [...(c.documents ?? []), ...documents] }));
        return log(n, { commitmentId: id, type: "evidence_submitted", description: `${documents.length} ${documents.length === 1 ? "documento de prova adicionado" : "documentos de prova adicionados"} a “${c?.title}”` });
      }),
      removeDocument: (id, documentId) => setState((s) => update(s, id, (c) => ({ ...c, documents: (c.documents ?? []).filter((d) => d.id !== documentId || d.src) }))),
      saveReflection: (id, reflection) => setState((s) => update(s, id, (c) => c.status === "passed" || c.status === "failed" ? { ...c, reflection: reflection.trim(), reflectionEdited: true } : c)),
    }),
    [state, hydrated, get, lock, submitEvidence, recordVerdicts, refereeDecision],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useProof() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useProof outside provider");
  return c;
}
