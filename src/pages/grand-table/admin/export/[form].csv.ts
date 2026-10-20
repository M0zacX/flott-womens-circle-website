import type { APIRoute } from "astro";
import type { FormConfig } from "../../../../data/grand-table-forms";
import { forms } from "../../../../data/grand-table-forms";
import { getAuthedSession } from "../../../../lib/gt/auth";
import { listAllForExport } from "../../../../lib/gt/db";
import type { SubmissionStatus } from "../../../../lib/gt/db";
import { toCsv } from "../../../../lib/gt/csv";

export const prerender = false;

export const GET: APIRoute = async ({ params, url, cookies, locals, redirect }) => {
  const env = locals.runtime.env;
  const authed = await getAuthedSession(cookies, env.SESSION_SECRET);
  if (!authed) return redirect("/grand-table/admin/login");

  const formId = params.form;
  const form: FormConfig | undefined = formId ? (forms as Record<string, FormConfig>)[formId] : undefined;
  if (!form) return new Response("Not found", { status: 404 });

  const statusParam = (url.searchParams.get("status") || "all") as SubmissionStatus | "all";
  const rows = await listAllForExport(env.GT_DB, form.id, statusParam);

  const header = [...form.fields.map((f) => f.label), "Status", "Created", "Notes"];
  const body = rows.map((row) => {
    const data = JSON.parse(row.data) as Record<string, string>;
    return [
      ...form.fields.map((f) => (f.type === "file" ? row.file_name ?? "" : data[f.name] ?? "")),
      row.status,
      row.created_at,
      row.notes ?? "",
    ];
  });

  const csv = toCsv([header, ...body]);

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${form.id}-submissions.csv"`,
    },
  });
};
