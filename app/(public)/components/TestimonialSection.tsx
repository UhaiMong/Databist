import { Star } from "lucide-react";

export default function TestimonialSection({
  testimonials,
}: {
  testimonials: any;
}) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">What Clients Say</h2>
      </div>
      {testimonials.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((t: any) => (
            <div key={t._id} className="rounded-lg border p-6">
              <div className="mb-3 flex gap-1 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary" />
                ))}
              </div>
              <p className="text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold">{t.clientName}</p>
              {(t.clientRole || t.companyName) && (
                <p className="text-xs text-muted-foreground">
                  {t.clientRole}
                  {t.clientRole && t.companyName ? ", " : ""}
                  {t.companyName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
