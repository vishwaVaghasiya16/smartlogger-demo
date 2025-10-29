import crypto from "crypto";

export function createApiKey() {
  const prefix = crypto.randomBytes(2).toString("hex"); // 4 hex
  const secret = crypto.randomBytes(24).toString("hex"); // 48 hex
  const plain = `slk_live_${prefix}_${secret}`;
  return { prefix, plain };
}

export function hashApiKey(plain: string) {
  const pepper = process.env.API_KEY_PEPPER || "change_me";
  return crypto.createHmac("sha256", pepper).update(plain).digest("hex");
}
