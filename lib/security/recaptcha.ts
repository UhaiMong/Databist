/**
 * Verify a Google reCAPTCHA v3 token.
 * Fails closed when the secret is missing or the token is invalid/low-score.
 */
export async function verifyRecaptcha(
  token: string | null | undefined,
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set — rejecting request");
    return false;
  }

  if (!token) return false;

  try {
    const params = new URLSearchParams({
      secret,
      response: token,
    });

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      "error-codes"?: string[];
    };

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return false;
    }

    if (typeof data.score === "number" && data.score < 0.5) {
      console.warn("reCAPTCHA low score:", data.score);
      return false;
    }

    return true;
  } catch (err) {
    console.error("reCAPTCHA verification request error:", err);
    return false;
  }
}
