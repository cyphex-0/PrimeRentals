import { useQuery } from "@tanstack/react-query";
import { getAdminStats, getLandlordStats } from "@/lib/api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await getAdminStats();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch admin stats");
      }
      return response;
    },
  });
}

export function useLandlordStats() {
  return useQuery({
    queryKey: ["landlord-stats"],
    queryFn: async () => {
      const response = await getLandlordStats();
      if (!response.success) {
        throw new Error(response.message || "Failed to fetch landlord stats");
      }
      return response;
    },
  });
}
