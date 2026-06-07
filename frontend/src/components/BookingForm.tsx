import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { uploadApi, bookingsApi } from '../services/api';
import type { PropertyType, CleaningType } from '../types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email('Valid email required'),
  propertyType: z.enum(['house', 'condo', 'apartment', 'office']),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFootage: z.string().optional(),
  cleaningType: z.enum(['regular', 'deep', 'move-in-out']),
  preferredDate: z.string().optional(),
  calgaryArea: z.string().optional(),
  extraServices: z.array(z.string()).optional(),
  hasPets: z.boolean().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const extraServiceOptions = [
  'Inside Oven',
  'Inside Fridge',
  'Inside Cabinets',
  'Windows',
  'Laundry',
  'Dishes',
];

const calgaryAreas = [
  'NW Calgary',
  'NE Calgary',
  'SW Calgary',
  'SE Calgary',
  'Downtown/Beltline',
  'Other',
];

const inputClass =
  'w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';
const errorClass = 'text-red-500 text-sm mt-1';

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      propertyType: 'house',
      cleaningType: 'regular',
      hasPets: false,
      extraServices: [],
    },
  });

  const watchedName = watch('name');

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = 5 - photos.length;
    const toAdd = files.slice(0, remaining);
    if (toAdd.length === 0) return;

    const newUrls = toAdd.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...toAdd]);
    setPhotoPreviewUrls((prev) => [...prev, ...newUrls]);
    // Reset the input so the same file can be re-added after removal
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setError(null);

    try {
      let photoUrls: string[] = [];
      if (photos.length > 0) {
        photoUrls = await uploadApi.uploadFiles(photos);
      }

      await bookingsApi.create({
        name: data.name,
        phone: data.phone,
        email: data.email,
        propertyType: data.propertyType as PropertyType,
        cleaningType: data.cleaningType as CleaningType,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : undefined,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : undefined,
        squareFootage: data.squareFootage || undefined,
        preferredDate: data.preferredDate || undefined,
        calgaryArea: data.calgaryArea || undefined,
        extraServices: data.extraServices ?? [],
        hasPets: data.hasPets ?? false,
        message: data.message || undefined,
        photos: photoUrls,
      });

      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="booking" className="bg-[#F0F9FF] py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center border border-emerald-100">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              Thank you, {watchedName}!
            </h2>
            <p className="text-slate-600 text-lg mb-6">
              We'll contact you within 24 hours with your custom quote.
            </p>
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 rounded-xl px-6 py-3 font-semibold border border-primary-200">
              📞{' '}
              <a href="tel:+15871234567" className="hover:underline">
                (587) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="bg-[#F0F9FF] py-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-sky-100 text-sky-700 rounded-full px-4 py-1 text-sm font-medium mb-4">
            Get a Quote
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Request a Free Estimate
          </h2>
          <p className="text-slate-600">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
            {/* Row 1: Name + Phone */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jane Smith"
                  className={inputClass}
                  {...register('name')}
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(587) 123-4567"
                  className={inputClass}
                  {...register('phone')}
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
            </div>

            {/* Row 2: Email */}
            <div>
              <label className={labelClass} htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane@example.com"
                className={inputClass}
                {...register('email')}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            {/* Row 3: Property Type */}
            <div>
              <label className={labelClass} htmlFor="propertyType">
                Property Type <span className="text-red-500">*</span>
              </label>
              <select id="propertyType" className={inputClass} {...register('propertyType')}>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
                <option value="office">Small Office</option>
              </select>
              {errors.propertyType && (
                <p className={errorClass}>{errors.propertyType.message}</p>
              )}
            </div>

            {/* Row 4: Bedrooms + Bathrooms */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="bedrooms">
                  Bedrooms
                </label>
                <select id="bedrooms" className={inputClass} {...register('bedrooms')}>
                  <option value="">Select bedrooms</option>
                  <option value="0">Studio</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="5">5+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="bathrooms">
                  Bathrooms
                </label>
                <select id="bathrooms" className={inputClass} {...register('bathrooms')}>
                  <option value="">Select bathrooms</option>
                  <option value="1">1 Bathroom</option>
                  <option value="1.5">1.5 Bathrooms</option>
                  <option value="2">2 Bathrooms</option>
                  <option value="2.5">2.5 Bathrooms</option>
                  <option value="3">3+ Bathrooms</option>
                </select>
              </div>
            </div>

            {/* Row 5: Square Footage + Cleaning Type */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="squareFootage">
                  Square Footage
                </label>
                <select id="squareFootage" className={inputClass} {...register('squareFootage')}>
                  <option value="">Select size</option>
                  <option value="Under 500 sqft">Under 500 sqft</option>
                  <option value="500–800 sqft">500–800 sqft</option>
                  <option value="800–1200 sqft">800–1200 sqft</option>
                  <option value="1200–1800 sqft">1200–1800 sqft</option>
                  <option value="1800–2500 sqft">1800–2500 sqft</option>
                  <option value="2500+ sqft">2500+ sqft</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="cleaningType">
                  Cleaning Type <span className="text-red-500">*</span>
                </label>
                <select id="cleaningType" className={inputClass} {...register('cleaningType')}>
                  <option value="regular">Regular Cleaning</option>
                  <option value="deep">Deep Cleaning</option>
                  <option value="move-in-out">Move-In / Move-Out</option>
                </select>
                {errors.cleaningType && (
                  <p className={errorClass}>{errors.cleaningType.message}</p>
                )}
              </div>
            </div>

            {/* Row 6: Preferred Date + Calgary Area */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="preferredDate">
                  Preferred Date
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  min={today}
                  className={inputClass}
                  {...register('preferredDate')}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="calgaryArea">
                  Calgary Area
                </label>
                <select id="calgaryArea" className={inputClass} {...register('calgaryArea')}>
                  <option value="">Select area</option>
                  {calgaryAreas.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 7: Extra Services */}
            <div>
              <label className={labelClass}>Extra Services</label>
              <Controller
                name="extraServices"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
                    {extraServiceOptions.map((service) => {
                      const checked = (field.value ?? []).includes(service);
                      return (
                        <label
                          key={service}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const current = field.value ?? [];
                              if (e.target.checked) {
                                field.onChange([...current, service]);
                              } else {
                                field.onChange(current.filter((s) => s !== service));
                              }
                            }}
                            className="w-4 h-4 accent-primary-600 rounded"
                          />
                          <span className="text-sm text-slate-700 group-hover:text-slate-900">
                            {service}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Row 8: Pets */}
            <div>
              <label className={labelClass}>Do you have pets?</label>
              <Controller
                name="hasPets"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-6 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-sm text-slate-700">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        className="w-4 h-4 accent-primary-600"
                      />
                      <span className="text-sm text-slate-700">Yes</span>
                    </label>
                  </div>
                )}
              />
            </div>

            {/* Row 9: Message */}
            <div>
              <label className={labelClass} htmlFor="message">
                Additional Notes (optional)
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="Any special requests, access instructions, or questions..."
                className={`${inputClass} resize-none`}
                {...register('message')}
              />
            </div>

            {/* Row 10: Photo upload */}
            <div>
              <label className={labelClass}>
                Photos (optional, up to 5)
              </label>
              {photos.length < 5 && (
                <label className="mt-1 flex items-center justify-center w-full h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
                  <span className="text-slate-500 text-sm text-center">
                    📷 Click to upload photos<br />
                    <span className="text-xs text-slate-400">JPG, PNG, HEIC accepted</span>
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              )}

              {photoPreviewUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-3">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative w-16 h-16 flex-shrink-0">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                        aria-label="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length >= 5 && (
                <p className="text-slate-500 text-xs mt-2">Maximum of 5 photos reached.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Submitting...
                </>
              ) : (
                'Request Free Estimate →'
              )}
            </button>

            <p className="text-center text-slate-400 text-xs">
              By submitting, you agree to be contacted regarding your cleaning request.
              No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
