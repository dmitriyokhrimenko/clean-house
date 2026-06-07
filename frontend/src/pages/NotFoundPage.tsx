import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <Link to="/" className="flex items-center gap-2 text-primary-600 font-bold text-xl mb-10 hover:opacity-80 transition-opacity">
        <Sparkles className="w-5 h-5" />
        Clean House
      </Link>

      <p className="text-8xl font-extrabold text-primary-100 select-none leading-none mb-2">404</p>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/booking"
          className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-2.5 rounded-xl font-semibold transition-colors"
        >
          Request Estimate
        </Link>
      </div>
    </div>
  );
}
