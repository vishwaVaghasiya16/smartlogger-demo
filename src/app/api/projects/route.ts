import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { listProjects, createProject } from "../../../controllers/projects.controller";

export async function GET() {
  await dbConnect();
  const data = await listProjects();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json().catch(()=>null) as any;
  const result = await createProject(body || {});
  if ("error" in result) return NextResponse.json({ message: result.error }, { status: result.status });
  const { status, ...rest } = result;
  return NextResponse.json(rest, { status });
}
