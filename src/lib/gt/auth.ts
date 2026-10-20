import type { AstroCookies } from "astro";

export const COOKIE_NAME = "gt_admin_session";
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

async function hmacHex(secret: string, message: string): Promise<string> {
  if (typeof secret !== "string" || secret.length < 8) throw new Error("SESSION_SECRET is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return bytesToHex(new Uint8Array(signature));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyPassword(input: string, expected: string | undefined): Promise<boolean> {
  // Refuse login entirely when the secret is not configured.
  if (typeof expected !== "string" || expected.length < 8) return false;
  const [inputHash, expectedHash] = await Promise.all([sha256Hex(input), sha256Hex(expected)]);
  return timingSafeEqualHex(inputHash, expectedHash);
}

export async function createSessionToken(secret: string, now: number): Promise<string> {
  const expires = now + SESSION_DURATION_MS;
  const signature = await hmacHex(secret, String(expires));
  return `${expires}.${signature}`;
}

export async function verifySessionToken(secret: string, token: string | undefined, now: number): Promise<boolean> {
  if (!token) return false;
  if (typeof secret !== "string" || secret.length < 8) return false;
  const [expiresStr, signature] = token.split(".");
  if (!expiresStr || !signature) return false;
  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || expires < now) return false;
  const expected = await hmacHex(secret, expiresStr);
  return timingSafeEqualHex(signature, expected);
}

export function getSessionToken(cookies: AstroCookies): string | undefined {
  return cookies.get(COOKIE_NAME)?.value;
}

export async function getAuthedSession(cookies: AstroCookies, secret: string): Promise<boolean> {
  return verifySessionToken(secret, getSessionToken(cookies), Date.now());
}

export async function createCsrfToken(secret: string, sessionToken: string): Promise<string> {
  return hmacHex(secret, `csrf:${sessionToken}`);
}

export async function verifyCsrfToken(secret: string, sessionToken: string, candidate: string | null): Promise<boolean> {
  if (!candidate) return false;
  const expected = await createCsrfToken(secret, sessionToken);
  return timingSafeEqualHex(candidate, expected);
}
