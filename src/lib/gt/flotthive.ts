// Forwards successful Grand Table submissions to FlottHive ingest. Server-only — never import from client code.
// Contract: /workspace/repos/flotthive/docs/INGEST.md

const SITE_KEY = "fwc";

export type FlottHiveEnv = {
  FLOTTHIVE_INGEST_URL?: string;
  FLOTTHIVE_INGEST_SECRET?: string;
  GT_TEST_SUBJECTS?: string;
};

export type FlottHiveWaitUntil = { waitUntil(promise: Promise<unknown>): void };

export type ForwardSubmissionParams = {
  env: FlottHiveEnv;
  ctx?: FlottHiveWaitUntil;
  formKey: string;
  submissionId: string;
  data: Record<string, string>;
  createdAt: string;
  request: Request;
};

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function signFlottHiveBody(secret: string, timestamp: number, rawBody: string): Promise<string> {
  return `v1=${await hmacSha256Hex(secret, `${timestamp}.${rawBody}`)}`;
}

export async function postToFlottHive(
  ingestUrl: string,
  secret: string,
  formKey: string,
  idempotencyKey: string,
  payload: unknown
): Promise<Response> {
  const rawBody = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await signFlottHiveBody(secret, timestamp, rawBody);

  return fetch(`${ingestUrl.replace(/\/+$/, "")}/api/ingest/${SITE_KEY}/${formKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-FH-Timestamp": String(timestamp),
      "X-FH-Signature": signature,
      "Idempotency-Key": idempotencyKey,
    },
    body: rawBody,
  });
}

function extractUtm(request: Request, data: Record<string, string>): Record<string, string> {
  const utm: Record<string, string> = {};
  const url = new URL(request.url);
  for (const [key, value] of url.searchParams) {
    if (key.startsWith("utm_")) utm[key] = value;
  }
  for (const [key, value] of Object.entries(data)) {
    if (key.startsWith("utm_")) utm[key] = value;
  }
  return utm;
}

function resolveSourceUrl(request: Request): string {
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.protocol === "https:") return referer;
    } catch {
      // fall through to origin fallback
    }
  }
  return `${new URL(request.url).origin}/grand-table/`;
}

/** Fire-and-forget; a forwarding failure must never affect the submitter's response. */
export function forwardGrandTableSubmission(params: ForwardSubmissionParams): void {
  const { env, ctx } = params;
  const ingestUrl = env.FLOTTHIVE_INGEST_URL;
  const secret = env.FLOTTHIVE_INGEST_SECRET;

  if (!ingestUrl || !secret) {
    console.warn("FlottHive forwarding skipped: FLOTTHIVE_INGEST_URL/FLOTTHIVE_INGEST_SECRET not configured");
    return;
  }

  const payload = {
    data: params.data,
    submitted_at: params.createdAt,
    source_url: resolveSourceUrl(params.request),
    utm: extractUtm(params.request, params.data),
    is_test: env.GT_TEST_SUBJECTS === "true",
  };

  const promise = postToFlottHive(ingestUrl, secret, params.formKey, params.submissionId, payload)
    .then((response) => {
      if (!response.ok) {
        console.error(`FlottHive forwarding failed: ${response.status} ${response.statusText}`);
      }
    })
    .catch((error) => {
      console.error("FlottHive forwarding failed", error);
    });

  if (ctx?.waitUntil) {
    ctx.waitUntil(promise);
  }
}
