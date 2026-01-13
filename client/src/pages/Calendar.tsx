import { useCases } from "@/hooks/use-cases";
import { CaseCard } from "@/components/CaseCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export default function Calendar() {
  const [filterRelevant, setFilterRelevant] = useState(false);
  const { data: cases, isLoading } = useCases({ 
    upcoming: true, 
    relevantOnly: filterRelevant 
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-2">
            Court Calendar
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Upcoming hearings and trials. Prioritize politically relevant cases that impact civil liberties.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterRelevant ? "default" : "outline"}
            onClick={() => setFilterRelevant(!filterRelevant)}
            className="rounded-none border-2 font-bold uppercase"
          >
            <Filter className="w-4 h-4 mr-2" />
            {filterRelevant ? "Showing Critical Only" : "Show Critical Only"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-muted animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {cases?.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} />
          ))}
          {cases?.length === 0 && (
            <div className="py-20 text-center text-muted-foreground bg-muted/20 border-2 border-dashed border-border">
              No upcoming cases found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
