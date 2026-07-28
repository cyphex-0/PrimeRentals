import type { Review } from "./review";

export type PropertyStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyLandlord {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  rent: string; // Decimal serialized as string
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string[];
  images: string[];
  status: PropertyStatus;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  landlord?: PropertyLandlord;
  reviews?: Review[];
  _count?: { rentalRequests: number; reviews: number };
}
