import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Gavel, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-secondary text-secondary-foreground">
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent z-10"></div>
        
        <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-display font-bold uppercase leading-none tracking-tighter mb-6 text-white drop-shadow-lg">
            Hold Power <span className="text-primary">Accountable</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
            An open database of judicial records. A community of courtroom observers. 
            Because justice happens in public.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 rounded-none font-bold uppercase tracking-wider bg-primary hover:bg-primary/90" asChild>
              <a href="/api/login">Join the Watch</a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-none font-bold uppercase tracking-wider border-white text-white hover:bg-white hover:text-black bg-transparent" asChild>
              <Link href="/judges">Browse Database</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground border-y-8 border-black">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-5xl font-display font-bold mb-2">1,240</div>
            <div className="uppercase tracking-widest text-sm font-mono">Judges Tracked</div>
          </div>
          <div className="p-6 border-y md:border-y-0 md:border-x border-white/20">
            <div className="text-5xl font-display font-bold mb-2">856</div>
            <div className="uppercase tracking-widest text-sm font-mono">Courtrooms Observed</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-display font-bold mb-2">12k+</div>
            <div className="uppercase tracking-widest text-sm font-mono">Active Citizens</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="group">
              <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center border-2 border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Gavel className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold uppercase mb-4">Track Records</h3>
              <p className="text-muted-foreground leading-relaxed">
                See exactly how judges have ruled in the past. We aggregate data to reveal bias, consistency, and adherence to the law.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center border-2 border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold uppercase mb-4">Attend Hearings</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive alerts for politically relevant cases in your area. Show up, observe, and report back to the community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center border-2 border-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold uppercase mb-4">Earn Influence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gamified civic duty. Earn points for attendance and accurate outcome predictions. Rise on the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-secondary text-secondary-foreground py-12 border-t-8 border-primary">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h4 className="font-display text-2xl font-bold uppercase">Watchdog</h4>
            <p className="text-gray-500 text-sm mt-1">Transparency is the first step to justice.</p>
          </div>
          <div className="flex gap-6 text-sm font-mono uppercase text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Data</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="/api/login" className="text-primary hover:text-white transition-colors">Login</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
