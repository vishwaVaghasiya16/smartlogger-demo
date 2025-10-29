import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import { getProjectFromKey } from "../../../../lib/auth";
import { searchLogsController } from "../../../../controllers/logs.controller";

export async function GET(req: NextRequest) {
  await dbConnect();
  const key = req.headers.get("x-api-key");
  if (!key)
    return NextResponse.json({ message: "x-api-key missing" }, { status: 401 });

  const project = await getProjectFromKey(key);
  if (!project)
    return NextResponse.json(
      { message: "invalid or inactive key" },
      { status: 401 }
    );

  const { searchParams } = new URL(req.url);
  const params: any = {
    q: searchParams.get("q") || undefined,
    level: searchParams.get("level") || undefined,
    tag: searchParams.get("tag") || undefined,
    source: searchParams.get("source") || undefined,
    from: searchParams.get("from") || undefined,
    to: searchParams.get("to") || undefined,
    page: Number(searchParams.get("page") || "1"),
    limit: Math.min(Number(searchParams.get("limit") || "50"), 200),
  };

  const data = await searchLogsController(project, params);
  return NextResponse.json(data);
}
