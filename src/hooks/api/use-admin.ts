import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  adminUpdateProperty,
  adminDeleteProperty,
  getAllRentals,
  createCategory,
  updateCategory,
  deleteCategory
} from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";

export function useAllUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useAdminProperties() {
  return useQuery({
    queryKey: ["admin-properties"],
    queryFn: getAllProperties,
  });
}

export function useAdminUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => adminUpdateProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useAdminDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminDeleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted successfully!");
    },
    onError: (error: ApiError) => {
      const msg = error.message?.toLowerCase() || "";
      if (msg.includes("foreign key") || msg.includes("rentalrequest") || msg.includes("referenced from")) {
        toast.error("Cannot delete this property because it has rental history. The backend does not support deleting properties with associated rental records.");
      } else if (msg.includes("active or pending")) {
        toast.error("Cannot delete a property with active or pending rental requests.");
      } else {
        toast.error(error.message || "Failed to delete property.");
      }
    },
  });
}

export function useAllRentals() {
  return useQuery({
    queryKey: ["admin-rentals"],
    queryFn: getAllRentals,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
