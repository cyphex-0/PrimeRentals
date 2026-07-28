import { useQuery } from "@tanstack/react-query";
import { getProperties, getPropertyById } from "@/lib/api";

export function useProperties(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => getProperties(filters),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ["properties", id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
  });
}
