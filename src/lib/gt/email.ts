export type EmailEnv = {
  EMAIL_ENABLED: string;
  EMAIL_FROM: string;
  RESEND_API_KEY: string;
};

export type EmailMessage = {
  to: string | string[];
  subject: string;
  html: string;
};

export async function sendEmail(env: EmailEnv, message: EmailMessage): Promise<void> {
  const to = Array.isArray(message.to) ? message.to : [message.to];

  if (env.EMAIL_ENABLED !== "true" || !env.RESEND_API_KEY) {
    console.log("email stubbed", { to, subject: message.subject });
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to,
      subject: message.subject,
      html: message.html,
    }),
  });

  if (!response.ok) {
    console.error("resend send failed", response.status, await response.text());
  }
}
