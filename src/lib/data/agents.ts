import { demoDataset, isDemoMode } from "./demo";
import type { AgentDetail, AgentSummary } from "./types";

export async function listAgents(): Promise<AgentSummary[]> {
  if (!isDemoMode()) return []; // TODO(persistence): select from `agents`.
  return demoDataset().agents;
}

export async function getAgent(id: string): Promise<AgentDetail | null> {
  if (!isDemoMode()) return null;
  return demoDataset().agents.find((agent) => agent.id === id) ?? null;
}
