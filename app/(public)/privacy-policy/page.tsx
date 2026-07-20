import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Digital Resolution",
  description: "How Digital Resolution collects, uses, and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="container mx-auto px-4 py-16">
      <div className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, including through
          our contact form, booking form, and newsletter signup. This may
          include your name, email address, phone number, company name, and any
          message content you submit.
        </p>

        <h2>2. Booking Information</h2>
        <p>
          When you book a consultation through our scheduling system, we collect
          your name, email, phone/WhatsApp number, company (optional), service
          of interest, preferred date and time slot, and time zone. This
          information is used to confirm and manage your booking, and to send
          related notifications.
        </p>

        <h2>3. Analytics</h2>
        <p>
          We use Google Analytics (GA4) to understand how visitors use our site,
          including page views, form submissions, bookings, and
          click-to-call/WhatsApp interactions. This data is aggregated and does
          not directly identify you.
        </p>

        <h2>4. How We Use Your Information</h2>
        <p>
          We use collected information to respond to inquiries, manage bookings,
          send confirmations and reminders, improve our services, and, where you
          have opted in, send newsletter updates.
        </p>

        <h2>5. Data Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with
          service providers strictly necessary to operate our booking, email,
          and hosting infrastructure.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting us using the details on our Contact page.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          Questions about this policy can be directed to us via our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </article>
  );
}
