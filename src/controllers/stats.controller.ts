import LogEvent from "../models/LogEvent";

export async function getStatsController(project: any) {
  const now = new Date();
  const from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days

  const matchStage = { projectId: project._id, ts: { $gte: from, $lte: now } };

  const grouped = await LogEvent.aggregate([
    { $match: matchStage },
    { $group: { _id: "$level", count: { $sum: 1 } } }
  ]);

  const counts: Record<string, number> = { error: 0, warn: 0, info: 0, debug: 0 };
  for (const g of grouped) counts[g._id] = g.count;

  const topMessages = await LogEvent.aggregate([
    { $match: matchStage },
    { $group: { _id: "$message", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, message: "$$ROOT._id", count: 1 } }
  ]);

  return {
    errorCount: counts.error || 0,
    warnCount: counts.warn || 0,
    infoCount: counts.info || 0,
    debugCount: counts.debug || 0,
    topMessages
  };
}
