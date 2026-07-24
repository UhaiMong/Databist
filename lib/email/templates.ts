interface ContactNotificationData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function contactNotificationTemplate(
  data: ContactNotificationData,
): string {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-line;">${data.message}</p>
    </div>
  `;
}

export function contactAcknowledgementTemplate(name: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2>Thanks for reaching out, ${name}!</h2>
      <p>We've received your message and will get back to you within 1-2 business days.</p>
      <p>If your inquiry is urgent, feel free to <a href="https://digitalresolution.net/booking">book a free consultation</a> directly.</p>
      <p>— Digital Resolution</p>
    </div>
  `;
}
