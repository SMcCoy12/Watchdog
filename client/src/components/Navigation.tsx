import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Scale, Calendar, Trophy, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: Scale },
    { href: "/judges", label: "Judges", icon: Scale },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <nav className="border-b-2 border-primary bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">
                W
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter uppercase">
                Watchdog
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 text-sm font-bold uppercase tracking-wide transition-colors
                    ${isActive 
                      ? "text-primary border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            
            {user && (
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <span className="font-mono text-xs text-muted-foreground hidden lg:inline-block">
                  {user.firstName}
                </span>
                <Button 
                  onClick={() => logout()}
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-2 px-3 py-4 text-base font-bold uppercase tracking-wide w-full
                    ${isActive ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-muted"}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {user && (
              <button
                onClick={() => logout()}
                className="flex items-center gap-2 px-3 py-4 text-base font-bold uppercase tracking-wide w-full text-destructive hover:bg-destructive/5"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
