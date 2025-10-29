import Project from "../models/Project";
import { hashApiKey } from "../utils/apiKey";

export async function getProjectFromKey(key: string) {
  const parts = key.split("_");
  if (parts.length < 3) return null;
  const prefix = parts[2];
  const project = await Project.findOne({ "apiKeys.prefix": prefix });
  if (!project) return null;
  const candidateHash = hashApiKey(key);
  const match = project.apiKeys.find(k => k.prefix === prefix && k.isActive && k.hash === candidateHash);
  if (!match) return null;
  return project;
}
