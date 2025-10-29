import { Schema, model, models, Types } from "mongoose";

const ApiKeySchema = new Schema({
  prefix: { type: String, required: true },
  hash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, { _id: false });

const ProjectSchema = new Schema({
  name: { type: String, required: true, trim: true },
  ownerEmail: { type: String, required: true, lowercase: true, index: true },
  apiKeys: { type: [ApiKeySchema], default: [] },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  createdAt: { type: Date, default: Date.now }
});

ProjectSchema.index({ "apiKeys.prefix": 1 });

export type ProjectType = {
  _id: Types.ObjectId;
  name: string;
  ownerEmail: string;
  apiKeys: Array<{
    prefix: string;
    hash: string;
    createdAt: Date;
    lastUsedAt?: Date;
    isActive: boolean;
  }>;
  plan: "free" | "pro";
  createdAt: Date;
};

export default models.Project || model<ProjectType>("Project", ProjectSchema);
