import { type Case, type Judge } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MapPin, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { useMarkAttendance, useMyAttendance } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";

interface CaseCardProps {
  caseItem: Case & { judge: Judge };
  compact?: boolean;
}

export function CaseCard({ caseItem, compact = false }: CaseCardProps) {
  const { user } = useAuth();
  const { data: attendance } = useMyAttendance();
  const { mutate: markAttendance, isPending } = useMarkAttendance();
  
  const isAttending = attendance?.some(a => a.caseId === caseItem.id);
  const isPolitical = caseItem.isPoliticallyRelevant;

  return (
    <Card className={`
      relative overflow-hidden border-2 transition-all duration-300
      ${isPolitical ? 'border-l-8 border-l-destructive border-t-muted border-r-muted border-b-muted' : 'border-muted hover:border-primary/50'}
      hover:shadow-md
    `}>
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-full">
          {/* Date Column */}
          <div className="bg-muted/30 p-4 md:w-32 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border">
            <span className="text-3xl font-display font-bold text-foreground">
              {format(new Date(caseItem.date), "dd")}
            </span>
            <span className="text-sm font-mono uppercase text-muted-foreground">
              {format(new Date(caseItem.date), "MMM yyyy")}
            </span>
            <span className="mt-2 text-xs font-mono text-muted-foreground">
              {format(new Date(caseItem.date), "h:mm a")}
            </span>
          </div>

          {/* Content Column */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <Link href={`/cases/${caseItem.id}`}>
                  <h3 className="text-lg font-bold font-display uppercase hover:text-primary transition-colors cursor-pointer">
                    {caseItem.title}
                  </h3>
                </Link>
                {isPolitical && (
                  <Badge variant="destructive" className="rounded-none uppercase tracking-wider font-bold animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Critical
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                <span>{caseItem.location}</span>
                <span className="text-border mx-1">|</span>
                <span>Judge {caseItem.judge.name}</span>
              </div>

              {!compact && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {caseItem.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
              <Link href={`/cases/${caseItem.id}`} className="text-sm font-bold text-primary hover:underline">
                View Details
              </Link>
              
              {user && (
                <Button 
                  size="sm" 
                  variant={isAttending ? "outline" : "default"}
                  className={isAttending ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : ""}
                  onClick={() => !isAttending && markAttendance({ 
                    userId: user.id, 
                    caseId: caseItem.id, 
                    status: "planned" 
                  })}
                  disabled={isAttending || isPending}
                >
                  {isAttending ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Watching
                    </>
                  ) : (
                    "Attend Hearing"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
