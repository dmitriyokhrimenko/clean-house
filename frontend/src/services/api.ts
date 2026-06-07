import type { Booking, BookingsResponse, LoginResponse, BookingFormData, AppSettings, BookingStats, GalleryImage } from '../types';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001'}/api`;

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem('admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { message?: string };
    const err = new Error(body.message ?? res.statusText) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function get<T>(path: string): Promise<T> {
  return request<T>(path, { headers: authHeaders() });
}

function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
}

function patch<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body),
  });
}

function del<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'DELETE', headers: authHeaders() });
}

export const authApi = {
  login: (email: string, password: string) =>
    post<LoginResponse>('/auth/login', { email, password }),
  me: () =>
    get<{ id: string; email: string; name: string }>('/auth/me'),
};

export const bookingsApi = {
  create: (data: BookingFormData) =>
    post<Booking>('/bookings', data),
  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    const query = qs.toString() ? `?${qs.toString()}` : '';
    return get<BookingsResponse>(`/bookings${query}`);
  },
  getOne: (id: string) =>
    get<Booking>(`/bookings/${id}`),
  update: (id: string, data: { status?: string; adminNotes?: string }) =>
    patch<Booking>(`/bookings/${id}`, data),
  delete: (id: string) =>
    del<void>(`/bookings/${id}`),
};

export const uploadApi = {
  uploadFiles: async (files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));
    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: authHeaders(),
      body: form,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as { message?: string };
      throw new Error(body.message ?? 'Upload failed');
    }
    const data = await res.json() as { urls: string[] };
    return data.urls;
  },
};

export const settingsApi = {
  get: () => get<AppSettings>('/settings'),
  update: (data: Partial<Omit<AppSettings, 'id' | 'updatedAt'>>) =>
    patch<AppSettings>('/settings', data),
};

export const statsApi = {
  get: () => get<BookingStats>('/bookings/stats'),
};

export const galleryApi = {
  getAll: () => get<GalleryImage[]>('/gallery'),
  create: (data: { url: string; caption?: string }) =>
    post<GalleryImage>('/gallery', data),
  update: (id: string, data: { caption?: string | null; sortOrder?: number }) =>
    patch<GalleryImage>(`/gallery/${id}`, data),
  delete: (id: string) => del<void>(`/gallery/${id}`),
};
