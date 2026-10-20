import type { APIRoute } from "astro";
import { getAuthedSession, getSessionToken, verifyCsrfToken } from "../../../lib/gt/auth";
import { deleteTestSubmissions } from "../../../lib/gt/db";
import { deleteFile } from "../../../lib/gt/storage";

export const prerender = false;

function safeRedirectPath(candidate: string): string {
  return candidate.startsWith("/grand-table/admin") ? candidate : "/grand-table/admin";
}

export const POST: APIRoute = async ({ request, cookies, locals, redirect }) => {
  const env = locals.runtime.env;
  const authed = await getAuthedSession(cookies, env.SESSION_SECRET);
  if (!authed) return redirect("/grand-table/admin/login");

  const sessionToken = getSessionToken(cookies) as string;
  const body = await request.formData();
  const csrf = String(body.get("csrf") ?? "");
  const redirectTo = safeRedirectPath(String(body.get("redirectTo") ?? "/grand-table/admin"));
  const csrfValid = await verifyCsrfToken(env.SESSION_SECRET, sessionToken, csrf);

  const destination = new URL(redirectTo, request.url);
  destination.searchParams.delete("cleared");
  destination.searchParams.delete("clearError");

  if (!csrfValid) {
    destination.searchParams.set("clearError", "1");
    return redirect(`${destination.pathname}?${destination.searchParams.toString()}`);
  }

  const deleted = await deleteTestSubmissions(env.GT_DB);
  await Promise.all(
    deleted.filter((row) => row.file_key && env.GT_UPLOADS).map((row) => deleteFile(env.GT_UPLOADS, row.file_key as string))
  );

  destination.searchParams.set("cleared", String(deleted.length));
  return redirect(`${destination.pathname}?${destination.searchParams.toString()}`);
};
