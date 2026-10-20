import type { APIRoute } from "astro";
import type { FormConfig } from "../../../../data/grand-table-forms";
import { forms } from "../../../../data/grand-table-forms";
import { validateSubmission } from "../../../../lib/gt/validate";
import { insertSubmission } from "../../../../lib/gt/db";
import { enterpriseFileKey, putFile } from "../../../../lib/gt/storage";
import { sendEmail } from "../../../../lib/gt/email";
import { confirmationEmail } from "../../../../lib/gt/templates";

export const prerender = false;

const HONEYPOT_FIELD = "company_website_hp";

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function pickName(data: Record<string, string>): string | null {
  for (const key of ["contactName", "fullName", "companyName"]) {
    if (data[key]) return data[key];
  }
  return null;
}

export const POST: APIRoute = async ({ params, request, locals }) => {
  const formId = params.form;
  const form: FormConfig | undefined = formId ? (forms as Record<string, FormConfig>)[formId] : undefined;

  if (!form) {
    return jsonResponse({ ok: false, errors: { form: "Unknown form" } }, 404);
  }

  const formData = await request.formData();

  if (formData.get(HONEYPOT_FIELD)) {
    return jsonResponse({ ok: true, id: crypto.randomUUID() }, 200);
  }

  const { errors, data, file } = await validateSubmission(form, formData);

  if (Object.keys(errors).length > 0) {
    return jsonResponse({ ok: false, errors }, 400);
  }

  const env = locals.runtime.env;
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const name = pickName(data);

  let fileKey: string | undefined;
  let fileName: string | undefined;
  let fileSize: number | undefined;

  if (file) {
    fileKey = enterpriseFileKey(id, file.name);
    await putFile(env.GT_UPLOADS, fileKey, file);
    fileName = file.name;
    fileSize = file.size;
  }

  await insertSubmission(env.GT_DB, {
    id,
    form: form.id,
    data,
    email: data.email,
    name: name ?? undefined,
    fileKey,
    fileName,
    fileSize,
    createdAt,
  });

  if (data.email) {
    const { subject, html } = confirmationEmail(form, name ?? "");
    await sendEmail(env, { to: data.email, subject, html });
  }

  return jsonResponse({ ok: true, id }, 200);
};
