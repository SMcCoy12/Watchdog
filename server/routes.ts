import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth & Integrations first
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);
  registerImageRoutes(app);

  // === JUDGES ===
  app.get(api.judges.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const judges = await storage.getJudges(search);
    res.json(judges);
  });

  app.get(api.judges.get.path, async (req, res) => {
    const judge = await storage.getJudge(Number(req.params.id));
    if (!judge) return res.status(404).json({ message: "Judge not found" });
    res.json(judge);
  });

  app.post(api.judges.create.path, async (req, res) => {
    // Basic admin check could go here, skipping for MVP
    try {
      const input = api.judges.create.input.parse(req.body);
      const judge = await storage.createJudge(input);
      res.status(201).json(judge);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      throw e;
    }
  });

  // === CASES ===
  app.get(api.cases.list.path, async (req, res) => {
    const cases = await storage.getCases({
      upcoming: req.query.upcoming === 'true',
      relevantOnly: req.query.relevantOnly === 'true',
    });
    res.json(cases);
  });

  app.get(api.cases.get.path, async (req, res) => {
    const caseItem = await storage.getCase(Number(req.params.id));
    if (!caseItem) return res.status(404).json({ message: "Case not found" });
    res.json(caseItem);
  });

  app.post(api.cases.create.path, async (req, res) => {
    try {
      const input = api.cases.create.input.parse(req.body);
      // TODO: AI Analysis hook could be here
      const caseItem = await storage.createCase(input);
      res.status(201).json(caseItem);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      throw e;
    }
  });

  // === ATTENDANCE ===
  app.post(api.attendance.mark.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.attendance.mark.input.parse(req.body);
      const user = req.user as any;
      
      // Ensure user is marking for themselves
      if (input.userId !== user.claims.sub) {
        return res.status(403).json({ message: "Cannot mark attendance for others" });
      }

      const att = await storage.markAttendance(input);
      res.status(201).json(att);
    } catch (e) {
      if (e instanceof z.ZodError) return res.status(400).json(e.errors);
      throw e;
    }
  });

  app.get(api.attendance.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const user = req.user as any;
    const list = await storage.getUserAttendance(user.claims.sub);
    res.json(list);
  });

  // === LEADERBOARD ===
  app.get(api.users.leaderboard.path, async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    res.json(leaderboard);
  });

  // Seed data on startup
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const judges = await storage.getJudges();
  if (judges.length === 0) {
    const judge = await storage.createJudge({
      name: "Judge Elena Vance",
      court: "Superior Court of California",
      location: "San Francisco, CA",
      rating: 45, // Low rating
      bias: "Pro-Corporate",
      appointedBy: "Gov. Arnold",
      bio: "Known for harsh sentencing on non-violent crimes.",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=200",
    });

    const judge2 = await storage.createJudge({
      name: "Judge Marcus Thorne",
      court: "Federal District Court",
      location: "New York, NY",
      rating: 85, // High rating
      bias: "Civil Liberties",
      appointedBy: "President Obama",
      bio: "Champion of digital privacy rights.",
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=200",
    });

    await storage.createCase({
      title: "City v. Protestors",
      description: "Hearing regarding the unlawful assembly charges against climate activists.",
      judgeId: judge.id,
      date: new Date("2025-02-15T09:00:00Z"),
      location: "Courtroom 4B",
      isPoliticallyRelevant: true,
      relevanceReason: "High impact on first amendment rights for assembly.",
      outcome: "Pending",
      isUnexpected: false,
    });

    await storage.createCase({
      title: "TechCorp v. Doe",
      description: "Whistleblower retaliation case.",
      judgeId: judge2.id,
      date: new Date("2025-02-20T10:00:00Z"),
      location: "Courtroom 12",
      isPoliticallyRelevant: true,
      relevanceReason: "Sets precedent for worker protections in tech.",
      outcome: "Pending",
      isUnexpected: false,
    });
  }
}
