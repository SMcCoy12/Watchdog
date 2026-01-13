import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useLeaderboard() {
  return useQuery({
    queryKey: [api.users.leaderboard.path],
    queryFn: async () => {
      const res = await fetch(api.users.leaderboard.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return api.users.leaderboard.responses[200].parse(await res.json());
    },
  });
}
