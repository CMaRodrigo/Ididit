import rondon from "@/assets/trophy-rondon.png";
import finance from "@/assets/trophy-finance.png";
import toninhathon from "@/assets/trophy-toninhathon.png";
import data from "@/assets/trophy-data.png";
import sql from "@/assets/trophy-sql.png";
import health from "@/assets/trophy-health.png";
import type { BadgeGeneratorOutput } from "./badges";

export const demoTrophies: Record<string, BadgeGeneratorOutput & { image: string }> = {
  "projeto-rondon": { badge_name: "IMPACT IN ACTION", badge_subtitle: "120+ young people reached", badge_description: "Created and delivered educational workshops combining culture, citizenship and technology, including an activity reaching more than 120 young people.", achievement_category: "education", visual_prompt: "Interconnected people surrounding a central spark, graphite and gold.", icon: "award", image: rondon },
  "liga-financeira": { badge_name: "MARKET MIND", badge_subtitle: "From applicant to contributor", badge_description: "Joined the PUCRS financial market league and contributed through study groups and written content.", achievement_category: "education", visual_prompt: "Open book transitioning into analytical financial charts, graphite and gold.", icon: "study", image: finance },
  toninhathon: { badge_name: "BUILT TO WIN", badge_subtitle: "Winner · Incubated by SEBRAE", badge_description: "Developed a viable project, won the competition and moved the project forward into incubation.", achievement_category: "career", visual_prompt: "Idea spark evolving into ascending geometric pillars, graphite and gold.", icon: "ship", image: toninhathon },
  "pratham-books": { badge_name: "DATA FOR MILLIONS", badge_subtitle: "Engineering at meaningful scale", badge_description: "Earned selection, developed a data engineering solution for a large-scale use case and presented the resulting case.", achievement_category: "skills", visual_prompt: "Many data nodes merging through pipelines into a structured core, graphite and gold.", icon: "study", image: data },
  detectivesql: { badge_name: "CASE CLOSED", badge_subtitle: "detectiveSQL shipped", badge_description: "Created and released detectiveSQL, turning SQL practice into an interactive investigation experience and sharing it publicly.", achievement_category: "creative", visual_prompt: "Magnifying glass with query paths and evidence nodes, graphite and gold.", icon: "ship", image: sql },
  "torneio-empreendedor": { badge_name: "FROM PROBLEM TO PRODUCT", badge_subtitle: "From healthcare idea to winning product", badge_description: "Created a healthcare-focused idea, validated it with a domain specialist, developed the application with AGES and successfully competed through the tournament.", achievement_category: "career", visual_prompt: "Medical pulse transforming into interconnected product blocks, graphite and gold.", icon: "ship", image: health },
};