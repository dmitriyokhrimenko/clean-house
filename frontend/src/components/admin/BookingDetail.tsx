import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Booking, BookingStatus } from '../../types';

interface Props {
  booking: Booking;
  onClose: () => void;
  onUpdate: (id: string, data: { status?: string; adminNotes?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const statusOptions: { value: BookingStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function Field({ label, value }: { label: string; value: string | number | boolean | null | undefined }) {
  if (value === null || value === undefined || value === '') return null;
  const display =
    typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="py-2 border-b border-slate-100 last:border-0">
      <dt className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-0.5">
        {label}
      </dt>
      <dd className="text-slate-900 text-sm font-medium">{display}</dd>
    </div>
  );
}

export default function BookingDetail({ booking, onClose, onUpdate, onDelete }: Props) {
  const [status, setStatus] = useState<BookingStatus>(booking.status);
  const [adminNotes, setAdminNotes] = useState(booking.adminNotes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (newStatus: BookingStatus) => {
    setStatus(newStatus);
    setUpdatingStatus(true);
    try {
      await onUpdate(booking.id, { status: newStatus });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await onUpdate(booking.id, { adminNotes });
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await onDelete(booking.id);
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  const statusColors: Record<BookingStatus, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    try {
      return new Date(dateStr).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{booking.name}</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Received {formatDateTime(booking.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[booking.status]}`}
            >
              {booking.status}
            </span>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Contact Information
            </h3>
            <dl className="grid sm:grid-cols-2 gap-x-6">
              <Field label="Name" value={booking.name} />
              <Field label="Phone" value={booking.phone} />
              <Field label="Email" value={booking.email} />
              <Field label="Calgary Area" value={booking.calgaryArea} />
            </dl>
          </div>

          {/* Property details */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Property Details
            </h3>
            <dl className="grid sm:grid-cols-2 gap-x-6">
              <Field label="Property Type" value={booking.propertyType} />
              <Field label="Cleaning Type" value={booking.cleaningType} />
              <Field label="Bedrooms" value={booking.bedrooms} />
              <Field label="Bathrooms" value={booking.bathrooms} />
              <Field label="Square Footage" value={booking.squareFootage} />
              <Field label="Preferred Date" value={formatDate(booking.preferredDate)} />
              <Field label="Has Pets" value={booking.hasPets} />
            </dl>
          </div>

          {/* Extra services */}
          {booking.extraServices && booking.extraServices.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Extra Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {booking.extraServices.map((s) => (
                  <span
                    key={s}
                    className="bg-sky-100 text-sky-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          {booking.message && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
                Message
              </h3>
              <p className="text-slate-700 text-sm bg-slate-50 rounded-xl p-4 leading-relaxed">
                {booking.message}
              </p>
            </div>
          )}

          {/* Photos */}
          {booking.photos && booking.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Photos ({booking.photos.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {booking.photos.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 hover:opacity-80 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Status update */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Update Status
            </h3>
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
                disabled={updatingStatus}
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white disabled:opacity-60"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {updatingStatus && (
                <span className="text-xs text-slate-400 italic">Saving...</span>
              )}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Admin Notes
            </h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              placeholder="Add internal notes about this booking..."
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          {/* Delete */}
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
