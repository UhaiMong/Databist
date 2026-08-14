"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  async function handleNewsletterSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      toast.success("We appriciate it! ", data.message ?? "");
      setEmail("");
    } else {
      toast.error(data.message ?? "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleNewsletterSubmit} className="space-y-2">
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
          className="absolute right-1 p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors duration-200 cursor-pointer"
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
