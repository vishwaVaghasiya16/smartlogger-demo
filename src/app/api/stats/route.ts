import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../lib/db";
import { getProjectFromKey } from "../../../lib/auth";
import { getStatsController } from "../../../controllers/stats.controller";

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

  const data = await getStatsController(project);
  return NextResponse.json(data);
}
