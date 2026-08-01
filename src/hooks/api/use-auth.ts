import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateProfile } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";
import { sanitizeErrorMessage } from "@/lib/utils/sanitize-error";

export function useMe() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    enabled: !!token,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(sanitizeErrorMessage(error));
    },
  });
}
