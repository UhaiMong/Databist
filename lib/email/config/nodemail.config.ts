import nodemailer from "nodemailer";

// Fail fast instead of silently falling back to a default host.
const host = process.env.SMTP_HOST;
if (!host) {
  throw new Error("SMTP_HOST environment variable is not set.");
}

const port = Number(process.env.SMTP_PORT) || 465;
const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: isSecure,
  requireTLS: !isSecure,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000,
});

// Call once at app startup (not per-request) to catch bad credentials/host early.
export async function verifyMailer() {
  try {
    await transporter.verify();
    console.log("SMTP transporter is ready.");
  } catch (err) {
    console.error("SMTP transporter verification failed:", err);
    throw err;
  }
}

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
    from: `"Digital Resolution" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    ...(replyTo && { replyTo }),
  };

  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send email:", err);
    throw err;
  }
}
