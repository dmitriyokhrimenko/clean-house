import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, TrendingUp, Clock, CheckCircle, Users, Eye } from 'lucide-react';
import { statsApi, analyticsApi } from '../../services/api';
import type { BookingStats, BookingStatus, VisitorStats } from '../../types';

const statusColors: Record<BookingStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [visitors, setVisitors] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([statsApi.get(), analyticsApi.getStats()])
      .then(([s, v]) => { setStats(s); setVisitors(v); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Bookings', value: stats?.total ?? 0, icon: CalendarCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'This Week', value: stats?.thisWeek ?? 0, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'This Month', value: stats?.thisMonth ?? 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New (Unread)', value: stats?.byStatus?.find(s => s.status === 'new')?.count ?? '0', icon: CheckCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your booking activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Visitor stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Unique Visitors', value: visitors?.total ?? 0, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Today', value: visitors?.today ?? 0, icon: Eye, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'This Week', value: visitors?.thisWeek ?? 0, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'This Month', value: visitors?.thisMonth ?? 0, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-sm text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Top pages */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-3">
          <h2 className="font-semibold text-slate-900 mb-4">Top Pages</h2>
          {!visitors?.topPages?.length ? (
            <p className="text-slate-400 text-sm">No visits recorded yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {visitors.topPages.map(({ path, count }) => {
                const max = parseInt(visitors.topPages[0].count);
                const pct = Math.round((parseInt(count) / max) * 100);
                return (
                  <div key={path} className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-500 w-32 truncate">{path}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="bg-violet-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-900 mb-4">Bookings by Status</h2>
          <div className="flex flex-col gap-2">
            {['new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((status) => {
              const count = parseInt(stats?.byStatus?.find(s => s.status === status)?.count ?? '0');
              const total = stats?.total || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium w-24 text-center ${statusColors[status as BookingStatus]}`}>
                    {status}
                  </span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm text-slate-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-xs text-primary-600 hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {stats?.recent?.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-6">No bookings yet</p>
            )}
            {stats?.recent?.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-900">{b.name}</div>
                  <div className="text-xs text-slate-400">{b.cleaningType} · {b.propertyType}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
