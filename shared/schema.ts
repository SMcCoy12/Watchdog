import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export Auth and Chat models
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === JUDGES ===
export const judges = pgTable("judges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  court: text("court").notNull(), // e.g., "Supreme Court", "District 9"
  location: text("location").notNull(), // City, State
  imageUrl: text("image_url"),
  // Record could be a simple rating or more complex JSON stats
  rating: integer("rating").default(50), // 0-100 (0=bad, 100=good)
  bias: text("bias"), // "Conservative", "Liberal", "Moderate"
  appointedBy: text("appointed_by"),
  bio: text("bio"),
});

// === CASES ===
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  judgeId: integer("judge_id").references(() => judges.id),
  date: timestamp("date").notNull(),
  location: text("location"),
  isPoliticallyRelevant: boolean("is_politically_relevant").default(false),
  relevanceReason: text("relevance_reason"), // AI explanation
  outcome: text("outcome"), // "Pending", "Dismissed", "Guilty", etc.
  isUnexpected: boolean("is_unexpected").default(false), // AI analysis of outcome vs record
  createdAt: timestamp("created_at").defaultNow(),
});

// === ATTENDANCE / POINTS ===
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // References auth.users.id
  caseId: integer("case_id").references(() => cases.id),
  status: text("status").notNull(), // "planned", "attended", "verified"
  pointsAwarded: integer("points_awarded").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const judgesRelations = relations(judges, ({ many }) => ({
  cases: many(cases),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  judge: one(judges, {
    fields: [cases.judgeId],
    references: [judges.id],
  }),
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  case: one(cases, {
    fields: [attendance.caseId],
    references: [cases.id],
  }),
  // User relation is loose because user is in a different schema file/table definition
}));

// === ZOD SCHEMAS ===
export const insertJudgeSchema = createInsertSchema(judges).omit({ id: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true, createdAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true, createdAt: true, pointsAwarded: true });

// === TYPES ===
export type Judge = typeof judges.$inferSelect;
export type InsertJudge = z.infer<typeof insertJudgeSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

export type CaseWithJudge = Case & { judge: Judge };

// Custom Types
export type LeaderboardEntry = {
  userId: string;
  name: string;
  points: number;
  avatarUrl: string | null;
};
