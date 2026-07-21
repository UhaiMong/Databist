import { Star } from "lucide-react";

export default async function TrustTrip() {
  const established = 2020;
  const date = new Date();
  const fullYear = date.getFullYear();
  const experience = fullYear - established;
  return (
    <section className="border-y bg-linear-to-r from-brand-dark via-brand to-brand-dark py-6">
      <div className="container mx-auto grid grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4">
        <div>
          <h3 className="text-2xl font-bold text-white">{experience}+</h3>
          <p className="text-sm text-brand-light">Years in Operation</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">150+</h3>
          <p className="text-sm text-brand-light">Clients Served</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">10+</h3>
          <p className="text-sm text-brand-light">Countries Served</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1 text-white">
            <Star className="h-5 w-5 fill-white" />
            <span className="text-2xl font-bold">4.9</span>
          </div>
          <p className="text-sm text-brand-light">Average Rating</p>
        </div>
      </div>
    </section>
  );
}
