// Contact email template interface
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  company?: string;
}

// Booking email template interface
interface BookingEmailData {
  name: string;
  email: string;
  phone?: string;
  date: string | Date;
  timeSlot: string;
  serviceOfInterest?: string;
  notes?: string;
}

interface BookingData {
  name: string;
  email: string;
  date: string | Date;
  timeSlot: string;
  serviceOfInterest?: string;
  status: string;
}

// 1.1. Notification sent to the Agency
export function contactNotificationTemplate(data: ContactFormData): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; margin-bottom: 20px; }
        .header h2 { margin: 0; color: #111827; font-size: 20px; }
        .field { margin-bottom: 16px; }
        .label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #6b7280; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #1f2937; line-height: 1.5; background: #f9fafb; padding: 10px 12px; border-radius: 6px; border: 1px solid #f3f4f6; }
        .message-box { white-space: pre-wrap; word-break: break-word; }
        .footer { margin-top: 25px; padding-top: 15px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📥 New Contact Form Submission</h2>
        </div>

        <div class="field">
          <div class="label">Name</div>
          <div class="value">${escapeHtml(data.name)}</div>
        </div>

        <div class="field">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
        </div>

        ${
          data.phone
            ? `
        <div class="field">
          <div class="label">Phone</div>
          <div class="value">${escapeHtml(data.phone)}</div>
        </div>
        `
            : ""
        }

        ${
          data.company
            ? `
        <div class="field">
          <div class="label">Company</div>
          <div class="value">${escapeHtml(data.company)}</div>
        </div>
        `
            : ""
        }

        <div class="field">
          <div class="label">Subject</div>
          <div class="value">${escapeHtml(data.subject)}</div>
        </div>

        <div class="field">
          <div class="label">Message</div>
          <div class="value message-box">${escapeHtml(data.message)}</div>
        </div>

        <div class="footer">
          Received via Website Contact Form • Digital Resolution
        </div>
      </div>
    </body>
  </html>
  `;
}

// 1.2. Acknowledgment sent to the User
export function contactAcknowledgementTemplate(name: string): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .header { margin-bottom: 24px; text-align: center; }
        .brand { font-size: 22px; font-weight: 700; color: #2563eb; letter-spacing: -0.5px; }
        .content { font-size: 15px; line-height: 1.6; color: #374151; }
        .content p { margin-bottom: 16px; }
        .highlight-box { background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">Digital Resolution</div>
        </div>

        <div class="content">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thank you for reaching out to us! We’ve received your message and our team is currently reviewing it.</p>
          
          <div class="highlight-box">
            <strong>What happens next?</strong><br>
            A representative will get back to you within 24 business hours.
          </div>

          <p>If you have any urgent follow-up details to share, feel free to reply directly to this email.</p>
          <p>Best regards,<br><strong>Digital Resolution Team</strong></p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Digital Resolution. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}

// 2.1. Notification sent to Agency

export function bookingNotificationTemplate(data: BookingEmailData): string {
  const formattedDate = new Date(data.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .header { border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
        .header h2 { margin: 0; color: #1e293b; font-size: 20px; }
        .grid { display: table; width: 100%; margin-bottom: 15px; }
        .field { margin-bottom: 14px; }
        .label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 4px; }
        .value { font-size: 15px; color: #0f172a; background: #f8fafc; padding: 10px 12px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .highlight { background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>📅 New Consultation Booking Request</h2>
        </div>

        <div class="field">
          <div class="label">Client Name</div>
          <div class="value">${escapeHtml(data.name)}</div>
        </div>

        <div class="field">
          <div class="label">Requested Date & Time Slot</div>
          <div class="value highlight">📅 ${formattedDate} at ⏰ ${escapeHtml(data.timeSlot)}</div>
        </div>

        <div class="field">
          <div class="label">Email</div>
          <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
        </div>

        ${
          data.phone
            ? `
        <div class="field">
          <div class="label">Phone</div>
          <div class="value">${escapeHtml(data.phone)}</div>
        </div>
        `
            : ""
        }

        ${
          data.serviceOfInterest
            ? `
        <div class="field">
          <div class="label">Service of Interest</div>
          <div class="value">${escapeHtml(data.serviceOfInterest)}</div>
        </div>
        `
            : ""
        }

        ${
          data.notes
            ? `
        <div class="field">
          <div class="label">Additional Notes</div>
          <div class="value">${escapeHtml(data.notes)}</div>
        </div>
        `
            : ""
        }
      </div>
    </body>
  </html>
  `;
}

// 2.2. Confirmation sent to Client
export function bookingConfirmationTemplate(
  name: string,
  date: string,
  timeSlot: string,
  timezone: string,
): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .brand { font-size: 22px; font-weight: 700; color: #2563eb; text-align: center; margin-bottom: 24px; }
        .content { font-size: 15px; line-height: 1.6; color: #334155; }
        .booking-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .booking-card-item { margin-bottom: 10px; font-size: 15px; }
        .booking-card-item:last-child { margin-bottom: 0; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand">Digital Resolution</div>

        <div class="content">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Your booking request has been received! Here are the details of your requested appointment:</p>

          <div class="booking-card">
            <div class="booking-card-item"><strong>Date:</strong> ${escapeHtml(date)}</div>
            <div class="booking-card-item"><strong>Time:</strong> ${escapeHtml(timeSlot)}</div>
            <div class="booking-card-item"><strong>TimeZone:</strong> ${escapeHtml(timezone)}</div>
            <div class="booking-card-item"><strong>Status:</strong> Pending Confirmation</div>
          </div>

          <p>Our team is reviewing the availability and will send a calendar invitation or reach out shortly to finalize your meeting.</p>
          <p>Best regards,<br><strong>Digital Resolution Team</strong></p>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Digital Resolution. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}

// Booking update triger

// Helper to format dates consistently
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 2.3. Rescheduled Notification Template
export function bookingRescheduledTemplate(data: BookingData): string {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .brand { font-size: 22px; font-weight: 700; color: #2563eb; text-align: center; margin-bottom: 24px; }
        .content { font-size: 15px; line-height: 1.6; color: #334155; }
        .booking-card { background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .booking-card-item { margin-bottom: 8px; font-size: 15px; color: #1e40af; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand">Digital Resolution</div>
        <div class="content">
          <p>Hi ${escapeHtml(data.name)},</p>
          <p>Your booking schedule has been updated. Here are your new appointment details:</p>

          <div class="booking-card">
            <div class="booking-card-item"><strong>New Date:</strong> ${formatDate(data.date)}</div>
            <div class="booking-card-item"><strong>New Time Slot:</strong> ${escapeHtml(data.timeSlot)}</div>
            <div class="booking-card-item"><strong>Status:</strong> ${escapeHtml(data.status.toUpperCase())}</div>
          </div>

          <p>If this new time doesn't work for you, please reply directly to this email to let us know.</p>
          <p>Best regards,<br><strong>Digital Resolution Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Digital Resolution. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}

// 2.4. Status Change Notification Template (Confirmed / Canceled / Rejected)
export function bookingStatusUpdateTemplate(data: BookingData): string {
  const statusColors: Record<
    string,
    { bg: string; border: string; text: string }
  > = {
    confirmed: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534" },
    cancelled: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" },
    rejected: { bg: "#fff7ed", border: "#ffedd5", text: "#9a3412" },
    pending: { bg: "#f8fafc", border: "#e2e8f0", text: "#334155" },
  };

  const style = statusColors[data.status.toLowerCase()] || statusColors.pending;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .brand { font-size: 22px; font-weight: 700; color: #2563eb; text-align: center; margin-bottom: 24px; }
        .content { font-size: 15px; line-height: 1.6; color: #334155; }
        .status-card { background-color: ${style.bg}; border: 1px solid ${style.border}; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .status-title { font-size: 18px; font-weight: 700; color: ${style.text}; margin-bottom: 12px; text-transform: capitalize; }
        .booking-detail { font-size: 14px; color: #475569; margin-bottom: 6px; }
        .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #94a3b8; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="brand">Digital Resolution</div>
        <div class="content">
          <p>Hi ${escapeHtml(data.name)},</p>
          <p>There is an update on your booking request status:</p>

          <div class="status-card">
            <div class="status-title">Status: ${escapeHtml(data.status)}</div>
            <div class="booking-detail"><strong>Date:</strong> ${formatDate(data.date)}</div>
            <div class="booking-detail"><strong>Time:</strong> ${escapeHtml(data.timeSlot)}</div>
          </div>

          ${
            data.status === "confirmed"
              ? "<p>We look forward to speaking with you! We'll send over a calendar invite shortly.</p>"
              : "<p>If you have any questions or would like to pick a different date, feel free to reply to this email.</p>"
          }

          <p>Best regards,<br><strong>Digital Resolution Team</strong></p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Digital Resolution. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `;
}

// Utility to prevent basic HTML injection in dynamic email content
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
