import { useCase, useAnalyzeCase } from "@/hooks/use-cases";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BrainCircuit, MapPin, Calendar, Scale, Users } from "lucide-react";
import { useMarkAttendance, useMyAttendance } from "@/hooks/use-attendance";
import { useAuth } from "@/hooks/use-auth";

export default function CaseDetail() {
  const [, params] = useRoute("/cases/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: caseItem, isLoading } = useCase(id);
  const { mutate: analyze, isPending: isAnalyzing } = useAnalyzeCase();
  
  const { user } = useAuth();
  const { data: attendance } = useMyAttendance();
  const { mutate: markAttendance, isPending: isMarking } = useMarkAttendance();
  const isAttending = attendance?.some(a => a.caseId === id);

  if (isLoading) return <div className="h-screen bg-muted animate-pulse" />;
  if (!caseItem) return <div className="p-8 text-center font-bold">Case not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/calendar">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Calendar
        </Button>
      </Link>

      <div className="bg-background border-2 border-border shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-secondary text-secondary-foreground p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10">
            {caseItem.isPoliticallyRelevant && (
              <Badge variant="destructive" className="mb-4 rounded-none text-sm px-3 py-1 font-bold animate-pulse">
                POLITICALLY RELEVANT
              </Badge>
            )}
            <h1 className="text-3xl md:text-5xl font-display font-bold uppercase leading-tight mb-4">
              {caseItem.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm md:text-base font-mono opacity-80">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(caseItem.date).toLocaleDateString()} at {new Date(caseItem.date).toLocaleTimeString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {caseItem.location}
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-1/3"></div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-lg font-bold uppercase mb-2 text-muted-foreground">Description</h3>
              <p className="text-lg leading-relaxed">{caseItem.description}</p>
            </div>

            {/* AI Analysis Section */}
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-sm">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold uppercase">AI Risk Analysis</h3>
              </div>
              
              {caseItem.relevanceReason ? (
                <div className="prose max-w-none">
                  <p>{caseItem.relevanceReason}</p>
                  {caseItem.isUnexpected && (
                    <div className="mt-4 p-3 bg-destructive/10 border-l-4 border-destructive text-destructive font-bold">
                      ⚠ Outcome warning: Based on this judge's record, a ruling against precedent is likely.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No detailed analysis generated yet.</p>
                  {user && (
                    <Button 
                      onClick={() => analyze(caseItem.id)} 
                      disabled={isAnalyzing}
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      {isAnalyzing ? "Analyzing..." : "Generate AI Analysis"}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 border border-border bg-muted/30">
              <h3 className="text-sm font-bold uppercase text-muted-foreground mb-4">Presiding Judge</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-full overflow-hidden">
                  {caseItem.judge.imageUrl ? (
                    <img src={caseItem.judge.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <Scale className="w-6 h-6 opacity-50" />
                  )}
                </div>
                <div>
                  <Link href={`/judges/${caseItem.judge.id}`} className="font-bold text-lg hover:underline decoration-primary underline-offset-4">
                    {caseItem.judge.name}
                  </Link>
                  <div className="text-sm text-muted-foreground">{caseItem.judge.court}</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-secondary text-secondary-foreground">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5" />
                <h3 className="font-bold uppercase">Civic Duty</h3>
              </div>
              <p className="text-sm opacity-80 mb-6">
                Attending this hearing earns you <span className="font-bold text-primary">50 points</span> and ensures public oversight.
              </p>
              
              {user ? (
                <Button 
                  className={`w-full font-bold uppercase py-6 ${isAttending ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'}`}
                  onClick={() => !isAttending && markAttendance({ 
                    userId: user.id, 
                    caseId: caseItem.id, 
                    status: "planned" 
                  })}
                  disabled={isAttending || isMarking}
                >
                  {isAttending ? "Attendance Confirmed" : "I Will Attend"}
                </Button>
              ) : (
                <Link href="/api/login">
                  <Button className="w-full font-bold uppercase py-6 bg-white text-black hover:bg-gray-100">
                    Log in to Attend
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
