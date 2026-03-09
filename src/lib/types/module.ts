import { Question } from "@/lib/data/onboarding";

export type ModuleStatus = "locked" | "pending" | "generating" | "completed" | "error";

export interface ModuleDefinition {
  key: string;
  name: string;
  phaseId: number;
  phaseName: string;
  phaseTitle: string;
  preQuestions: Question[];
  aiGenerates: string;
  feedsInto: string[];
  description?: string;
}
