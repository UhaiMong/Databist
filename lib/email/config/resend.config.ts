import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_RESEND_EMAIL = "uhaimong.me@gmail.com";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: `Digital Resolution <${FROM_RESEND_EMAIL}>`,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }

  return data;
}
