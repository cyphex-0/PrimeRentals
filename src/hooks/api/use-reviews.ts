import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["properties", variables.propertyId] });
      toast.success("Review posted successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
