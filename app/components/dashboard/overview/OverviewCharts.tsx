"use client";

type TrendPoint = { date: string; count: number };
type ServicePoint = { label: string; count: number };

type OverviewChartsProps = {
  bookingTrend: TrendPoint[];
  conversionByService: ServicePoint[];
};

function BarChart({
  points,
  emptyLabel,
}: {
  points: { label: string; value: number }[];
  emptyLabel: string;
}) {
  if (points.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <div className="space-y-3">
      {points.map((point) => (
        <div key={point.label} className="space-y-1">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate">{point.label}</span>
            <span className="shrink-0 font-semibold tabular-nums">{point.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${(point.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OverviewCharts({
  bookingTrend,
  conversionByService,
}: OverviewChartsProps) {
  const maxTrend = Math.max(...bookingTrend.map((p) => p.count), 1);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold">Bookings · last 14 days</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Daily volume from new booking dates.
        </p>
        {bookingTrend.every((p) => p.count === 0) ? (
          <p className="text-sm text-muted-foreground">No bookings in this period.</p>
        ) : (
          <div className="flex h-40 items-end gap-1.5">
            {bookingTrend.map((point) => (
              <div
                key={point.date}
                className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
                title={`${point.date}: ${point.count}`}
              >
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {point.count || ""}
                </span>
                <div
                  className="w-full rounded-t bg-brand/80"
                  style={{
                    height: `${Math.max((point.count / maxTrend) * 100, point.count > 0 ? 8 : 2)}%`,
                  }}
                />
                <span className="truncate text-[9px] text-muted-foreground">
                  {point.date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-base font-semibold">Top services</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Bookings grouped by service of interest.
        </p>
        <BarChart
          emptyLabel="No booking data yet."
          points={conversionByService.map((item) => ({
            label: item.label,
            value: item.count,
          }))}
        />
      </div>
    </div>
  );
}
