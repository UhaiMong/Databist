interface GA4EventPayload {
  clientId?: string;
  eventName: string;
  params?: Record<string, unknown>;
}

export async function sendGA4Event({
  clientId,
  eventName,
  params,
}: GA4EventPayload) {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) {
    // Gracefully skip if credentials are missing
    return;
  }

  const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId || "server.booking.event",
        events: [
          {
            name: eventName,
            params: {
              engagement_time_msec: "100",
              session_id: Date.now().toString(),
              ...params,
            },
          },
        ],
      }),
    });
    if (!res.ok) console.error("GA4 MP error: ", res.status);
  } catch (error) {
    console.error("GA4 MP request failed: ", error);
  }
}
