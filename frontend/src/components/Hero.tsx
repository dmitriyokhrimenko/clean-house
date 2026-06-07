import { Check } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const trustItems = [
  'Supplies Included',
  '5+ Years Experience',
  'Calgary-Based',
  // 'Fully Insured',
];

const stats = [
  { value: '100+', label: 'Happy Clients' },
  { value: '5+', label: 'Years Experience' },
  { value: '4.9 ★', label: 'Average Rating' },
  { value: '100%', label: 'Satisfaction' },
];

export default function Hero() {
  const { settings } = useSettings();
  const phone = settings?.phone ?? '(587) 123-4567';
  const startingPrice = settings?.startingPrice ?? 'From $40/hr';
  const phoneHref = `tel:+1${phone.replace(/\D/g, '')}`;

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="pt-16 min-h-screen flex items-center"
      style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #ffffff 60%)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left — text content */}
          <div className="flex flex-col gap-6">
            <span className="inline-flex items-center self-start bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-medium">
              🌟 Calgary's Trusted Cleaning Service
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Home, Condo &amp; Apartment Cleaning{' '}
              <span className="text-primary-600">in Calgary</span>
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Reliable regular, deep, and move-in/move-out cleaning from{' '}
              <strong className="text-slate-800">{startingPrice}</strong>. Supplies
              included. Request a free estimate today.
            </p>

            {/* Trust row */}
            <div className="flex flex-wrap gap-3">
              {trustItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 text-sm text-slate-700 font-medium"
                >
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
              <button
                onClick={scrollToBooking}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                Request Free Estimate →
              </button>
              <span className="text-slate-500 text-sm">
                Or call us:{' '}
                <a
                  href={phoneHref}
                  className="text-primary-600 font-medium hover:underline"
                >
                  {phone}
                </a>
              </span>
            </div>
          </div>

          {/* Right — stats card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h2 className="text-slate-900 font-bold text-xl mb-6 text-center">
              Trusted by Calgary Homeowners
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center p-4 rounded-xl bg-primary-50 border border-primary-100"
                >
                  <span className="text-3xl font-extrabold text-primary-600">
                    {stat.value}
                  </span>
                  <span className="text-sm text-slate-600 mt-1 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <p className="text-emerald-700 font-medium text-sm">
                ✅ Background checked &amp; fully insured
              </p>
            </div> */}

            <div className="mt-4 text-center">
              <p className="text-slate-500 text-xs">
                Serving all Calgary neighbourhoods since 2021
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
