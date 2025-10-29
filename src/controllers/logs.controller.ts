import LogEvent from "../models/LogEvent";
import Project from "../models/Project";

export async function ingestLogsController(project: any, events: any[]) {
  if (!Array.isArray(events) || events.length === 0) {
    return { error: "events[] required", status: 400 } as const;
  }
  const docs = events.slice(0, 1000).map((e:any) => ({
    projectId: project._id,
    level: e.level ?? "info",
    message: String(e.message ?? ""),
    tags: Array.isArray(e.tags) ? e.tags : [],
    meta: typeof e.meta === "object" ? e.meta : {},
    source: e.source ?? "unknown",
    ts: e.ts ? new Date(e.ts) : new Date()
  })).filter(d => d.message.length > 0);

  if (docs.length === 0) return { error: "no valid events", status: 400 } as const;

  await LogEvent.insertMany(docs, { ordered: false });

  // Update lastUsedAt for the matching key is handled in route if needed
  return { stored: docs.length, status: 201 } as const;
}

export async function searchLogsController(project: any, params: any) {
  const { q, level, tag, source, from, to, page = 1, limit = 50 } = params;

  const filter: any = { projectId: project._id };
  if (level) filter.level = level;
  if (tag) filter.tags = tag;
  if (source) filter.source = source;
  if (from || to) filter.ts = {};
  if (from) filter.ts.$gte = new Date(from);
  if (to) filter.ts.$lte = new Date(to);
  if (q) filter.message = { $regex: String(q), $options: "i" };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    LogEvent.find(filter).sort({ ts: -1 }).skip(skip).limit(Number(limit)).lean(),
    LogEvent.countDocuments(filter)
  ]);

  return { total, page: Number(page), limit: Number(limit), items };
}
