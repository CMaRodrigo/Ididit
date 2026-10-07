import type { ActivityEvent, Commitment } from "./types";
import toninhathonWinners from "@/assets/proof-toninhathon-winners.png";
import toninhathonCall from "@/assets/proof-toninhathon-call.png";
import toninhathonPitch from "@/assets/proof-toninhathon-saveton.pdf";
import rondonDeparture from "@/assets/proof-rondon-departure.png";
import rondonWorkPlan from "@/assets/proof-rondon-work-plan.pdf";
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

export const DEMO_USER = { name: "Rodrigo", bio: "Builder · Data Engineer · Problem Solver", email: "", timezone: "America/Sao_Paulo", currency: "USD" };

function challenge(id: string, title: string, goal: string, rules: string[], evidence: string[], source: string, date: string, extra: Partial<Commitment> = {}): Commitment {
  const status = extra.status ?? "passed";
  const criteria = rules.map((description, i) => ({ id: `${id}-${i + 1}`, description, status: "met" as const }));
  const c: Commitment = {
    id, title, measurableGoal: goal, status, demo: true,
    createdAt: `${date}T09:00:00Z`, lockedAt: `${date}T09:00:00Z`, deadline: `${date}T23:59:00Z`,
    completedAt: status === "passed" ? `${date}T18:00:00Z` : undefined,
    stake: 0, currency: "USD", failureDestination: "Not specified in the original example",
    methods: ["referee"], providers: [], verificationSource: source, criteria,
    evidence: evidence.map((value, i) => ({ id: `${id}-e${i}`, criterionId: criteria[Math.min(i, criteria.length - 1)]?.id ?? "", type: "text", value: `Demo placeholder — ${value}`, submittedAt: `${date}T17:00:00Z` })),
    runs: [], ...extra,
  };
  c.runs = [{ id: `${id}-verification`, ranAt: `${date}T18:00:00Z`, verdicts: c.criteria.map((cr) => ({ criterionId: cr.id, status: cr.status === "met" ? "verified" : cr.status === "failed" ? "failed" : "insufficient_evidence", confidence: 1, reasoning: cr.status === "met" ? "Completed in the supplied demo scenario; supporting documents are placeholders." : cr.status === "failed" ? "Acceptance was not achieved in the supplied demo scenario." : "This milestone is not completed; no final verification yet.", evidenceUsed: c.evidence.filter((e) => e.criterionId === cr.id).map((e) => e.id) })) }];
  return c;
}

// Dates illustrate a personal timeline; real historical dates and documents were not supplied.
export const demoCommitments: Commitment[] = [
  challenge("projeto-rondon", "Projeto Rondon", "Create and conduct workshops for young people focused on culture, citizenship and technology.", ["Create workshops that address culture, citizenship and technology for the participating young people.", "Conduct at least one workshop with more than 120 young participants."], ["Workshop plan", "Event attendance record", "Activity documentation", "Photos / event material"], "Third-party / Event Evidence", "2024-07-20", {
    reflection: "Seeing more than 120 young people participate made the work feel real.",
    meaning: "Projeto Rondon is a Brazilian federal university-extension program, coordinated by the Ministry of Defence, that sends students to underserved municipalities. I was one of eight PUCRS students who, with two professors, spent 15 days in Vitória do Jari, Amapá, for Operação \"Amapá Mais Forte\" (July 2022). Our team designed and ran workshops on culture, human rights, education and health. I co-led most of them, including story-telling, a short film preserving local memories, design-thinking sessions for the community, teacher training and a programme preparing teenagers for life after school.",
    documents: [
      { id: "projeto-rondon-doc-departure", name: "pucrs-instagram-departure.png", mimeType: "image/png", caption: "PUCRS announcement of the team's departure to Vitória do Jari", src: rondonDeparture, addedAt: "2022-07-09T12:00:00Z" },
      { id: "projeto-rondon-doc-plan", name: "rondon-work-plan.pdf", mimeType: "application/pdf", caption: "Work plan and workshop schedule for Operação Amapá Mais Forte", src: rondonWorkPlan, addedAt: "2022-07-09T12:00:00Z" },
      { id: "projeto-rondon-doc-classroom", name: "rondon-classroom.jpg", mimeType: "image/jpeg", caption: "Workshop with young people from the community", src: rondonClassroom, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-gathering", name: "rondon-gathering.jpg", mimeType: "image/jpeg", caption: "Evening activity with the community", src: rondonGathering, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-workshop", name: "rondon-workshop.jpg", mimeType: "image/jpeg", caption: "Leading a workshop session", src: rondonWorkshop, addedAt: "2022-07-22T12:00:00Z" },
      { id: "projeto-rondon-doc-children", name: "rondon-children.jpg", mimeType: "image/jpeg", caption: "With children from Vitória do Jari", src: rondonChildren, addedAt: "2022-07-22T12:00:00Z" },
    ],
  }),
  challenge("liga-financeira", "Liga Financeira PUCRS", "Join the PUCRS financial market league and actively contribute to its intellectual activities.", ["Be accepted into the PUCRS financial market league.", "Create study groups.", "Contribute to articles or educational content."], ["Acceptance confirmation", "Study group records", "Published articles / content"], "Third-party evidence", "2024-11-30", {
    meaning: "PUCRS Finance is the financial market league at PUCRS, a student group that studies markets together and shares what it learns with the wider university. As a member, I wrote educational posts for the league's Instagram, explaining concepts such as the Trend Following strategy and the Taylor rule in plain language, and helped organise and promote the league's 2023 Financial Market Week, a four-day event bringing founders, fund managers and chief economists to campus.",
    documents: [
      { id: "liga-financeira-doc-trend", name: "pucrs-finance-trend-following.png", mimeType: "image/png", caption: "\"What is Trend Following?\" — PUCRS Finance post written by me", src: ligaTrendFollowing, addedAt: "2023-02-15T12:00:00Z" },
      { id: "liga-financeira-doc-taylor", name: "pucrs-finance-taylor-rule.png", mimeType: "image/png", caption: "\"What is the Taylor rule?\" — PUCRS Finance post written by me", src: ligaTaylorRule, addedAt: "2023-03-01T12:00:00Z" },
      { id: "liga-financeira-doc-week", name: "pucrs-finance-market-week-2023.png", mimeType: "image/png", caption: "Programme of the PUCRS Finance Financial Market Week 2023", src: ligaFinanceWeek, addedAt: "2023-08-07T12:00:00Z" },
      { id: "liga-financeira-doc-week-team", name: "pucrs-finance-market-week-team.jpg", mimeType: "image/jpeg", caption: "Organising team at the Financial Market Week 2023", src: ligaFinanceWeekTeam, addedAt: "2023-08-10T12:00:00Z" },
    ],
  }),
  challenge("toninhathon", "ToninhaThon", "Create a viable project, compete successfully and advance it beyond the competition.", ["Create a viable project.", "Win the competition.", "Have the project selected for incubation by SEBRAE."], ["Project artifact", "Competition result", "SEBRAE incubation evidence"], "Competition result + incubation evidence", "2025-03-22", {
    meaning: "SalvaTon is the project I built for ToninhaThon, a hackathon to protect the toninha (franciscana dolphin), one of the most threatened dolphins in the South Atlantic: about 1,500 of the roughly 20,000 left die in fishing nets every year. SalvaTon is a nationally produced acoustic pinger that clips onto the net and emits frequencies the toninhas hear and avoid, with a self-recharging battery powered by the sea instead of the imported, expensive pingers whose batteries must be replaced every few months.",
    documents: [
      { id: "toninhathon-doc-winners", name: "toninhathon-winners.png", mimeType: "image/png", caption: "Official announcement of the three winning solutions", src: toninhathonWinners, addedAt: "2025-03-22T18:00:00Z" },
      { id: "toninhathon-doc-pitch", name: "SaveTon.pdf", mimeType: "application/pdf", caption: "SalvaTon pitch deck — problem, solution, validation and impact", src: toninhathonPitch, addedAt: "2025-03-22T18:00:00Z" },
      { id: "toninhathon-doc-call", name: "toninhathon-call.png", mimeType: "image/png", caption: "ToninhaThon video call with the organizers", src: toninhathonCall, addedAt: "2025-03-22T18:00:00Z" },
    ],
  }),
  challenge("pratham-books", "Pratham Books", "Be selected to participate, build a useful data engineering project with potential relevance for a platform serving 10 million users, and present the case.", ["Be selected.", "Build a useful data engineering project designed around a context serving approximately 10 million users.", "Present the case."], ["Selection evidence", "Project artifact", "Presentation evidence"], "Selection, project and presentation evidence", "2025-08-16", {
    contextMetric: { value: "10M", label: "potential users in the project context" },
    meaning: "Pratham Books is a not-for-profit children's publisher in India whose open platform, StoryWeaver, offers more than 50,000 free stories in 330+ languages. Through Develop For Good's Summer '23 cycle, I joined a volunteer engineering team that built their Integrated Data Analytics Platform: an Apache Airflow pipeline that moves Google Analytics 4 data from BigQuery into a PostgreSQL warehouse, handling both historical and daily incremental loads, with more than 20 analytics queries rewritten as materialized views for their Metabase dashboards. It replaced manual reporting with automated analytics engineering on a low-cost stack.",
    documents: [
      { id: "pratham-books-doc-notion", name: "pratham-books-idap-notion", mimeType: "text/html", caption: "Project write-up: architecture, pipeline, demo videos and client testimonial", src: prathamNotion, href: "https://spangled-script-c1f.notion.site/d7edbce5b74182e1aeb08187ee30ed20", addedAt: "2023-08-22T12:00:00Z" },
      { id: "pratham-books-doc-team-call", name: "develop-for-good-team-call.jpg", mimeType: "image/jpeg", caption: "Video call with the Develop For Good project team", src: prathamTeamCall, addedAt: "2023-08-22T12:00:00Z" },
    ],
  }),
  challenge("detectivesql", "detectiveSQL", "Create a SQL project that I personally find interesting enough to solve and make it available to other people.", ["Create something that I personally feel compelled to explore and solve.", "Publish and share it with other people."], ["Public project URL (not supplied)", "Repository / project evidence", "Public release / share evidence"], "Public project + release evidence", "2026-02-14", {
    reflection: "Built something I wanted to exist.",
    meaning: "detectiveSQL is a browser-based SQL mystery game I designed and built. Years ago I got hooked on Knight Lab's SQL Murder Mystery and was disappointed when I couldn't find anything else like it, so I built the thing I wished existed: each case unfolds into a series of questions answered by querying a database, all leading to one answer — who is the culprit? It has several difficulty levels, runs entirely in the browser, and is now public at detectivesql.com.",
    documents: [
      { id: "detectivesql-doc-site", name: "detectivesql.com", mimeType: "text/html", caption: "detectiveSQL — the live game", src: detectiveSite, href: "https://detectivesql.com/", embed: "https://detectivesql.com/", embedWidth: 1280, addedAt: "2026-09-30T12:00:00Z" },
      { id: "detectivesql-doc-linkedin", name: "linkedin-launch-post", mimeType: "text/html", caption: "LinkedIn post announcing the public launch", src: detectiveLinkedIn, href: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7508950969674608640/", embed: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7508950969674608640", embedWidth: 504, addedAt: "2026-09-30T12:00:00Z" },
    ],
  }),
  challenge("torneio-empreendedor", "Torneio Empreendedor", "Develop and validate a technology project for healthcare, turn it into a real application and win the entrepreneurship competition.", ["Develop a project focused on healthcare.", "Validate the idea with a specialist.", "Win the competition.", "Develop the application with AGES.", "Win the final tournament."], ["Healthcare project artifact", "Expert validation", "Competition evidence", "AGES application evidence", "Final tournament result"], "Expert validation + competition + application evidence", "2026-06-20", { progression: ["Idea", "Expert validation", "Competition", "Product development", "Final tournament"] }),
  challenge("techfellow", "TechFellow", "Successfully complete the TechFellow application process and be accepted.", ["Apply.", "Prepare the application.", "Be accepted."], ["Application submission", "Prepared application", "Application outcome"], "Application process evidence", "2026-08-31", { status: "failed", criteria: [{ id: "techfellow-1", description: "Apply.", status: "met" }, { id: "techfellow-2", description: "Prepare the application.", status: "met" }, { id: "techfellow-3", description: "Be accepted.", status: "failed" }], reflection: "I completed the application, but didn't reach the final outcome." }),
  challenge("behring-founders", "Behring Founders", "Become a Behring Founder while taking the process seriously enough to deeply understand the organization and contribute value back to future applicants and founders.", [], ["Application submission", "Organization study notes", "Conversation with Bibi"], "Application + personal process evidence", "2026-10-01", { status: "active", completedAt: undefined, deadline: "2026-12-31T23:59:00Z", criteria: ["Submit the application.", "Study the organization, its philosophy, people and program in depth.", "Speak with Bibi.", "Advance to the in-person stage.", "Become a Behring Founder.", "Create something that returns value to future people going through the same path."].map((description, i) => ({ id: `behring-founders-${i + 1}`, description, status: i < 3 ? "met" : "pending" })) }),
];

export const demoActivity: ActivityEvent[] = demoCommitments.map((c): ActivityEvent => ({ id: `${c.id}-activity`, commitmentId: c.id, type: c.status === "active" ? "progress" : "result", description: `${c.title} — ${c.status === "passed" ? "completed (demo)" : c.status === "failed" ? "not completed · 2 / 3 criteria (demo)" : "3 / 6 milestones completed (demo)"}`, at: c.completedAt ?? c.createdAt })).sort((a, b) => b.at.localeCompare(a.at));
