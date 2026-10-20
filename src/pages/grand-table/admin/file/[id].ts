import type { APIRoute } from "astro";
import { getAuthedSession } from "../../../../lib/gt/auth";
import { getSubmission } from "../../../../lib/gt/db";
import { getFile } from "../../../../lib/gt/storage";

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies, locals, redirect }) => {
  const env = locals.runtime.env;
  const authed = await getAuthedSession(cookies, env.SESSION_SECRET);
  if (!authed) return redirect("/grand-table/admin/login");

  const id = params.id;
  if (!id) return new Response("Not found", { status: 404 });

  const row = await getSubmission(env.GT_DB, id);
  if (!row || !row.file_key) return new Response("Not found", { status: 404 });

  const object = await getFile(env.GT_UPLOADS, row.file_key);
  if (!object) return new Response("Not found", { status: 404 });

  const fileName = (row.file_name || "file.pdf").replace(/"/g, "");

  return new Response(object.body, {
    status: 200,
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
};
