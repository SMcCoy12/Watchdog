import { db } from "./db";
import { 
  judges, cases, attendance, users,
  type Judge, type InsertJudge,
  type Case, type InsertCase,
  type Attendance, type InsertAttendance,
  type LeaderboardEntry
} from "@shared/schema";
import { eq, desc, and, gte, sql } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";
import { chatStorage, type IChatStorage } from "./replit_integrations/chat/storage";

export interface IStorage {
  // Auth & Chat
  auth: IAuthStorage;
  chat: IChatStorage;

  // Judges
  getJudges(search?: string): Promise<Judge[]>;
  getJudge(id: number): Promise<Judge | undefined>;
  createJudge(judge: InsertJudge): Promise<Judge>;

  // Cases
  getCases(filters?: { upcoming?: boolean; relevantOnly?: boolean }): Promise<(Case & { judge: Judge })[]>;
  getCase(id: number): Promise<(Case & { judge: Judge }) | undefined>;
  createCase(caseItem: InsertCase): Promise<Case>;

  // Attendance
  markAttendance(att: InsertAttendance): Promise<Attendance>;
  getUserAttendance(userId: string): Promise<(Attendance & { case: Case })[]>;
  
  // Users/Leaderboard
  getLeaderboard(): Promise<LeaderboardEntry[]>;
}

export class DatabaseStorage implements IStorage {
  auth = authStorage;
  chat = chatStorage;

  // === JUDGES ===
  async getJudges(search?: string): Promise<Judge[]> {
    let query = db.select().from(judges);
    // Note: Drizzle specific search logic would go here if needed, keeping simple for now
    return await query.orderBy(desc(judges.rating));
  }

  async getJudge(id: number): Promise<Judge | undefined> {
    const [judge] = await db.select().from(judges).where(eq(judges.id, id));
    return judge;
  }

  async createJudge(judge: InsertJudge): Promise<Judge> {
    const [newJudge] = await db.insert(judges).values(judge).returning();
    return newJudge;
  }

  // === CASES ===
  async getCases(filters?: { upcoming?: boolean; relevantOnly?: boolean }): Promise<(Case & { judge: Judge })[]> {
    const conditions = [];
    if (filters?.upcoming) {
      conditions.push(gte(cases.date, new Date()));
    }
    if (filters?.relevantOnly) {
      conditions.push(eq(cases.isPoliticallyRelevant, true));
    }

    const query = db.select({
      ...cases, // Spread all case fields
      judge: judges, // Include judge object
    })
    .from(cases)
    .innerJoin(judges, eq(cases.judgeId, judges.id));

    if (conditions.length > 0) {
      // @ts-ignore - dizzzle types can be tricky with dynamic where
      query.where(and(...conditions));
    }
    
    // @ts-ignore
    const rows = await query.orderBy(cases.date);
    
    // Map flattened result to nested object
    return rows.map(row => ({
      ...row, // Case fields
      // Remove judge fields from root and put them in judge property
      // Note: Drizzle's result mapping usually handles this better with .mapWith() but for manual join:
      judge: row.judge
    }));
  }

  async getCase(id: number): Promise<(Case & { judge: Judge }) | undefined> {
    const [row] = await db.select()
      .from(cases)
      .innerJoin(judges, eq(cases.judgeId, judges.id))
      .where(eq(cases.id, id));

    if (!row) return undefined;
    
    return {
      ...row.cases,
      judge: row.judges
    };
  }

  async createCase(caseItem: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseItem).returning();
    return newCase;
  }

  // === ATTENDANCE ===
  async markAttendance(att: InsertAttendance): Promise<Attendance> {
    // Basic logic: 10 points for attending, 50 if unexpected outcome (future logic)
    const points = 10; 
    
    const [newAtt] = await db.insert(attendance)
      .values({ ...att, pointsAwarded: points, status: 'attended' })
      .returning();
      
    return newAtt;
  }

  async getUserAttendance(userId: string): Promise<(Attendance & { case: Case })[]> {
    const rows = await db.select()
      .from(attendance)
      .innerJoin(cases, eq(attendance.caseId, cases.id))
      .where(eq(attendance.userId, userId));
      
    return rows.map(row => ({
      ...row.attendance,
      case: row.cases
    }));
  }

  // === LEADERBOARD ===
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    // Sum points from attendance table grouped by user
    const result = await db.select({
      userId: attendance.userId,
      points: sql<number>`sum(${attendance.pointsAwarded})::int`,
    })
    .from(attendance)
    .groupBy(attendance.userId)
    .orderBy(desc(sql`sum(${attendance.pointsAwarded})`))
    .limit(10);

    // Fetch user details for these IDs
    // In a real app, we'd join with users table, but it's in a different schema file/table object
    // Assuming we can join or fetch separately.
    
    const leaderboard: LeaderboardEntry[] = [];
    
    for (const r of result) {
      const [user] = await db.select().from(users).where(eq(users.id, r.userId));
      if (user) {
        leaderboard.push({
          userId: user.id,
          name: `${user.firstName || 'User'} ${user.lastName || ''}`.trim() || 'Anonymous',
          points: r.points || 0,
          avatarUrl: user.profileImageUrl,
        });
      }
    }
    
    return leaderboard;
  }
}

export const storage = new DatabaseStorage();
