import type { APIRoute } from "astro";
import type { FormConfig } from "../../../../data/grand-table-forms";
import { forms } from "../../../../data/grand-table-forms";
import { validateSubmission } from "../../../../lib/gt/validate";
import { insertSubmission } from "../../../../lib/gt/db";
import { enterpriseFileKey, putFile } from "../../../../lib/gt/storage";
import { sendEmail } from "../../../../lib/gt/email";
import { confirmationEmail, adminNotificationEmail, type AdminFileInfo } from "../../../../lib/gt/templates";
import { formatDateTime } from "../../../../lib/gt/dates";

export const prerender = false;

// Attach PDFs up to 8 MB; larger ones are linked to the admin download instead.
const MAX_ATTACH_BYTES = 8 * 1024 * 1024;

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

  const uploadsEnabled = Boolean(locals.runtime.env.GT_UPLOADS);
  const { errors, data, file } = await validateSubmission(form, formData, { uploadsEnabled });

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

  if (file && env.GT_UPLOADS) {
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

  const adminRecipients = (env.ADMIN_NOTIFY_TO || "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  if (adminRecipients.length > 0) {
    try {
      const origin = new URL(request.url).origin;
      const adminUrl = `${origin}/grand-table/admin/${form.id}/${id}`;
      const hasFileField = form.fields.some((f) => f.type === "file");
      let fileInfo: AdminFileInfo = { state: "none" };
      const attachments = [];
      if (file && fileKey && fileName) {
        if (file.size <= MAX_ATTACH_BYTES) {
          attachments.push({ filename: fileName, contentType: "application/pdf", content: await file.arrayBuffer() });
          fileInfo = { state: "attached", name: fileName, size: file.size };
        } else {
          fileInfo = { state: "linked", name: fileName, size: file.size, url: `${origin}/grand-table/admin/file/${id}` };
        }
      } else if (hasFileField && !uploadsEnabled) {
        fileInfo = { state: "uploads-off" };
      }
      const { subject, html, text } = adminNotificationEmail(form, data, formatDateTime(createdAt), adminUrl, {
        file: fileInfo,
        isTest: env.GT_TEST_SUBJECTS === "true",
      });
      await sendEmail(env, { to: adminRecipients, subject, html, text, replyTo: data.email, attachments });
    } catch (error) {
      console.error("admin notification email failed", error);
    }
  }

  return jsonResponse({ ok: true, id }, 200);
};
