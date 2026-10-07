/**
 * AI roles. These are mocked locally with deterministic heuristics so the
 * whole journey works offline. Swap the bodies for a server function that
 * calls an LLM — the input/output contracts are the stable interface.
 */
import type { Commitment, Evidence, VerificationMethod, Verdict, Provider } from "./types";

export interface GoalArchitectResult {
  isVerifiable: boolean;
  warning?: string | undefined;
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
  const s = new Date().toLocaleDateString("pt-BR", { month: "long", day: "numeric" });
  const e = end.toLocaleDateString("pt-BR", { month: "long", day: "numeric" });
  return `entre ${s} e ${e}`;
}

function titleCase(s: string) {
  const t = s.replace(/^(i (want|will|need) to |(eu )?(quero|vou|preciso) )/i, "").replace(/[.!]$/, "").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export async function goalArchitect(raw: string): Promise<GoalArchitectResult> {
  await delay(1400);
  const g = raw.toLowerCase();
  const end = endOfMonth();
  const deadline = end.toISOString();
  const r = range(end);
  const hasNumber = /\d/.test(g);

  if (/(run|km|marathon|jog|corr(er|ida)|maratona)/.test(g)) {
    const km = g.match(/(\d+)\s*km/)?.[1] ?? "100";
    return {
      isVerifiable: hasNumber,
      warning: hasNumber ? undefined : "“Correr mais” não pode ser verificado. Distância pode.",
      title: `Correr ${km} km`,
      measurableGoal: `Completar pelo menos ${km} km de corrida ${r}.`,
      criteria: [`Correr pelo menos ${km} km no total ${r}`, "Atividades registradas no Strava com GPS", "Nenhuma atividade sozinha conta mais de 30% do total"],
      suggestedMethods: ["data"],
      suggestedProviders: ["strava"],
      suggestedDeadline: deadline,
    };
  }
  if (/(portfolio|portfólio|ship|launch|website|app|build|lançar|publicar o site|site|aplicativo|construir|criar)/.test(g)) {
    return {
      isVerifiable: true,
      title: titleCase(raw).replace(/ (by|até) .*/i, ""),
      measurableGoal: `Publicar uma versão funcional, acessível ao público, com o código-fonte no GitHub ${r}.`,
      criteria: [
        "O site está acessível ao público",
        "O código-fonte está no GitHub",
        "Pelo menos 10 commits foram feitos durante o período do compromisso",
        "O README explica o projeto",
        "A funcionalidade principal pode ser demonstrada",
      ],
      suggestedMethods: ["ai", "data"],
      suggestedProviders: ["github"],
      suggestedDeadline: deadline,
    };
  }
  if (/(study|learn|spanish|read|practice|estud|aprend|espanhol|\bler\b|leitura|pratic)/.test(g)) {
    const SUBJECTS: Record<string, string> = {
      spanish: "espanhol", espanhol: "espanhol",
      french: "francês", francês: "francês", frances: "francês",
      guitar: "violão", violão: "violão", violao: "violão", guitarra: "guitarra",
      piano: "piano",
      math: "matemática", matemática: "matemática", matematica: "matemática",
      coding: "programação", programação: "programação", programacao: "programação",
    };
    const subject = g.match(/(spanish|french|guitar|piano|math|coding|espanhol|francês|frances|violão|violao|guitarra|matemática|matematica|programação|programacao)/)?.[1];
    const s = subject ? SUBJECTS[subject] : undefined;
    const hours = g.match(/(\d+)\s*h/)?.[1] ?? "20";
    return {
      isVerifiable: hasNumber,
      warning: hasNumber ? undefined : "Esta meta é difícil de verificar. “Mais” não tem linha de chegada.",
      title: s ? `Estudar ${s} por ${hours} horas` : `Estudar por ${hours} horas`,
      measurableGoal: s ? `Estudar pelo menos ${hours} horas de ${s} ${r}.` : `Estudar com foco por pelo menos ${hours} horas ${r}.`,
      criteria: [`Pelo menos ${hours} horas de sessões de estudo registradas`, "Sessões registradas no Google Calendar, com 25+ minutos cada", "Estudo distribuído em pelo menos 3 semanas diferentes"],
      suggestedMethods: ["data", "ai"],
      suggestedProviders: ["google_calendar"],
      suggestedDeadline: deadline,
    };
  }
  if (/(exercise|workout|gym|fit|exerc|treino|academia|malhar)/.test(g)) {
    return {
      isVerifiable: false,
      warning: "Esta meta não é objetiva o bastante para ser verificada.",
      title: "Concluir 12 treinos",
      measurableGoal: `Concluir pelo menos 12 treinos de 30+ minutos ${r}.`,
      criteria: ["12 treinos de pelo menos 30 minutos", "Cada treino registrado no Strava", "No máximo um treino contado por dia"],
      suggestedMethods: ["data"],
      suggestedProviders: ["strava"],
      suggestedDeadline: deadline,
    };
  }
  if (/(publish|write|article|blog|post|publicar|escrever|artigo)/.test(g)) {
    const n = g.match(/(\d+)/)?.[1] ?? "4";
    return {
      isVerifiable: true,
      title: n === "1" ? "Publicar 1 artigo" : `Publicar ${n} artigos`,
      measurableGoal: n === "1" ? `Publicar 1 artigo original com 800+ palavras ${r}.` : `Publicar ${n} artigos originais com 800+ palavras ${r}.`,
      criteria: [n === "1" ? "1 artigo publicado publicamente em uma URL própria" : `${n} artigos publicados publicamente em URLs distintas`, "Cada artigo tem pelo menos 800 palavras", "Cada artigo foi publicado pela primeira vez durante o período do compromisso"],
      suggestedMethods: ["ai"],
      suggestedProviders: [],
      suggestedDeadline: deadline,
    };
  }
  return {
    isVerifiable: hasNumber,
    warning: hasNumber ? undefined : "Esta meta é difícil de verificar. Adicione um número e uma linha de chegada.",
    title: titleCase(raw),
    measurableGoal: `${titleCase(raw)} — com um resultado concreto e verificável ${r}.`,
    criteria: ["Existe um resultado específico e mensurável", "As evidências têm data dentro do período do compromisso", "Um terceiro conseguiria confirmar sem precisar perguntar a você"],
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
      return { criterionId: c.id, status: "verified", confidence: 0.98, reasoning: "Confirmado pela fonte de dados conectada.", evidenceUsed: ["Dados conectados"] };
    }
    if (ev.length === 0) {
      return { criterionId: c.id, status: "insufficient_evidence", confidence: 0.9, reasoning: "Nenhuma evidência foi enviada para este objetivo.", evidenceUsed: [] };
    }
    const joined = ev.map((e) => e.value).join(" ");
    const isVideo = /\.(mp4|mov|webm)$/i.test(joined);
    const isUrl = /https?:\/\/|\.[a-z]{2,}\//i.test(joined) || /^[\w-]+\.[a-z]{2,}/i.test(joined);
    const thin = joined.trim().length < 12;
    if (c.target && c.current !== undefined && c.current < c.target) {
      return { criterionId: c.id, status: "failed", confidence: 0.95, reasoning: `Apenas ${c.current} de ${c.target} ${c.unit ?? ""} detectados. A meta travada não foi atingida.`, evidenceUsed: ev.map((e) => e.value) };
    }
    if (isVideo && /function|demo|work|funcion|demonstr/i.test(c.description)) {
      return { criterionId: c.id, status: "needs_review", confidence: 0.54, reasoning: "O vídeo pode mostrar o recurso, mas o fluxo principal não é demonstrado com clareza do início ao fim. Sinalizado para revisão humana em vez de uma decisão forçada.", evidenceUsed: ev.map((e) => e.value) };
    }
    if (thin && !isUrl) {
      return { criterionId: c.id, status: "insufficient_evidence", confidence: 0.82, reasoning: "A explicação sozinha não é verificável. Anexe um link, arquivo ou dado que possa ser conferido.", evidenceUsed: ev.map((e) => e.value) };
    }
    return { criterionId: c.id, status: "verified", confidence: isUrl ? 0.93 : 0.81, reasoning: isUrl ? "O link enviado abre e o conteúdo corresponde ao objetivo." : "A evidência enviada atende ao objetivo como foi escrito.", evidenceUsed: ev.map((e) => e.value) };
  });
}
