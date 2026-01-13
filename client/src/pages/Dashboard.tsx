import { useAuth } from "@/hooks/use-auth";
import { useCases } from "@/hooks/use-cases";
import { useMyAttendance } from "@/hooks/use-attendance";
import { CaseCard } from "@/components/CaseCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Trophy, CalendarCheck } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: upcomingCases, isLoading: isLoadingCases } = useCases({ upcoming: true });
  const { data: attendance } = useMyAttendance();

  if (!user) return null;

  const totalPoints = attendance?.reduce((sum, item) => sum + (item.pointsAwarded || 0), 0) || 0;
  const attendedCount = attendance?.filter(a => a.status === 'verified').length || 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Welcome & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-secondary text-secondary-foreground p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-display font-bold uppercase mb-2">
              Welcome Back, {user.firstName}
            </h1>
            <p className="text-gray-400 max-w-md">
              Your civic engagement helps ensure fair trials for everyone.
            </p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-primary/10 transform skew-x-12 translate-x-10"></div>
        </div>

        <div className="bg-primary text-primary-foreground p-8 flex flex-col justify-center items-center text-center">
          <Trophy className="w-8 h-8 mb-2 opacity-80" />
          <div className="text-5xl font-display font-bold">{totalPoints}</div>
          <div className="text-sm font-mono uppercase tracking-widest opacity-80">Total Points</div>
        </div>
      </div>

      {/* Action Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Upcoming Critical Cases */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h2 className="text-2xl font-display font-bold uppercase flex items-center gap-2">
              <span className="w-3 h-3 bg-destructive rounded-full animate-pulse"></span>
              Critical Upcoming Cases
            </h2>
            <Link href="/calendar">
              <Button variant="ghost" size="sm" className="font-bold uppercase text-xs">View All</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {isLoadingCases ? (
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-muted"></div>
                <div className="h-32 bg-muted"></div>
              </div>
            ) : upcomingCases?.filter(c => c.isPoliticallyRelevant).slice(0, 3).map((caseItem) => (
              <CaseCard key={caseItem.id} caseItem={caseItem} compact />
            ))}
            {upcomingCases?.filter(c => c.isPoliticallyRelevant).length === 0 && (
              <p className="text-muted-foreground italic p-4 bg-muted/20">No critical cases upcoming.</p>
            )}
          </div>
        </div>

        {/* My Schedule */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h2 className="text-2xl font-display font-bold uppercase flex items-center gap-2">
              <CalendarCheck className="w-6 h-6" />
              Your Schedule
            </h2>
          </div>

          <div className="space-y-4">
            {attendance?.length === 0 ? (
              <div className="bg-muted/30 p-8 text-center border-2 border-dashed border-border">
                <p className="text-muted-foreground mb-4">You haven't committed to any hearings yet.</p>
                <Link href="/calendar">
                  <Button className="font-bold uppercase">Find a Case</Button>
                </Link>
              </div>
            ) : (
              attendance?.slice(0, 3).map((record) => (
                <div key={record.id} className="bg-background border border-border p-4 flex justify-between items-center hover:border-primary transition-colors">
                  <div>
                    <div className="font-bold">{record.case.title}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {record.status.toUpperCase()} • {new Date(record.case.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Link href={`/cases/${record.caseId}`}>
                    <Button size="icon" variant="ghost">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
