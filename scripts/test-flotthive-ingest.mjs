#!/usr/bin/env node
// Manually exercises the FlottHive ingest contract (see src/lib/gt/flotthive.ts).
// Usage: FLOTTHIVE_INGEST_URL=... FH_SECRET=... node scripts/test-flotthive-ingest.mjs [formKey]
// Secret is read from the environment only — never pass it on the command line or commit it.

import { createHmac } from "node:crypto";

const ingestUrl = process.env.FLOTTHIVE_INGEST_URL;
const secret = process.env.FH_SECRET || process.env.FLOTTHIVE_INGEST_SECRET;
const formKey = process.argv[2] || "contact";

if (!ingestUrl || !secret) {
  console.error("Set FLOTTHIVE_INGEST_URL and FH_SECRET (or FLOTTHIVE_INGEST_SECRET) in the environment.");
  process.exit(1);
}

const payload = {
  data: { fullName: "Test Script", email: "test@example.com", message: "FlottHive ingest smoke test" },
  submitted_at: new Date().toISOString(),
  source_url: "https://flottwomenscircle.com/grand-table/",
  utm: {},
  is_test: true,
};

const rawBody = JSON.stringify(payload);
const timestamp = Math.floor(Date.now() / 1000);
const signature = `v1=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")}`;

const response = await fetch(`${ingestUrl.replace(/\/+$/, "")}/api/ingest/fwc/${formKey}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-FH-Timestamp": String(timestamp),
    "X-FH-Signature": signature,
    "Idempotency-Key": `test-script-${timestamp}`,
  },
  body: rawBody,
});

console.log(response.status, response.statusText);
console.log(await response.text());
