export type SubmissionStatus = "new" | "reviewing" | "accepted" | "declined" | "archived";

export const SUBMISSION_STATUSES: SubmissionStatus[] = ["new", "reviewing", "accepted", "declined", "archived"];

export type SubmissionRow = {
  id: string;
  form: string;
  status: SubmissionStatus;
  data: string;
  email: string | null;
  name: string | null;
  file_key: string | null;
  file_name: string | null;
  file_size: number | null;
  created_at: string;
  updated_at: string;
  notes: string | null;
  is_test: number;
};

export type NewSubmission = {
  id: string;
  form: string;
  data: Record<string, string>;
  email?: string;
  name?: string;
  fileKey?: string;
  fileName?: string;
  fileSize?: number;
  createdAt: string;
};

export async function insertSubmission(db: D1Database, input: NewSubmission): Promise<void> {
  await db
    .prepare(
      `INSERT INTO submissions (id, form, status, data, email, name, file_key, file_name, file_size, created_at, updated_at, notes)
       VALUES (?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, NULL)`
    )
    .bind(
      input.id,
      input.form,
      JSON.stringify(input.data),
      input.email ?? null,
      input.name ?? null,
      input.fileKey ?? null,
      input.fileName ?? null,
      input.fileSize ?? null,
      input.createdAt,
      input.createdAt
    )
    .run();
}

export type SortField = "created" | "sector";
export type SortDir = "asc" | "desc";

export type ListParams = {
  form: string;
  status?: SubmissionStatus | "all";
  search?: string;
  sector?: string;
  sort?: SortField;
  dir?: SortDir;
  page?: number;
  pageSize?: number;
};

function buildWhere(params: Pick<ListParams, "form" | "status" | "search" | "sector">) {
  const conditions = ["form = ?"];
  const binds: unknown[] = [params.form];

  if (params.status && params.status !== "all") {
    conditions.push("status = ?");
    binds.push(params.status);
  }
  if (params.search) {
    conditions.push("(name LIKE ? OR email LIKE ?)");
    const like = `%${params.search}%`;
    binds.push(like, like);
  }
  if (params.sector) {
    conditions.push("json_extract(data, '$.sector') = ?");
    binds.push(params.sector);
  }

  return { where: conditions.join(" AND "), binds };
}

function buildOrderBy(sort?: SortField, dir?: SortDir): string {
  const direction = dir === "asc" ? "ASC" : "DESC";
  if (sort === "sector") return `json_extract(data, '$.sector') ${direction}`;
  return `created_at ${direction}`;
}

export async function listSubmissions(db: D1Database, params: ListParams): Promise<SubmissionRow[]> {
  const pageSize = params.pageSize ?? 25;
  const page = Math.max(1, params.page ?? 1);
  const offset = (page - 1) * pageSize;
  const { where, binds } = buildWhere(params);
  const orderBy = buildOrderBy(params.sort, params.dir);

  const result = await db
    .prepare(`SELECT * FROM submissions WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`)
    .bind(...binds, pageSize, offset)
    .all<SubmissionRow>();

  return result.results;
}

export async function countSubmissions(db: D1Database, params: Omit<ListParams, "page" | "pageSize" | "sort" | "dir">): Promise<number> {
  const { where, binds } = buildWhere(params);
  const row = await db
    .prepare(`SELECT COUNT(*) as count FROM submissions WHERE ${where}`)
    .bind(...binds)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

export async function statusCounts(db: D1Database, form: string, sector?: string): Promise<Record<SubmissionStatus, number> & { all: number }> {
  const sectorClause = sector ? " AND json_extract(data, '$.sector') = ?" : "";
  const binds: string[] = sector ? [form, sector] : [form];
  const result = await db
    .prepare(`SELECT status, COUNT(*) as count FROM submissions WHERE form = ?${sectorClause} GROUP BY status`)
    .bind(...binds)
    .all<{ status: SubmissionStatus; count: number }>();

  const counts = { new: 0, reviewing: 0, accepted: 0, declined: 0, archived: 0, all: 0 };
  for (const row of result.results) {
    counts[row.status] = row.count;
    counts.all += row.count;
  }
  return counts;
}

export async function getSubmission(db: D1Database, id: string): Promise<SubmissionRow | null> {
  return db.prepare(`SELECT * FROM submissions WHERE id = ?`).bind(id).first<SubmissionRow>();
}

export async function updateStatus(db: D1Database, id: string, status: SubmissionStatus, updatedAt: string): Promise<void> {
  await db.prepare(`UPDATE submissions SET status = ?, updated_at = ? WHERE id = ?`).bind(status, updatedAt, id).run();
}

export async function updateNotes(db: D1Database, id: string, notes: string, updatedAt: string): Promise<void> {
  await db.prepare(`UPDATE submissions SET notes = ?, updated_at = ? WHERE id = ?`).bind(notes, updatedAt, id).run();
}

export async function listAllForExport(
  db: D1Database,
  params: Pick<ListParams, "form" | "status" | "sector">
): Promise<SubmissionRow[]> {
  const { where, binds } = buildWhere(params);
  const result = await db
    .prepare(`SELECT * FROM submissions WHERE ${where} ORDER BY created_at DESC`)
    .bind(...binds)
    .all<SubmissionRow>();
  return result.results;
}

export async function countTestSubmissions(db: D1Database): Promise<number> {
  const row = await db.prepare(`SELECT COUNT(*) as count FROM submissions WHERE is_test = 1`).first<{ count: number }>();
  return row?.count ?? 0;
}

export async function deleteTestSubmissions(db: D1Database): Promise<{ id: string; file_key: string | null }[]> {
  const result = await db
    .prepare(`SELECT id, file_key FROM submissions WHERE is_test = 1`)
    .all<{ id: string; file_key: string | null }>();
  await db.prepare(`DELETE FROM submissions WHERE is_test = 1`).run();
  return result.results;
}
