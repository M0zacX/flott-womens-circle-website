import type { FormConfig } from "../../data/grand-table-forms";

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function baseTemplate(bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#F5F0E6;font-family:Georgia,'Times New Roman',serif;color:#0B0B0C;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E6;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" style="max-width:640px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid rgba(154,123,69,0.25);">
            <tr>
              <td style="background:#0B0B0C;padding:28px 32px;text-align:center;">
                <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.02em;color:#F5F0E6;">The Grand Table <span style="color:#C9A96E;font-style:italic;">2026</span></div>
              </td>
            </tr>
            <tr>
              <td style="height:3px;background:linear-gradient(to right,#B08D57,#C9A96E,#B08D57);line-height:3px;font-size:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:32px;background:#FFFFFF;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid rgba(154,123,69,0.2);text-align:center;background:#FFFFFF;">
                <div style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(11,11,12,0.5);">An initiative of Flott Women's Circle</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

const CONFIRMATIONS: Record<string, { subject: string; heading: string; message: string }> = {
  enterprise: {
    subject: "We received your Expression of Interest",
    heading: "Expression of Interest received",
    message:
      "Thank you for applying as an enterprise for The Grand Table 2026. Our team will review your submission and shortlisted enterprises will be contacted with next steps.",
  },
  delegate: {
    subject: "We received your registration",
    heading: "Registration received",
    message:
      "Thank you for registering for The Grand Table 2026. Our team will review your registration and follow up with details, including the delegate participation fee where applicable.",
  },
  investor: {
    subject: "We received your enquiry",
    heading: "Enquiry received",
    message:
      "Thank you for your interest in investing or partnering with The Grand Table 2026. Our partnerships team will review your enquiry and follow up with tailored opportunities.",
  },
  sponsor: {
    subject: "We received your sponsorship enquiry",
    heading: "Sponsorship enquiry received",
    message:
      "Thank you for your interest in sponsoring The Grand Table 2026. Our partnerships team will follow up with the sponsorship brochure and next steps.",
  },
  contact: {
    subject: "We received your message",
    heading: "Message received",
    message: "Thank you for contacting us about The Grand Table 2026. Our team will respond to your enquiry shortly.",
  },
};

export function confirmationEmail(form: FormConfig, name: string): { subject: string; html: string } {
  const copy = CONFIRMATIONS[form.id] ?? CONFIRMATIONS.contact;
  const greeting = escapeHtml(name || "there");
  const body = `
    <h1 style="margin:0 0 16px;font-size:20px;font-weight:400;color:#0B0B0C;">${copy.heading}</h1>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(11,11,12,0.75);">Dear ${greeting},</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:rgba(11,11,12,0.75);">${copy.message}</p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(11,11,12,0.75);">Abuja, Nigeria &middot; 6 December 2026</p>
  `;
  return { subject: copy.subject, html: baseTemplate(body) };
}

const FORM_SHORT: Record<string, { name: string; kind: string }> = {
  enterprise: { name: "Enterprise", kind: "registration" },
  delegate: { name: "Delegate", kind: "registration" },
  investor: { name: "Investor/Partner", kind: "enquiry" },
  sponsor: { name: "Sponsor", kind: "enquiry" },
  contact: { name: "Contact", kind: "enquiry" },
};

export type AdminFileInfo =
  | { state: "attached"; name: string; size: number }
  | { state: "linked"; name: string; size: number; url: string }
  | { state: "uploads-off" }
  | { state: "none" };

function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function linkify(field: { type: string }, value: string): string {
  const safe = escapeHtml(value);
  if (field.type === "email") return `<a href="mailto:${safe}" style="color:#9A7B45;text-decoration:underline;">${safe}</a>`;
  if (field.type === "tel") return `<a href="tel:${safe.replace(/[^0-9+]/g, "")}" style="color:#0B0B0C;text-decoration:none;">${safe}</a>`;
  if (field.type === "url" && /^https?:\/\//i.test(value)) return `<a href="${safe}" style="color:#9A7B45;text-decoration:underline;">${safe}</a>`;
  return safe.replace(/\n/g, "<br />");
}

export function adminNotificationEmail(
  form: FormConfig,
  data: Record<string, string>,
  submittedAtWat: string,
  adminUrl: string,
  opts: { file?: AdminFileInfo; isTest?: boolean } = {}
): { subject: string; html: string; text: string } {
  const short = FORM_SHORT[form.id] ?? { name: form.title, kind: "submission" };
  const who = data.companyName || data.organisation || data.organization || data.fullName || data.contactName || data.email || "New applicant";
  const subject = `${opts.isTest ? "[TEST] " : ""}New ${short.name} ${short.kind} – ${who}`;
  const file = opts.file ?? { state: "none" };

  const rowsData = form.fields.map((field) => {
    if (field.type === "file") {
      let html: string, text: string;
      if (file.state === "attached") {
        html = `${escapeHtml(file.name)} <span style="color:rgba(11,11,12,0.5);">(${formatBytes(file.size)}, attached to this email)</span>`;
        text = `${file.name} (attached)`;
      } else if (file.state === "linked") {
        html = `<a href="${escapeHtml(file.url)}" style="color:#9A7B45;text-decoration:underline;">${escapeHtml(file.name)}</a> <span style="color:rgba(11,11,12,0.5);">(${formatBytes(file.size)}, too large to attach – sign in to download)</span>`;
        text = `${file.name}: ${file.url}`;
      } else if (file.state === "uploads-off") {
        html = `<span style="color:rgba(11,11,12,0.5);">Uploads not open yet – please request the PDF by reply</span>`;
        text = "Uploads not open yet";
      } else {
        html = `<span style="color:rgba(11,11,12,0.4);">Not provided</span>`;
        text = "Not provided";
      }
      return { label: field.label, html, text };
    }
    const value = data[field.name];
    return value
      ? { label: field.label, html: linkify(field, value), text: value }
      : { label: field.label, html: `<span style="color:rgba(11,11,12,0.4);">Not provided</span>`, text: "Not provided" };
  });

  const rows = rowsData
    .map(
      (r, i) => `
        <tr>
          <td style="padding:12px 14px;width:38%;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:600;color:rgba(11,11,12,0.6);vertical-align:top;background:${i % 2 ? "#FFFFFF" : "#FBF8F2"};border-bottom:1px solid rgba(154,123,69,0.15);">${escapeHtml(r.label)}</td>
          <td style="padding:12px 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#0B0B0C;vertical-align:top;background:${i % 2 ? "#FFFFFF" : "#FBF8F2"};border-bottom:1px solid rgba(154,123,69,0.15);word-break:break-word;">${r.html}</td>
        </tr>`
    )
    .join("");

  const replyHint = data.email
    ? `<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:rgba(11,11,12,0.65);">Reply to this email to answer ${escapeHtml(who)} directly.</p>`
    : "";

  const testBanner = opts.isTest
    ? `<div style="margin:0 0 20px;padding:10px 14px;border-radius:8px;background:#FFF4D6;border:1px solid #E6C766;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6B5310;">This is a test submission. No action needed.</div>`
    : "";

  const body = `
    ${testBanner}
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#9A7B45;margin:0 0 8px;">${escapeHtml(form.title)}</div>
    <h1 style="margin:0 0 6px;font-size:24px;font-weight:400;line-height:1.3;color:#0B0B0C;">${escapeHtml(who)}</h1>
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:rgba(11,11,12,0.55);">Submitted ${escapeHtml(submittedAtWat)}</p>
    ${replyHint}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid rgba(154,123,69,0.2);border-radius:8px;overflow:hidden;margin:0 0 24px;">
      ${rows}
    </table>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:rgba(11,11,12,0.45);">All submissions are also saved in the <a href="${escapeHtml(adminUrl)}" style="color:#9A7B45;">admin panel</a>.</p>
  `;

  const text = [
    opts.isTest ? "[TEST SUBMISSION]" : "",
    `${form.title}: ${who}`,
    `Submitted ${submittedAtWat}`,
    "",
    ...rowsData.map((r) => `${r.label}: ${r.text}`),
    "",
    `Admin: ${adminUrl}`,
  ]
    .filter((l, i) => l !== "" || i > 0)
    .join("\n");

  return { subject, html: baseTemplate(body), text };
}
