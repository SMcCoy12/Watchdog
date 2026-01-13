import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

type InsertAttendance = z.infer<typeof api.attendance.mark.input>;

export function useMyAttendance() {
  return useQuery({
    queryKey: [api.attendance.list.path],
    queryFn: async () => {
      const res = await fetch(api.attendance.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      return api.attendance.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAttendance) => {
      const res = await fetch(api.attendance.mark.path, {
        method: api.attendance.mark.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to mark attendance");
      return api.attendance.mark.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.attendance.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.users.leaderboard.path] });
    },
  });
}
