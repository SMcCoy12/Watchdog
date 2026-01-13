import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, User } from "lucide-react";

export default function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-display font-bold uppercase tracking-tight mb-4">
          Top Observers
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Honoring those who show up. Points are awarded for attendance, accurate reporting, and community verification.
        </p>
      </div>

      {isLoading ? (
        <div className="max-w-3xl mx-auto space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-background border-2 border-primary shadow-xl overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-primary text-primary-foreground font-display font-bold uppercase text-lg border-b border-primary-foreground/20">
              <div className="col-span-2 text-center">Rank</div>
              <div className="col-span-7">Citizen</div>
              <div className="col-span-3 text-right">Points</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {leaderboard?.map((entry, index) => {
                const isTop3 = index < 3;
                return (
                  <div key={entry.userId} className={`grid grid-cols-12 gap-4 p-4 items-center ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'} hover:bg-primary/5 transition-colors`}>
                    <div className="col-span-2 flex justify-center">
                      {index === 0 && <Trophy className="w-6 h-6 text-yellow-500" />}
                      {index === 1 && <Medal className="w-6 h-6 text-gray-400" />}
                      {index === 2 && <Medal className="w-6 h-6 text-amber-700" />}
                      {!isTop3 && <span className="font-mono font-bold text-muted-foreground">#{index + 1}</span>}
                    </div>
                    
                    <div className="col-span-7 flex items-center gap-4">
                      <Avatar className="w-10 h-10 border-2 border-border">
                        <AvatarImage src={entry.avatarUrl || undefined} />
                        <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                          {entry.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`font-bold ${isTop3 ? 'text-lg' : ''}`}>
                        {entry.name}
                      </span>
                    </div>
                    
                    <div className="col-span-3 text-right font-mono font-bold text-lg">
                      {entry.points.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {leaderboard?.length === 0 && (
              <div className="p-12 text-center text-muted-foreground">
                No active observers yet. Be the first.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
