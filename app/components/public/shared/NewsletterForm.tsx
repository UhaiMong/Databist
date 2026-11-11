"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function NewsletterForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!executeRecaptcha) {
        toast.error("Security check is still loading. Please try again.");
        return;
      }

      const recaptchaToken = await executeRecaptcha("newsletter_form");
      if (!recaptchaToken) {
        toast.error(
          "reCAPTCHA failed to generate a token. Please refresh and try again.",
        );
        return;
      }

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot, recaptchaToken }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message ?? "Subscribed successfully.");
        setEmail("");
      } else {
        toast.error(data.message ?? "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleNewsletterSubmit} className="space-y-2">
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />
      <div className="relative flex items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2.5 pr-12 text-sm text-brand-muted bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-brand-light transition-all placeholder:text-gray-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-1 p-2 bg-brand-gold hover:brightness-110 text-page-bg rounded-md transition-colors duration-200 cursor-pointer disabled:opacity-60"
          aria-label="Subscribe"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
}
