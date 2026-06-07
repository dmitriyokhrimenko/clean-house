import { Check } from 'lucide-react';

const trustBullets = [
  // 'Fully insured & background checked',
  'All supplies & equipment included',
  'Flexible scheduling — weekdays & weekends',
  'Satisfaction guaranteed or we\'ll make it right',
];

const decorativeBullets = [
  'Consistent, reliable service every visit',
  'Eco-friendly products available on request',
  'Respectful of your space and belongings',
];

const serviceAreas = [
  'NW Calgary', 'NE Calgary', 'SW Calgary',
  'SE Calgary', 'Downtown', 'Beltline',
];

export default function About() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex self-start bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-medium">
              About Us
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              About Clean House
            </h2>

            {/* Experience pills */}
            <div className="flex flex-wrap gap-3">
              <span className="bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold border border-primary-200">
                5+ Years Experience
              </span>
              <span className="bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold border border-primary-200">
                Calgary-Based
              </span>
            </div>

            <div className="flex flex-col gap-4 text-slate-600 leading-relaxed">
              <p>
                Clean House is a Calgary-based professional cleaning company with over
                5 years of experience serving homes, condos, and apartments across the city.
              </p>
              <p>
                We believe everyone deserves to come home to a clean, comfortable space.
                Our team treats every home with care and attention to detail, delivering
                consistent results you can count on.
              </p>
              <p>
                Every cleaning includes all supplies and equipment. We specialize in
                regular maintenance, deep cleaning, and move-in/move-out service for
                houses, condos, and apartments throughout Calgary.
              </p>
            </div>

            {/* Trust bullets */}
            <ul className="flex flex-col gap-3">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </span>
                  <span className="text-slate-700 font-medium">{bullet}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={scrollToBooking}
              className="self-start bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              Book a Free Estimate →
            </button>
          </div>

          {/* Right — decorative card */}
          <div
            className="rounded-2xl p-8 text-white flex flex-col gap-6"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)',
            }}
          >
            <div>
              <div className="text-2xl font-bold mb-1">✨ Clean House</div>
              <div className="text-sky-200 font-medium text-lg">
                Reliable. Thorough. Local.
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {decorativeBullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="text-yellow-300 text-lg flex-shrink-0">★</span>
                  <span className="text-sky-50 text-sm leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-sky-500/50 pt-6">
              <p className="text-sky-200 text-sm font-semibold uppercase tracking-wide mb-3">
                Serving all of Calgary
              </p>
              <div className="flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 border border-white/20">
              <p className="text-white font-medium text-sm text-center">
                📞 Free estimates — no obligation
              </p>
              <p className="text-sky-200 text-xs text-center mt-1">
                Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
