import { apiPost, apiGet, apiPut, apiDelete, apiPatch } from "./client";
import { Property, RentalRequest } from "../types";

export const createProperty = (data: unknown) => apiPost<Property>("/landlord/properties", data);
export const updateProperty = (id: string, data: unknown) => apiPut<Property>(`/landlord/properties/${id}`, data);
export const deleteProperty = (id: string) => apiDelete<Property>(`/landlord/properties/${id}`);
export const getLandlordProperties = () => apiGet<Property[]>("/landlord/properties");
export const getLandlordRequests = () => apiGet<RentalRequest[]>("/landlord/requests");
export const updateRequestStatus = (id: string, data: unknown) => apiPatch<RentalRequest>(`/landlord/requests/${id}`, data);
export const completeRental = (id: string) => apiPatch<RentalRequest>(`/landlord/requests/${id}/complete`);
