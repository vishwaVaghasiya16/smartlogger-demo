import Project from "../models/Project";
import { createApiKey, hashApiKey } from "../utils/apiKey";

export async function listProjects() {
  const items = await Project.find({}, { apiKeys: 0 }).sort({ createdAt: -1 }).lean();
  return { items };
}

type CreateProjectBody = { name: string; ownerEmail: string };

export async function createProject(body: CreateProjectBody) {
  if (!body?.name || !body?.ownerEmail) {
    return { error: "name & ownerEmail required", status: 400 } as const;
  }
  const { prefix, plain } = createApiKey();
  const hash = hashApiKey(plain);
  const doc = await Project.create({
    name: body.name,
    ownerEmail: body.ownerEmail,
    apiKeys: [{ prefix, hash, isActive: true }]
  });
  return {
    projectId: String(doc._id),
    name: doc.name,
    ownerEmail: doc.ownerEmail,
    apiKey: plain,
    note: "Copy this API key now. It won't be shown again.",
    status: 201
  } as const;
}
