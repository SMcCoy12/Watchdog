import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <AlertTriangle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="text-6xl font-display font-bold uppercase mb-2">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-8 text-muted-foreground">Page Not Found</h2>
      
      <p className="max-w-md text-center mb-8">
        The page you are looking for has been dismissed. 
        Return to the dashboard to continue your observation.
      </p>

      <Link href="/">
        <Button size="lg" className="font-bold uppercase tracking-wide">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
