import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER!;
const pass = process.env.SMTP_PASSWORD!;

// Port 587 expects `secure: false` (STARTTLS). Port 465 expects `secure: true`.
const isSecure = port === 465;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: isSecure,
  auth: {
    user,
    pass,
  },
});

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
  const mailOptions = {
    from: `"Digital Resolution" <${user}>`,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  };

  return await transporter.sendMail(mailOptions);
}
