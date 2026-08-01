import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLandlordProperties,
  getLandlordRequests,
  createProperty,
  updateProperty,
  deleteProperty,
  updateRequestStatus,
  completeRental
} from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error";

export function useLandlordProperties() {
  return useQuery({
    queryKey: ["landlord-properties"],
    queryFn: getLandlordProperties,
  });
}

export function useLandlordRequests() {
  return useQuery({
    queryKey: ["landlord-requests"],
    queryFn: getLandlordRequests,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property created successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateProperty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties", variables.id] });
      toast.success("Property updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Property deleted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => updateRequestStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
      toast.success("Request status updated!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}

export function useCompleteRental() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeRental,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["landlord-requests"] });
      toast.success("Rental marked as completed!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}
