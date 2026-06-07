import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { bookingsApi } from '../../services/api';
import BookingDetail from './BookingDetail';
import type { Booking, BookingStatus } from '../../types';

interface Props {
  onLogout: () => void;
}

const LIMIT = 10;

const statusColors: Record<BookingStatus, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-red-100 text-red-700',
};

const cleaningTypeLabel: Record<string, string> = {
  regular: 'Regular',
  deep: 'Deep',
  'move-in-out': 'Move-In/Out',
};

const propertyTypeLabel: Record<string, string> = {
  house: 'House',
  condo: 'Condo',
  apartment: 'Apartment',
  office: 'Office',
};

export default function BookingsList({ onLogout }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingsApi.getAll({
        status: statusFilter || undefined,
        page,
        limit: LIMIT,
      });
      setBookings(result.data);
      setTotal(result.total);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        onLogout();
      } else {
        setError('Failed to load bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, onLogout]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  // Reset page when filter changes
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleUpdate = async (id: string, data: { status?: string; adminNotes?: string }) => {
    await bookingsApi.update(id, data);
    // Refresh list and update selected booking
    const updated = await bookingsApi.getOne(id);
    setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    setSelectedBooking((prev) => (prev?.id === id ? updated : prev));
  };

  const handleDelete = async (id: string) => {
    await bookingsApi.delete(id);
    setBookings((prev) => prev.filter((b) => b.id !== id));
    setTotal((prev) => prev - 1);
    setSelectedBooking(null);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page title + filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Bookings</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {total} total booking{total !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => void fetchBookings()}
              disabled={loading}
              className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Cleaning Type
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Property
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Preferred Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Received
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-slate-300" />
                        <span>Loading bookings...</span>
                      </div>
                    </td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-slate-400">
                      No bookings found
                      {statusFilter ? ` with status "${statusFilter}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking, index) => (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                        {(page - 1) * LIMIT + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{booking.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[140px]">
                          {booking.email}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                        {booking.phone}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {cleaningTypeLabel[booking.cleaningType] ?? booking.cleaningType}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {propertyTypeLabel[booking.propertyType] ?? booking.propertyType}
                        {booking.bedrooms != null && (
                          <span className="text-slate-400 ml-1 text-xs">
                            {booking.bedrooms}br
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {formatDate(booking.preferredDate)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusColors[booking.status]
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedBooking(booking)}
                          className="flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="px-4 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
                <span className="ml-2 text-slate-400">
                  ({total} total)
                </span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                  className="flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
