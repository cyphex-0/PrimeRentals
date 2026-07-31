import { ApiResponse, Property, Category } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getServerProperties(searchParams: URLSearchParams | string = ""): Promise<ApiResponse<Property[]>> {
  const query = typeof searchParams === 'string' ? searchParams : searchParams.toString();
  const url = query ? `${API_BASE}/properties?${query}` : `${API_BASE}/properties`;
  
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { success: false, statusCode: res.status, message: "Failed to fetch properties", data: null };
    return await res.json();
  } catch (error) {
    return { success: false, statusCode: 500, message: "Network error", data: null };
  }
}

export async function getServerPropertyById(id: string): Promise<ApiResponse<Property>> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, { cache: "no-store" });
    if (!res.ok) return { success: false, statusCode: res.status, message: "Property not found", data: null };
    return await res.json();
  } catch (error) {
    return { success: false, statusCode: 500, message: "Network error", data: null };
  }
}

export async function getServerCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const res = await fetch(`${API_BASE}/categories`, { cache: "no-store" });
    if (!res.ok) return { success: false, statusCode: res.status, message: "Failed to fetch categories", data: null };
    return await res.json();
  } catch (error) {
    return { success: false, statusCode: 500, message: "Network error", data: null };
  }
}
