import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTenantRequests, getRentalRequestById, createRentalRequest } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";

export function useTenantRentals(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["tenant-rentals"],
    queryFn: getTenantRequests,
    enabled: options?.enabled ?? true,
  });
}

export function useRentalRequest(id: string) {
  return useQuery({
    queryKey: ["tenant-rentals", id],
    queryFn: () => getRentalRequestById(id),
    enabled: !!id,
  });
}

export function useCreateRentalRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRentalRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
      toast.success("Rental request submitted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
