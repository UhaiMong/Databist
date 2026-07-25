import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
if (!host) {
  throw new Error("SMTP_HOST environment variable is not set.");
}

const port = Number(process.env.SMTP_PORT) || 465;

// Transporter
export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
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
