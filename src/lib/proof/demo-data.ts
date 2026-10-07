import type { ActivityEvent, Commitment } from "./types";
import toninhathonWinners from "@/assets/proof-toninhathon-winners.png";
import toninhathonCall from "@/assets/proof-toninhathon-call.png";
import toninhathonPitch from "@/assets/proof-toninhathon-saveton.pdf";
import toninhathonPitchPreview from "@/assets/proof-toninhathon-saveton-preview.jpg";
import rondonDeparture from "@/assets/proof-rondon-departure.png";
import rondonWorkPlan from "@/assets/proof-rondon-work-plan.pdf";
import rondonWorkPlanPreview from "@/assets/proof-rondon-work-plan-preview.jpg";
import rondonClassroom from "@/assets/proof-rondon-classroom.jpg";
import rondonGathering from "@/assets/proof-rondon-gathering.jpg";
import rondonWorkshop from "@/assets/proof-rondon-workshop.jpg";
import rondonChildren from "@/assets/proof-rondon-children.jpg";
import ligaTrendFollowing from "@/assets/proof-liga-trend-following.png";
import ligaTaylorRule from "@/assets/proof-liga-taylor-rule.png";
import ligaFinanceWeek from "@/assets/proof-liga-finance-week.png";
import ligaFinanceWeekTeam from "@/assets/proof-liga-finance-week-team.jpg";
import prathamNotion from "@/assets/proof-pratham-notion-preview.png";
import prathamTeamCall from "@/assets/proof-pratham-team-call.jpg";
import detectiveSite from "@/assets/proof-detectivesql-site.jpg";
import detectiveLinkedIn from "@/assets/proof-detectivesql-linkedin.jpg";
import mmaPitch from "@/assets/proof-mma-pitch.jpg";
import mmaAges from "@/assets/proof-mma-ages.jpg";
import mmaTeam from "@/assets/proof-mma-team.jpg";
import ididitGithub from "@/assets/proof-ididit-github.jpg";

export const DEMO_USER = { name: "Rodrigo", bio: "Builder · Engenheiro de Dados · Solucionador de Problemas", email: "", timezone: "America/Sao_Paulo", currency: "USD" };

// `date` is when the commitment was completed (or its latest milestone); `start` is when it began.
// `stakes` sets what each objective is worth (BRL, simulated); the commitment stake is their sum.
function challenge(id: string, title: string, goal: string, rules: string[], evidence: string[], source: string, date: string, extra: Partial<Commitment> & { start?: string; stakes?: number[] } = {}): Commitment {
  const { start = date, stakes = [], ...rest } = extra;
  const status = rest.status ?? "passed";
  const criteria = rules.map((description, i) => ({ id: `${id}-${i + 1}`, description, status: "met" as const }));
  const c: Commitment = {
    id, title, measurableGoal: goal, status, demo: true,
    createdAt: `${start}T09:00:00Z`, lockedAt: `${start}T09:00:00Z`, deadline: `${date}T23:59:00Z`,
    completedAt: status === "passed" ? `${date}T18:00:00Z` : undefined,
    stake: 0, currency: "BRL", failureDestination: "Não especificado no exemplo original",
    methods: ["referee"], providers: [], verificationSource: source, criteria,
    evidence: evidence.map((value, i) => ({ id: `${id}-e${i}`, criterionId: criteria[Math.min(i, criteria.length - 1)]?.id ?? "", type: "text", value: `Demo placeholder — ${value}`, submittedAt: `${date}T17:00:00Z` })),
    runs: [], ...rest,
  };
  c.criteria = c.criteria.map((cr, i) => (stakes[i] === undefined ? cr : { ...cr, stake: stakes[i] }));
  c.stake = c.criteria.reduce((sum, cr) => sum + (cr.stake ?? 0), 0);
  c.runs = [{ id: `${id}-verification`, ranAt: `${date}T18:00:00Z`, verdicts: c.criteria.map((cr) => ({ criterionId: cr.id, status: cr.status === "met" ? "verified" : cr.status === "failed" ? "failed" : "insufficient_evidence", confidence: 1, reasoning: cr.status === "met" ? "Concluído no cenário demo fornecido; os documentos de apoio são ilustrativos." : cr.status === "failed" ? "A aprovação não foi alcançada no cenário demo fornecido." : "Esta etapa ainda não foi concluída; ainda não há verificação final.", evidenceUsed: c.evidence.filter((e) => e.criterionId === cr.id).map((e) => e.id) })) }];
  return c;
}

// Dates illustrate a personal timeline; real historical dates and documents were not supplied.
export const demoCommitments: Commitment[] = [
  challenge("projeto-rondon", "Projeto Rondon", "Criar e conduzir oficinas para jovens com foco em cultura, cidadania e tecnologia.", ["Ser selecionado em um processo competitivo com mais de 300 estudantes da PUCRS.", "Criar oficinas que abordem cultura, cidadania e tecnologia para os jovens participantes.", "Desenvolver oficinas que pudessem continuar na comunidade mesmo depois do fim do projeto.", "Conduzir pelo menos uma oficina com mais de 120 jovens participantes.", "Passar três semanas no Amapá com o objetivo genuíno de trocar experiências, aprender com a comunidade e compreender mais a fundo as diversas realidades do Brasil."], ["Plano das oficinas", "Registro de presença no evento", "Documentação das atividades", "Fotos / material do evento"], "Terceiros / Evidência do evento", "2022-07-22", {
    start: "2021-11-01",
    datesFromDocuments: true,
    stakes: [100, 75, 75, 150, 100],
    reflection: "Ver mais de 120 jovens participando fez o trabalho parecer real.",
    meaning: "O Projeto Rondon é um programa federal de extensão universitária, coordenado pelo Ministério da Defesa, que leva estudantes a municípios carentes. Fui um dos oito estudantes da PUCRS que, com dois professores, passaram 15 dias em Vitória do Jari, no Amapá, na Operação \"Amapá Mais Forte\" (julho de 2022). Nossa equipe planejou e conduziu oficinas sobre cultura, direitos humanos, educação e saúde. Fui colíder da maioria delas, incluindo contação de histórias, um curta-metragem que preserva memórias locais, sessões de design thinking com a comunidade, formação de professores e um programa que preparava adolescentes para a vida depois da escola.",
    documents: [
      { id: "projeto-rondon-doc-departure", name: "pucrs-instagram-departure.png", mimeType: "image/png", caption: "Anúncio da PUCRS sobre a partida da equipe para Vitória do Jari", src: rondonDeparture, addedAt: "2022-07-09T12:00:00Z" },
      { id: "projeto-rondon-doc-plan", name: "rondon-work-plan.pdf", mimeType: "application/pdf", caption: "Plano de trabalho e cronograma das oficinas da Operação Amapá Mais Forte", src: rondonWorkPlan, preview: rondonWorkPlanPreview, addedAt: "2022-07-09T12:00:00Z" },
      { id: "projeto-rondon-doc-classroom", name: "rondon-classroom.jpg", mimeType: "image/jpeg", caption: "Oficina com jovens da comunidade", src: rondonClassroom, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-gathering", name: "rondon-gathering.jpg", mimeType: "image/jpeg", caption: "Atividade noturna com a comunidade", src: rondonGathering, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-workshop", name: "rondon-workshop.jpg", mimeType: "image/jpeg", caption: "Conduzindo uma oficina", src: rondonWorkshop, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-children", name: "rondon-children.jpg", mimeType: "image/jpeg", caption: "Com crianças de Vitória do Jari", src: rondonChildren, addedAt: "2022-07-22T12:00:00Z" },
    ],
  }),
  challenge("liga-financeira", "Liga Financeira PUCRS", "Entrar na liga de mercado financeiro da PUCRS e contribuir ativamente com suas atividades intelectuais.", ["Ser aceito na liga de mercado financeiro da PUCRS.", "Criar grupos de estudo.", "Contribuir com artigos ou conteúdo educativo.", "Cocriar e ajudar a organizar a primeira Semana do Mercado Financeiro da PUCRS."], ["Confirmação de aprovação", "Registros dos grupos de estudo", "Artigos / conteúdos publicados"], "Evidência de terceiros", "2023-08-10", {
    start: "2023-03-13",
    datesFromDocuments: true,
    stakes: [75, 100, 125, 150],
    meaning: "A PUCRS Finance é a liga de mercado financeiro da PUCRS, um grupo de estudantes que estuda o mercado em conjunto e compartilha o que aprende com o restante da universidade. Como membro, escrevi posts educativos para o Instagram da liga, explicando em linguagem simples conceitos como a estratégia de Trend Following e a regra de Taylor, e ajudei a organizar e divulgar a Semana do Mercado Financeiro de 2023 da liga, um evento de quatro dias que trouxe fundadores, gestores de fundos e economistas-chefes ao campus.",
    documents: [
      { id: "liga-financeira-doc-trend", name: "pucrs-finance-trend-following.png", mimeType: "image/png", caption: "\"O que é Trend Following?\" — post da PUCRS Finance escrito por mim", src: ligaTrendFollowing, addedAt: "2023-03-13T12:00:00Z" },
      { id: "liga-financeira-doc-taylor", name: "pucrs-finance-taylor-rule.png", mimeType: "image/png", caption: "\"O que é a regra de Taylor?\" — post da PUCRS Finance escrito por mim", src: ligaTaylorRule, addedAt: "2023-03-27T12:00:00Z" },
      { id: "liga-financeira-doc-week", name: "pucrs-finance-market-week-2023.png", mimeType: "image/png", caption: "Programação da Semana do Mercado Financeiro 2023 da PUCRS Finance", src: ligaFinanceWeek, addedAt: "2023-08-07T12:00:00Z" },
      { id: "liga-financeira-doc-week-team", name: "pucrs-finance-market-week-team.jpg", mimeType: "image/jpeg", caption: "Equipe organizadora na Semana do Mercado Financeiro 2023", src: ligaFinanceWeekTeam, addedAt: "2023-08-10T12:00:00Z" },
    ],
  }),
  challenge("toninhathon", "ToninhaThon", "Criar um projeto viável, competir com sucesso e levá-lo além da competição.", ["Criar um projeto viável.", "Vencer a competição.", "Ter o projeto selecionado para incubação pelo SEBRAE."], ["Artefato do projeto", "Resultado da competição", "Evidência da incubação no SEBRAE"], "Resultado da competição + evidência de incubação", "2025-03-22", {
    stakes: [100, 150, 250],
    meaning: "O SalvaTon é o projeto que construí para o ToninhaThon, um hackathon pela proteção da toninha (golfinho franciscana), um dos golfinhos mais ameaçados do Atlântico Sul: cerca de 1.500 dos aproximadamente 20.000 que restam morrem em redes de pesca todos os anos. O SalvaTon é um pinger acústico de produção nacional que se prende à rede e emite frequências que as toninhas ouvem e evitam, com uma bateria que se recarrega com a energia do mar, no lugar dos pingers importados e caros, cujas baterias precisam ser trocadas a cada poucos meses.",
    documents: [
      { id: "toninhathon-doc-winners", name: "toninhathon-winners.png", mimeType: "image/png", caption: "Anúncio oficial das três soluções vencedoras", src: toninhathonWinners, addedAt: "2025-03-22T18:00:00Z" },
      { id: "toninhathon-doc-pitch", name: "SaveTon.pdf", mimeType: "application/pdf", caption: "Apresentação (pitch) do SalvaTon — problema, solução, validação e impacto", src: toninhathonPitch, preview: toninhathonPitchPreview, addedAt: "2025-03-22T18:00:00Z" },
      { id: "toninhathon-doc-call", name: "toninhathon-call.png", mimeType: "image/png", caption: "Videochamada do ToninhaThon com os organizadores", src: toninhathonCall, addedAt: "2025-03-22T18:00:00Z" },
    ],
  }),
  challenge("pratham-books", "Pratham Books", "Ser selecionado para participar, construir um projeto útil de engenharia de dados com potencial relevância para uma plataforma que atende 10 milhões de usuários e apresentar o case.", ["Ser selecionado.", "Construir um projeto útil de engenharia de dados pensado para um contexto que atende cerca de 10 milhões de usuários.", "Apresentar o case."], ["Evidência da seleção", "Artefato do projeto", "Evidência da apresentação"], "Evidências da seleção, do projeto e da apresentação", "2023-08-22", {
    start: "2023-05-08",
    datesFromDocuments: true,
    stakes: [125, 250, 125],
    contextMetric: { value: "10M", label: "usuários potenciais no contexto do projeto" },
    meaning: "A Pratham Books é uma editora infantil sem fins lucrativos da Índia cuja plataforma aberta, a StoryWeaver, oferece mais de 50.000 histórias gratuitas em mais de 330 idiomas. No ciclo Summer '23 da Develop For Good, entrei em uma equipe voluntária de engenharia que construiu a Integrated Data Analytics Platform deles: um pipeline em Apache Airflow que leva os dados do Google Analytics 4 do BigQuery para um data warehouse em PostgreSQL, com cargas históricas e incrementais diárias, e mais de 20 consultas analíticas reescritas como materialized views para os dashboards no Metabase. A plataforma substituiu relatórios manuais por analytics engineering automatizada, em uma stack de baixo custo.",
    documents: [
      { id: "pratham-books-doc-notion", name: "pratham-books-idap-notion", mimeType: "text/html", caption: "Documentação do projeto: arquitetura, pipeline, vídeos de demonstração e depoimento do cliente", src: prathamNotion, href: "https://spangled-script-c1f.notion.site/d7edbce5b74182e1aeb08187ee30ed20", addedAt: "2023-08-22T12:00:00Z" },
      { id: "pratham-books-doc-team-call", name: "develop-for-good-team-call.jpg", mimeType: "image/jpeg", caption: "Videochamada com a equipe do projeto da Develop For Good", src: prathamTeamCall, addedAt: "2023-08-22T12:00:00Z" },
    ],
  }),
  challenge("detectivesql", "detectiveSQL", "Criar um projeto de SQL que eu mesmo ache interessante o bastante para resolver e disponibilizá-lo para outras pessoas.", ["Criar algo que eu mesmo me sinta compelido a explorar e resolver.", "Publicar e compartilhar com outras pessoas."], ["URL pública do projeto (não fornecida)", "Evidência do repositório / projeto", "Evidência do lançamento / compartilhamento público"], "Projeto público + evidência de lançamento", "2026-09-24", {
    start: "2026-02-14",
    stakes: [200, 100],
    reflection: "Construí algo que eu queria que existisse.",
    meaning: "O detectiveSQL é um jogo de mistério em SQL para o navegador que eu idealizei e construí. Anos atrás fiquei viciado no SQL Murder Mystery, do Knight Lab, e me frustrei por não encontrar mais nada parecido, então construí o que eu queria que existisse: cada caso se desdobra em uma série de perguntas respondidas com consultas a um banco de dados, todas levando a uma única resposta — quem é o culpado? Tem vários níveis de dificuldade, roda inteiramente no navegador e agora está público em detectivesql.com.",
    documents: [
      { id: "detectivesql-doc-site", name: "detectivesql.com", mimeType: "text/html", caption: "detectiveSQL — o jogo no ar", src: detectiveSite, href: "https://detectivesql.com/", embed: "https://detectivesql.com/", embedWidth: 1280, addedAt: "2026-09-24T12:00:00Z" },
      { id: "detectivesql-doc-linkedin", name: "linkedin-launch-post", mimeType: "text/html", caption: "Post no LinkedIn anunciando o lançamento público", src: detectiveLinkedIn, href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7508950969674608640/", embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7508950969674608640", embedWidth: 504, addedAt: "2026-09-24T12:00:00Z" },
    ],
  }),
  challenge("torneio-empreendedor", "Meu Mundo Azul - Torneio do Empreendedor", "Desenvolver e validar um projeto de tecnologia para a saúde, transformá-lo em uma aplicação real e vencer a competição de empreendedorismo.", ["Desenvolver um projeto focado em saúde.", "Validar a ideia com um especialista.", "Vencer a competição.", "Desenvolver a aplicação com a AGES.", "Vencer o torneio final."], ["Artefato do projeto de saúde", "Validação com especialista", "Evidência da competição", "Evidência da aplicação na AGES", "Resultado do torneio final"], "Validação com especialista + competição + evidência da aplicação", "2022-11-25", {
    start: "2021-08-31",
    datesFromDocuments: true,
    stakes: [50, 50, 100, 150, 150],
    progression: ["Ideia", "Validação com especialista", "Competição", "Desenvolvimento do produto", "Torneio final"],
    meaning: "O Meu Mundo Azul é um app de saúde para o diagnóstico precoce do autismo. Cerca de 1 em cada 4 crianças com autismo fica sem diagnóstico e, no Brasil, a maioria dos diagnósticos chega depois da janela ideal para intervenção. O app aplica um teste de triagem, indica à família o próximo passo, aponta médicos e clínicas próximos, dá ao médico acesso aos dados do paciente e traz uma seção de conscientização e um diário do paciente, com algoritmos que refinam a previsão à medida que os resultados se acumulam. Apresentamos o projeto na Maratona de Inovação 2021, validamos a ideia com um especialista, construímos a aplicação real com a AGES, a agência de software da PUCRS, e o levamos até o torneio de empreendedorismo.",
    documents: [
      { id: "torneio-empreendedor-doc-pitch", name: "meu-mundo-azul-pitch", mimeType: "text/html", caption: "Apresentação (pitch) — Maratona de Inovação 2021", src: mmaPitch, href: "https://www.canva.com/design/DAEotCuHQiA/tZgfzXZnxGz38KvY8IYEkA/view", embed: "https://www.canva.com/design/DAEotCuHQiA/tZgfzXZnxGz38KvY8IYEkA/view?embed", embedWidth: 1280, addedAt: "2021-08-31T12:00:00Z" },
      { id: "torneio-empreendedor-doc-ages", name: "meu-mundo-azul-gitlab", mimeType: "text/html", caption: "Repositórios na AGES — backend, frontend e wiki", src: mmaAges, href: "https://tools.ages.pucrs.br/meu-mundo-azul", addedAt: "2022-11-25T12:00:00Z" },
      { id: "torneio-empreendedor-doc-team", name: "meu-mundo-azul-team.jpg", mimeType: "image/jpeg", caption: "A equipe do Meu Mundo Azul", src: mmaTeam, addedAt: "2026-10-07T12:00:00Z" },
    ],
  }),
  challenge("techfellow", "TechFellow", "Concluir com sucesso o processo seletivo do TechFellow e ser aceito.", ["Inscrever-me.", "Preparar a candidatura.", "Ser aceito."], ["Envio da inscrição", "Candidatura preparada", "Resultado da candidatura"], "Evidências do processo seletivo", "2026-08-31", { stakes: [50, 150, 300], status: "failed", criteria: [{ id: "techfellow-1", description: "Inscrever-me.", status: "met" }, { id: "techfellow-2", description: "Preparar a candidatura.", status: "met" }, { id: "techfellow-3", description: "Ser aceito.", status: "failed" }], reflection: "Concluí a candidatura, mas não cheguei ao resultado final." }),
  challenge("behring-founders", "Behring Founders", "Tornar-me um Behring Founder levando o processo a sério o bastante para entender a organização a fundo e devolver valor a futuros candidatos e founders.", [], ["Envio da inscrição", "Anotações de estudo sobre a organização", "Conversa com a Bibi"], "Inscrição + evidências do processo pessoal", "2026-10-01", { meaning: "Para mim, a Behring significa ter minha voz amplificada, ganhar acesso a uma rede forte e ter a oportunidade de continuar construindo aquilo em que acredito, em escala.", stakes: [25, 50, 25, 100, 200, 100], status: "active", completedAt: undefined, deadline: "2026-12-31T23:59:00Z", criteria: ["Enviar a inscrição.", "Estudar a fundo a organização, sua filosofia, suas pessoas e seu programa.", "Conversar com a Bibi.", "Avançar para a etapa presencial.", "Tornar-me um Behring Founder.", "Criar algo que devolva valor às próximas pessoas que trilharem o mesmo caminho."].map((description, i) => ({ id: `behring-founders-${i + 1}`, description, status: i < 3 ? "met" : "pending" })) }),
  challenge("i-did-it", "I Did It", "Construir e lançar o I Did It, um portfólio em que cada conquista é sustentada por objetivos travados, um valor em jogo e provas reais.", [], ["Repositório no GitHub", "Perfil no ar", "Feedback externo"], "Repositório no GitHub + perfil no ar", "2026-12-31", {
    start: "2026-10-05",
    meaning: "O I Did It é este site. Uma lista de coisas que alguém diz ter feito é fácil de escrever e difícil de confiar, então eu quis que cada conquista funcionasse como um pequeno contrato: objetivos travados antes de começar, algo em jogo em cada um e a prova anexada para qualquer pessoa conferir. Um troféu só aparece quando o trabalho está de fato concluído, e as tentativas que ficaram pelo caminho também continuam registradas.",
    documents: [
      { id: "i-did-it-doc-github", name: "github-repository", mimeType: "text/html", caption: "Código-fonte e README no GitHub", src: ididitGithub, href: "https://github.com/CMaRodrigo/pixel-perfect-capture-7666", addedAt: "2026-10-07T12:00:00Z" },
    ],
    stakes: [50, 75, 75, 100, 100, 100],
    status: "active", completedAt: undefined,
    criteria: ["Transformar meu portfólio em registros de compromisso com objetivos travados, um valor em jogo em cada um e provas reais.", "Anexar provas reais a cada projeto que concluí.", "Dar a cada compromisso verificado seu próprio troféu feito à mão.", "Publicar o perfil e compartilhá-lo publicamente.", "Receber feedback de pelo menos cinco pessoas sobre se as provas as convencem.", "Substituir as partes simuladas por serviços reais: contas, armazenamento de arquivos e valores em jogo."].map((description, i) => ({ id: `i-did-it-${i + 1}`, description, status: (["met", "met", "met", "pending", "pending", "pending"] as const)[i] ?? "pending" })),
  }),
];

export const demoActivity: ActivityEvent[] = demoCommitments.map((c): ActivityEvent => ({ id: `${c.id}-activity`, commitmentId: c.id, type: c.status === "active" ? "progress" : "result", description: `${c.title} — ${c.status === "passed" ? "concluído (demo)" : `${c.status === "failed" ? "não concluído · " : ""}${c.criteria.filter((cr) => cr.status === "met").length} / ${c.criteria.length} objetivos${c.status === "active" ? " concluídos" : ""} (demo)`}`, at: c.completedAt ?? c.createdAt })).sort((a, b) => b.at.localeCompare(a.at));
