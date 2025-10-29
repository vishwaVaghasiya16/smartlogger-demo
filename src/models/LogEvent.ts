import { Schema, model, models, Types } from "mongoose";

const LogEventSchema = new Schema({
  projectId: { type: Types.ObjectId, ref: "Project", index: true, required: true },
  level: { type: String, enum: ["error", "warn", "info", "debug"], index: true, default: "info" },
  message: { type: String, required: true },
  tags: [{ type: String, index: true }],
  meta: { type: Object, default: {} },
  source: { type: String, index: true },
  ts: { type: Date, index: true, default: Date.now }
}, { minimize: false });

LogEventSchema.index({ projectId: 1, ts: -1 });
LogEventSchema.index({ projectId: 1, level: 1, ts: -1 });
LogEventSchema.index({ projectId: 1, tags: 1, ts: -1 });

export type LogEventType = {
  projectId: Types.ObjectId;
  level: "error"|"warn"|"info"|"debug";
  message: string;
  tags?: string[];
  meta?: Record<string, any>;
  source?: string;
  ts: Date;
};

export default models.LogEvent || model<LogEventType>("LogEvent", LogEventSchema);
