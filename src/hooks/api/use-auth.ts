import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMe, updateProfile } from "@/lib/api";
import { ApiError } from "@/lib/types";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  const setAuth = useAuthStore((state) => state.setAuth);
  const token = useAuthStore((state) => state.token);
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      // Update the user in the auth store so UI reflects changes instantly
      if (res.data && token) {
        setAuth(res.data, token);
      }
      toast.success("Profile updated successfully!");
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
