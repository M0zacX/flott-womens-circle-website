// Human-readable reference numbers for Grand Table 2026 submissions.
// Stored at data.reference (inside the submissions.data JSON blob), not a DB column.

const REFERENCE_PREFIX = "GT26-";
const REFERENCE_LENGTH = 6;
// Uppercase letters and digits, minus 0/O/1/I/L, so a spoken or handwritten
// reference can't be misread.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const MAX_ATTEMPTS = 8;

export function generateReference(): string {
  const bytes = new Uint8Array(REFERENCE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = "";
  for (const byte of bytes) {
    code += ALPHABET[byte % ALPHABET.length];
  }
  return `${REFERENCE_PREFIX}${code}`;
}

async function referenceExists(db: D1Database, reference: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT 1 FROM submissions WHERE json_extract(data, '$.reference') = ? LIMIT 1`)
    .bind(reference)
    .first();
  return row !== null;
}

export async function ensureUniqueReference(db: D1Database): Promise<string> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const candidate = generateReference();
    if (!(await referenceExists(db, candidate))) {
      return candidate;
    }
  }
  throw new Error("Could not generate a unique Grand Table reference after 8 attempts");
}
