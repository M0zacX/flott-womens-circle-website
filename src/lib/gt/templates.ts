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
          <table role="presentation" width="100%" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid rgba(154,123,69,0.25);">
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
    <p style="margin:0;font-size:14px;line-height:1.6;color:rgba(11,11,12,0.75);">Abuja, Nigeria &middot; 5 December 2026</p>
  `;
  return { subject: copy.subject, html: baseTemplate(body) };
}
