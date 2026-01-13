import { useJudges } from "@/hooks/use-judges";
import { JudgeCard } from "@/components/JudgeCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-mobile"; // Reusing simple utility if available, else local state

export default function JudgesList() {
  const [search, setSearch] = useState("");
  const { data: judges, isLoading, error } = useJudges(search);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b-2 border-black pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight mb-2">
            Judicial Records
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Transparency is accountability. Browse the database to see ratings, biases, and historical ruling patterns.
          </p>
        </div>
        
        <div className="w-full md:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search by name or court..." 
            className="pl-9 w-full md:w-80 bg-background border-2 border-border focus-visible:ring-0 focus-visible:border-primary rounded-none h-12"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-none"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive font-bold">
          Failed to load judges. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {judges?.map((judge) => (
            <JudgeCard key={judge.id} judge={judge} />
          ))}
          {judges?.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 border-2 border-dashed border-border">
              No judges found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
