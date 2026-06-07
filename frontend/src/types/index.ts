export type PropertyType = 'house' | 'condo' | 'apartment' | 'office';
export type CleaningType = 'regular' | 'deep' | 'move-in-out';
export type BookingStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyType;
  bedrooms: number | null;
  bathrooms: number | null;
  squareFootage: string | null;
  cleaningType: CleaningType;
  preferredDate: string | null;
  calgaryArea: string | null;
  extraServices: string[] | null;
  hasPets: boolean;
  message: string | null;
  photos: string[] | null;
  status: BookingStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingsResponse {
  data: Booking[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  propertyType: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: string;
  cleaningType: CleaningType;
  preferredDate?: string;
  calgaryArea?: string;
  extraServices?: string[];
  hasPets?: boolean;
  message?: string;
  photos?: string[];
}

export interface AppSettings {
  id: number;
  phone: string;
  email: string;
  businessName: string;
  location: string;
  startingPrice: string;
  facebookUrl: string | null;
  googleBusinessUrl: string | null;
  bookingConfirmationMessage: string;
  updatedAt: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
  showOnHome: boolean;
  createdAt: string;
}

export interface VisitorStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  topPages: { path: string; count: string }[];
  recentVisits: { id: string; path: string; referrer: string | null; createdAt: string }[];
}

export interface BookingStats {
  total: number;
  byStatus: { status: string; count: string }[];
  thisWeek: number;
  thisMonth: number;
  recent: Booking[];
}
