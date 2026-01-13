import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useCases(filters?: { upcoming?: boolean; relevantOnly?: boolean }) {
  return useQuery({
    queryKey: [api.cases.list.path, filters],
    queryFn: async () => {
      const url = buildUrl(api.cases.list.path);
      const params = new URLSearchParams();
      if (filters?.upcoming) params.append("upcoming", "true");
      if (filters?.relevantOnly) params.append("relevantOnly", "true");
      
      const res = await fetch(`${url}?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cases");
      return api.cases.list.responses[200].parse(await res.json());
    },
  });
}

export function useCase(id: number) {
  return useQuery({
    queryKey: [api.cases.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.cases.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch case");
      return api.cases.get.responses[200].parse(await res.json());
    },
  });
}

export function useAnalyzeCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cases.analyze.path, { id });
      const res = await fetch(url, { 
        method: api.cases.analyze.method,
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Analysis failed");
      return api.cases.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.cases.get.path, data.id] });
      queryClient.invalidateQueries({ queryKey: [api.cases.list.path] });
    }
  });
}
