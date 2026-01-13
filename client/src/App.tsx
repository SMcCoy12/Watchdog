import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/Navigation";
import { Loader2 } from "lucide-react";

import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import JudgesList from "@/pages/JudgesList";
import JudgeDetail from "@/pages/JudgeDetail";
import Calendar from "@/pages/Calendar";
import CaseDetail from "@/pages/CaseDetail";
import Leaderboard from "@/pages/Leaderboard";
import NotFound from "@/pages/NotFound";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 bg-background/50 bg-grid-pattern">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/judges" component={JudgesList} />
          <Route path="/judges/:id" component={JudgeDetail} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/cases/:id" component={CaseDetail} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
