// Email sending for The Grand Table.
//
// Two senders, picked at send time:
//  1. Cloudflare `send_email` binding (env.SEND_EMAIL). Free, but it can only
//     deliver to verified destination addresses on the Cloudflare account, so it
//     is used for admin notifications (ADMIN_NOTIFY_TO). Sender must be on a
//     domain/subdomain with Email Routing enabled (EMAIL_FROM).
//  2. Resend (env.RESEND_API_KEY). Can reach any address; used for registrant
//     confirmations, and as a fallback for admin mail when no binding exists.
// Nothing is sent unless EMAIL_ENABLED === "true"; otherwise it only logs.

export type EmailAttachment = {
  filename: string;
  contentType: string;
  content: ArrayBuffer;
};

export type SendEmailBinding = {
  send(message: {
    from: string | { email: string; name?: string };
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
    attachments?: { content: ArrayBuffer | string; filename: string; type: string; disposition: "attachment" | "inline" }[];
  }): Promise<unknown>;
};

export type EmailEnv = {
  EMAIL_ENABLED: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME?: string;
  RESEND_API_KEY?: string;
  ADMIN_NOTIFY_TO?: string;
  SEND_EMAIL?: SendEmailBinding;
};

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
};

export type SendResult = { sent: boolean; via: "cloudflare" | "resend" | "stub" | "none"; error?: string };

function verifiedAdminAddresses(env: EmailEnv): Set<string> {
  return new Set(
    (env.ADMIN_NOTIFY_TO || "")
      .split(",")
      .map((a) => a.trim().toLowerCase())
      .filter(Boolean)
  );
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

export async function sendEmail(env: EmailEnv, message: EmailMessage): Promise<SendResult> {
  const to = (Array.isArray(message.to) ? message.to : [message.to]).filter(Boolean);
  if (to.length === 0) return { sent: false, via: "none" };

  if (env.EMAIL_ENABLED !== "true" || !env.EMAIL_FROM) {
    console.log("email stubbed", { to, subject: message.subject, attachments: message.attachments?.length ?? 0 });
    return { sent: false, via: "stub" };
  }

  const fromName = env.EMAIL_FROM_NAME || "The Grand Table 2026";
  const verified = verifiedAdminAddresses(env);
  const allVerified = to.every((a) => verified.has(a.toLowerCase()));

  if (env.SEND_EMAIL && allVerified) {
    try {
      await env.SEND_EMAIL.send({
        from: { email: env.EMAIL_FROM, name: fromName },
        to,
        subject: message.subject,
        html: message.html,
        text: message.text,
        replyTo: message.replyTo,
        attachments: message.attachments?.map((a) => ({
          content: a.content,
          filename: a.filename,
          type: a.contentType,
          disposition: "attachment" as const,
        })),
      });
      return { sent: true, via: "cloudflare" };
    } catch (error) {
      console.error("cloudflare send_email failed", error);
      if (!env.RESEND_API_KEY) return { sent: false, via: "cloudflare", error: String(error) };
    }
  }

  if (!env.RESEND_API_KEY) {
    console.log("email skipped: no sender for these recipients", { to, subject: message.subject });
    return { sent: false, via: "none" };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${fromName} <${env.EMAIL_FROM}>`,
      to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      reply_to: message.replyTo,
      attachments: message.attachments?.map((a) => ({ filename: a.filename, content: toBase64(a.content) })),
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    console.error("resend send failed", response.status, body);
    return { sent: false, via: "resend", error: `${response.status}` };
  }
  return { sent: true, via: "resend" };
}
