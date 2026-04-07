import { createHmac, timingSafeEqual } from "crypto";

type Payload = { exp: number };

export function signPortalSession(expMs: number, secret: string): string {
  const payload: Payload = { exp: expMs };
  const b64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = createHmac("sha256", secret).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}

export function verifyPortalSession(token: string | undefined, secret: string): boolean {
  if (!token || !secret) return false;
  const dot = token.indexOf(".");
  if (dot < 1) return false;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(b64).digest("base64url");
  try {
    if (expected.length !== sig.length) return false;
    if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return false;
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString("utf8")) as Payload;
    return typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}
