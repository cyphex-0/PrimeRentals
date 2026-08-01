import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentHistory, getPaymentById, createPaymentIntent, confirmPayment } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error";

export function usePaymentHistory() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getPaymentHistory,
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ["payments", id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: createPaymentIntent,
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast.success("Payment confirmed successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}
