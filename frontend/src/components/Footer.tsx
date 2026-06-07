import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Sparkles, Facebook, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const serviceAreas = ['NW Calgary', 'NE Calgary', 'SW Calgary', 'SE Calgary', 'Downtown', 'Beltline'];

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Request Estimate', to: '/booking' },
];

export default function Footer() {
  const { settings } = useSettings();

  const phone = settings?.phone ?? '(587) 123-4567';
  const email = settings?.email ?? 'info@cleanhouse.ca';
  const location = settings?.location ?? 'Calgary, Alberta';
  const facebookUrl = settings?.facebookUrl;
  const googleUrl = settings?.googleBusinessUrl;

  const phoneHref = `tel:+1${phone.replace(/\D/g, '')}`;

  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>{settings?.businessName ?? 'Clean House'}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional home cleaning in Calgary. Reliable. Thorough. Local.
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Serving Calgary homeowners, condo owners, and renters since 2021.
              All supplies and equipment included with every clean.
            </p>
            {(facebookUrl || googleUrl) && (
              <div className="flex items-center gap-3 mt-1">
                {facebookUrl && (
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {googleUrl && (
                  <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Google
                  </a>
                )}
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-medium">
                Currently accepting new clients
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-slate-300 uppercase text-xs tracking-widest">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-slate-400 hover:text-white text-sm transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-slate-300 uppercase text-xs tracking-widest">
              Contact
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={phoneHref}
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  {email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" />
                {location}
              </li>
            </ul>

            <div className="mt-2">
              <p className="text-slate-500 text-xs uppercase tracking-wide mb-2 font-medium">
                Service Areas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} {settings?.businessName ?? 'Clean House'}. All rights reserved.
          </p>
          <p className="text-slate-600 text-sm">Made with ❤️ in Calgary</p>
        </div>
      </div>
    </footer>
  );
}
