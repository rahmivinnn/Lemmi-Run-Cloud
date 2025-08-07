import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  chain: text("chain").notNull(), // 'ethereum' or 'solana'
  hasGerbilNft: boolean("has_gerbil_nft").default(false),
  lemmiBalance: integer("lemmi_balance").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: text("code").notNull().unique(),
  walletAddress: text("wallet_address").notNull(),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gameScores = pgTable("game_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  game: text("game").notNull(), // 'tikus-escape'
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillRewards = pgTable("skill_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  neuralSync: integer("neural_sync").default(0),
  efficiency: integer("efficiency").default(0),
  totalRewards: integer("total_rewards").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  address: true,
  chain: true,
  hasGerbilNft: true,
  lemmiBalance: true,
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  code: true,
  walletAddress: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).pick({
  walletAddress: true,
  game: true,
  score: true,
});

export const insertSkillRewardSchema = createInsertSchema(skillRewards).pick({
  walletAddress: true,
  neuralSync: true,
  efficiency: true,
  totalRewards: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertSkillReward = z.infer<typeof insertSkillRewardSchema>;
export type SkillReward = typeof skillRewards.$inferSelect;
