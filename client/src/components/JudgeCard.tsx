import { type Judge } from "@shared/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Star, AlertTriangle, CheckCircle, Scale } from "lucide-react";

export function JudgeCard({ judge }: { judge: Judge }) {
  const isGood = (judge.rating ?? 0) > 70;
  const isBad = (judge.rating ?? 0) < 40;
  
  const statusColor = isGood ? "text-green-600 border-green-600" : isBad ? "text-destructive border-destructive" : "text-yellow-600 border-yellow-600";
  const statusBg = isGood ? "bg-green-50" : isBad ? "bg-red-50" : "bg-yellow-50";

  return (
    <Link href={`/judges/${judge.id}`} className="block group">
      <Card className="h-full border-2 hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden">
        <div className="relative h-48 bg-muted overflow-hidden">
          {judge.imageUrl ? (
            <img 
              src={judge.imageUrl} 
              alt={judge.name} 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
              <Scale className="w-16 h-16 opacity-20" />
            </div>
          )}
          
          <div className={`absolute top-4 right-4 px-3 py-1 font-mono font-bold text-lg bg-background border-2 ${statusColor} shadow-sm`}>
            {judge.rating ?? "?"}/100
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-display uppercase tracking-tight group-hover:text-primary transition-colors">
                {judge.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground font-mono mt-1">{judge.court}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="rounded-none border-primary/20 bg-primary/5">
              {judge.location}
            </Badge>
            {judge.bias && (
              <Badge variant="outline" className="rounded-none border-secondary/20 bg-secondary/5">
                {judge.bias}
              </Badge>
            )}
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {judge.bio || "No biography available."}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
