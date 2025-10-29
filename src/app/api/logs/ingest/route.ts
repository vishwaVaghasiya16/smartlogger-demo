import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import { getProjectFromKey } from "../../../../lib/auth";
import Project from "../../../../models/Project";
import { ingestLogsController } from "../../../../controllers/logs.controller";

export async function POST(req: NextRequest) {
  await dbConnect();
  const key = req.headers.get("x-api-key");
  if (!key) return NextResponse.json({ message: "x-api-key missing" }, { status: 401 });

  const project = await getProjectFromKey(key);
  if (!project) return NextResponse.json({ message: "invalid or inactive key" }, { status: 401 });

  const body = await req.json().catch(()=>null) as any;
  const events = Array.isArray(body?.events) ? body.events : [];

  const result = await ingestLogsController(project, events);
  if ("error" in result) return NextResponse.json({ message: result.error }, { status: result.status });

  // update lastUsedAt on matching key (optional)
  const prefix = key.split("_")[2];
  const match = project.apiKeys.find(k => k.prefix === prefix);
  if (match) { match.lastUsedAt = new Date(); await Project.findByIdAndUpdate(project._id, { apiKeys: project.apiKeys }); }

  return NextResponse.json({ stored: result.stored }, { status: result.status });
}
