import { Home, Sparkles, Package, Building2 } from 'lucide-react';
import type { ReactNode } from 'react';

interface ServiceCard {
  icon: ReactNode;
  title: string;
  description: string;
  price: string;
}

const services: ServiceCard[] = [
  {
    icon: <Home className="w-6 h-6 text-sky-600" />,
    title: 'Regular Cleaning',
    description:
      'Scheduled weekly or bi-weekly maintenance to keep your home consistently clean and fresh.',
    price: 'From $40/hr',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-sky-600" />,
    title: 'Deep Cleaning',
    description:
      'Thorough top-to-bottom cleaning for when you need a truly spotless home. Great for spring cleaning.',
    price: 'From $50/hr',
  },
  {
    icon: <Package className="w-6 h-6 text-sky-600" />,
    title: 'Move-In / Move-Out',
    description:
      'Professional cleaning when changing homes. Leave the old place spotless, start fresh in the new one.',
    price: 'Custom quote',
  },
  {
    icon: <Building2 className="w-6 h-6 text-sky-600" />,
    title: 'Small Office Cleaning',
    description:
      'Keep your workspace clean and your team productive with reliable scheduled office cleaning.',
    price: 'From $45/hr',
  },
];

export default function Services() {
  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-medium mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
            Our Cleaning Services
          </h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Professional cleaning tailored to your home and schedule
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                {service.icon}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
              </div>
              <span className="self-start bg-sky-100 text-sky-700 text-sm font-semibold px-3 py-1 rounded-full">
                {service.price}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <div className="bg-sky-600 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white font-semibold text-lg text-center sm:text-left">
            All services include supplies and equipment.
          </p>
          <button
            onClick={scrollToBooking}
            className="bg-white text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap shadow-sm"
          >
            Request Free Estimate →
          </button>
        </div>
      </div>
    </section>
  );
}
