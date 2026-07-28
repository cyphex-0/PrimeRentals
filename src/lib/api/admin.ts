import { apiGet, apiPut, apiDelete, apiPatch, apiPost } from "./client";
import { User, Property, RentalRequest, Category } from "../types";

export const getAllUsers = () => apiGet<User[]>("/admin/users");
export const updateUserStatus = (id: string, data: unknown) => apiPatch<User>(`/admin/users/${id}`, data);
export const getAllProperties = () => apiGet<Property[]>("/admin/properties");
export const adminUpdateProperty = (id: string, data: unknown) => apiPut<Property>(`/admin/properties/${id}`, data);
export const adminDeleteProperty = (id: string) => apiDelete<Property>(`/admin/properties/${id}`);
export const getAllRentals = () => apiGet<RentalRequest[]>("/admin/rentals");
export const createCategory = (data: unknown) => apiPost<Category>("/admin/categories", data);
export const updateCategory = (id: string, data: unknown) => apiPut<Category>(`/admin/categories/${id}`, data);
export const deleteCategory = (id: string) => apiDelete<Category>(`/admin/categories/${id}`);
