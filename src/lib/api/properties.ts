import { apiGet } from "./client";
import { Property } from "../types";

export const getProperties = (params?: Record<string, string | number>) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return apiGet<Property[]>(query ? `/properties?${query}` : "/properties");
};
export const getPropertyById = (id: string) => apiGet<Property>(`/properties/${id}`);
