import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

export function useJudges(search?: string) {
  return useQuery({
    queryKey: [api.judges.list.path, search],
    queryFn: async () => {
      const url = buildUrl(api.judges.list.path);
      const res = await fetch(search ? `${url}?search=${search}` : url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch judges");
      return api.judges.list.responses[200].parse(await res.json());
    },
  });
}

export function useJudge(id: number) {
  return useQuery({
    queryKey: [api.judges.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.judges.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch judge");
      return api.judges.get.responses[200].parse(await res.json());
    },
  });
}
