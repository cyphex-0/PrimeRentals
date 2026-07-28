import { apiPost, apiGet } from "./client";
import { RentalRequest } from "../types";

export const createRentalRequest = (data: unknown) => apiPost<RentalRequest>("/rentals", data);
export const getTenantRequests = () => apiGet<RentalRequest[]>("/rentals");
export const getRentalRequestById = (id: string) => apiGet<RentalRequest>(`/rentals/${id}`);
