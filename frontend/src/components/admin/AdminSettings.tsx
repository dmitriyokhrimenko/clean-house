import { useState, useEffect } from 'react';
import { Phone, Mail, Building2, MapPin, DollarSign, Link, MessageSquare, Save } from 'lucide-react';
import { settingsApi } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import type { AppSettings } from '../../types';

type FormState = Omit<AppSettings, 'id' | 'updatedAt'>;

const inputClass = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

export default function AdminSettings() {
  const { reload: reloadGlobal } = useSettings();
  const [form, setForm] = useState<FormState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    settingsApi.get()
      .then((s) => {
        const { id: _id, updatedAt: _u, ...rest } = s;
        setForm(rest);
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => f ? { ...f, [key]: value } : f);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await settingsApi.update(form);
      reloadGlobal();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const sections = [
    {
      title: 'Contact Information',
      desc: 'Shown on the website and used for customer communication.',
      fields: [
        { key: 'phone' as const, label: 'Phone Number', icon: Phone, placeholder: '(587) 123-4567', type: 'tel', priority: true },
        { key: 'email' as const, label: 'Contact Email', icon: Mail, placeholder: 'info@cleanhouse.ca', type: 'email', priority: false },
      ],
    },
    {
      title: 'Business Details',
      desc: 'General information about your business.',
      fields: [
        { key: 'businessName' as const, label: 'Business Name', icon: Building2, placeholder: 'Clean House', type: 'text', priority: false },
        { key: 'location' as const, label: 'Location', icon: MapPin, placeholder: 'Calgary, Alberta', type: 'text', priority: false },
        { key: 'startingPrice' as const, label: 'Starting Price Text', icon: DollarSign, placeholder: 'From $40/hr', type: 'text', priority: false },
      ],
    },
    {
      title: 'Social & Web',
      desc: 'Optional links shown in the footer.',
      fields: [
        { key: 'facebookUrl' as const, label: 'Facebook Page URL', icon: Link, placeholder: 'https://facebook.com/...', type: 'url', priority: false },
        { key: 'googleBusinessUrl' as const, label: 'Google Business URL', icon: Link, placeholder: 'https://g.page/...', type: 'url', priority: false },
      ],
    },
    {
      title: 'Booking Messages',
      desc: 'Text shown to customers after they submit the form.',
      fields: [
        { key: 'bookingConfirmationMessage' as const, label: 'Booking Confirmation Message', icon: MessageSquare, placeholder: '', type: 'textarea', priority: false },
      ],
    },
  ];

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your business information and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {saved && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
          ✓ Settings saved successfully
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h2 className="font-semibold text-slate-900 mb-1">{section.title}</h2>
            <p className="text-slate-500 text-sm mb-5">{section.desc}</p>
            <div className="flex flex-col gap-4">
              {section.fields.map(({ key, label, icon: Icon, placeholder, type, priority }) => (
                <div key={key}>
                  <label className={labelClass}>
                    {label}
                    {priority && <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Primary</span>}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" style={type === 'textarea' ? { top: '14px', transform: 'none' } : {}} />
                    {type === 'textarea' ? (
                      <textarea
                        value={form[key] ?? ''}
                        onChange={(e) => set(key, e.target.value)}
                        rows={3}
                        className={`${inputClass} pl-9 resize-none`}
                        placeholder={placeholder}
                      />
                    ) : (
                      <input
                        type={type}
                        value={form[key] ?? ''}
                        onChange={(e) => set(key, e.target.value)}
                        className={`${inputClass} pl-9`}
                        placeholder={placeholder}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
