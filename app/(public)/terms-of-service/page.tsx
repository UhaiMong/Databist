import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Digital Resolution",
  description:
    "Engagement terms for Digital Resolution's paid service packages.",
};

export default function TermsOfServicePage() {
  return (
    <article className="container mx-auto px-4 py-16">
      <div className="prose prose-neutral mx-auto max-w-3xl dark:prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <h2>1. Services</h2>
        <p>
          Digital Resolution provides website development, graphic design,
          content writing, SEO, video ads, social media management, digital
          marketing, and online maintenance packages as described on our
          Services pages. Package pricing shown is a starting price; final scope
          and pricing are confirmed during consultation.
        </p>

        <h2>2. Engagement Model</h2>
        <p>
          Projects are engaged on a project-based pricing model unless otherwise
          agreed in writing. Combo/bundle packages combine multiple services at
          a discounted combined rate as described on the relevant package page.
        </p>

        <h2>3. Booking & Consultations</h2>
        <p>
          Booking a consultation through our scheduling system does not
          constitute a binding service agreement. A separate written agreement
          or invoice will confirm project scope, timeline, and payment terms
          before work begins.
        </p>

        <h2>4. Payment Terms</h2>
        <p>
          Payment terms, milestones, and deposit requirements will be specified
          in the applicable project proposal or invoice.
        </p>

        <h2>5. Cancellations & Rescheduling</h2>
        <p>
          Consultation bookings may be cancelled or rescheduled using the link
          provided in your confirmation email.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          Digital Resolution will perform services with reasonable skill and
          care but does not guarantee specific business outcomes (e.g. search
          rankings, ad performance) resulting from marketing or SEO services.
        </p>

        <h2>7. Contact</h2>
        <p>
          For questions about these terms, please reach out via our{" "}
          <a href="/contact">Contact page</a>.
        </p>
      </div>
    </article>
  );
}
