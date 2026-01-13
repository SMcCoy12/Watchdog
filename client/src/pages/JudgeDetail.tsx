import { useJudge } from "@/hooks/use-judges";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gavel, FileText } from "lucide-react";
import { Link } from "wouter";
import { type Case } from "@shared/schema";

export default function JudgeDetail() {
  const [, params] = useRoute("/judges/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: judge, isLoading } = useJudge(id);

  if (isLoading) return <div className="h-screen bg-muted animate-pulse" />;
  if (!judge) return <div className="p-8 text-center font-bold">Judge not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/judges">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Database
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Profile Column */}
        <div className="lg:col-span-1">
          <div className="bg-card border-2 border-border p-1">
            <div className="aspect-square bg-muted relative overflow-hidden">
              {judge.imageUrl ? (
                <img src={judge.imageUrl} alt={judge.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
                  <Gavel className="w-24 h-24 opacity-20" />
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="bg-muted/30 p-4 border border-border">
              <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Appointed By</div>
              <div className="font-bold">{judge.appointedBy || "Unknown"}</div>
            </div>
            <div className="bg-muted/30 p-4 border border-border">
              <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Court</div>
              <div className="font-bold">{judge.court}</div>
            </div>
            <div className="bg-muted/30 p-4 border border-border">
              <div className="text-xs font-mono uppercase text-muted-foreground mb-1">Perceived Bias</div>
              <Badge variant="outline" className="mt-1 rounded-none border-foreground/20">
                {judge.bias || "Neutral"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-5xl font-display font-bold uppercase">{judge.name}</h1>
              <div className={`
                text-2xl font-mono font-bold px-4 py-2 border-2 
                ${(judge.rating||0) > 70 ? 'text-green-600 border-green-600 bg-green-50' : 'text-destructive border-destructive bg-red-50'}
              `}>
                {judge.rating}/100
              </div>
            </div>
            <p className="text-xl text-muted-foreground mb-6 font-light">{judge.location}</p>
            
            <div className="prose max-w-none text-foreground">
              <h3 className="font-display uppercase text-lg mb-2">Biography</h3>
              <p>{judge.bio || "No biography provided yet."}</p>
            </div>
          </div>

          <div className="pt-8 border-t-2 border-border">
            <h3 className="font-display font-bold text-2xl uppercase mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Case History
            </h3>
            
            <div className="space-y-4">
              {judge.cases && judge.cases.length > 0 ? (
                judge.cases.map((c: Case) => (
                  <Link key={c.id} href={`/cases/${c.id}`}>
                    <div className="group border border-border p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-lg group-hover:text-primary transition-colors">{c.title}</div>
                          <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm">{new Date(c.date).toLocaleDateString()}</div>
                          {c.outcome && (
                            <Badge variant="secondary" className="mt-2 rounded-none">
                              {c.outcome}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-muted-foreground italic">No cases recorded yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
