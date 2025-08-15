import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  lemmiTokens: decimal("lemmi_tokens", { precision: 18, scale: 8 }).default("0"),
  winks: integer("winks").default(0),
  adaBalance: decimal("ada_balance", { precision: 18, scale: 6 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  chain: text("chain").notNull(), // 'cardano' for Lace wallet
  hasGerbilNft: boolean("has_gerbil_nft").default(false),
  lemmiBalance: integer("lemmi_balance").default(0),
  winks: integer("winks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gerbilNfts = pgTable("gerbil_nfts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tokenId: text("token_id").notNull().unique(),
  name: text("name").notNull(),
  rarity: text("rarity").notNull(), // Common, Uncommon, Rare, Epic, Legendary
  attributes: jsonb("attributes").$type<string[]>().notNull(),
  imageUrl: text("image_url").notNull(),
  cardanoScanUrl: text("cardano_scan_url"),
  ownerId: varchar("owner_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cardanoTransactions = pgTable("cardano_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  txHash: text("tx_hash").notNull().unique(),
  type: text("type").notNull(), // sent, received, nft_transfer, smart_contract
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  token: text("token").notNull(), // ADA, LEMMI
  fromAddress: text("from_address"),
  toAddress: text("to_address").notNull(),
  status: text("status").default("pending").notNull(), // pending, confirmed, failed
  cardanoScanUrl: text("cardano_scan_url").notNull(),
  nftData: jsonb("nft_data").$type<{ name: string; image: string }>(),
  userId: varchar("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
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
  game: text("game").notNull(), // 'lemmi_run', 'nft_explorer'
  score: integer("score").notNull(),
  level: integer("level").default(1),
  achievements: jsonb("achievements").$type<string[]>().default([]),
  playTime: integer("play_time_seconds").default(0),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  gerbilNfts: many(gerbilNfts),
  transactions: many(cardanoTransactions),
}));

export const gerbilNftsRelations = relations(gerbilNfts, ({ one }) => ({
  owner: one(users, {
    fields: [gerbilNfts.ownerId],
    references: [users.id],
  }),
}));

export const cardanoTransactionsRelations = relations(cardanoTransactions, ({ one }) => ({
  user: one(users, {
    fields: [cardanoTransactions.userId],
    references: [users.id],
  }),
}));

// Winks Exchange Table
export const winksExchanges = pgTable("winks_exchanges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  winksAmount: integer("winks_amount").notNull(),
  lemmiAmount: integer("lemmi_amount").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 8, scale: 4 }).notNull(), // How many winks per 1 LEMMI
  status: text("status").default("completed").notNull(), // completed, pending, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  walletAddress: true,
  winks: true,
});

export const insertWalletSchema = createInsertSchema(wallets).pick({
  address: true,
  chain: true,
  hasGerbilNft: true,
  lemmiBalance: true,
});

export const insertGerbilNftSchema = createInsertSchema(gerbilNfts).omit({
  id: true,
  createdAt: true,
});

export const insertCardanoTransactionSchema = createInsertSchema(cardanoTransactions).omit({
  id: true,
  timestamp: true,
});

export const insertReferralSchema = createInsertSchema(referrals).pick({
  code: true,
  walletAddress: true,
});

export const insertGameScoreSchema = createInsertSchema(gameScores).pick({
  walletAddress: true,
  game: true,
  score: true,
  level: true,
  achievements: true,
  playTime: true,
});

export const insertSkillRewardSchema = createInsertSchema(skillRewards).pick({
  walletAddress: true,
  neuralSync: true,
  efficiency: true,
  totalRewards: true,
});

export const insertWinksExchangeSchema = createInsertSchema(winksExchanges).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type GerbilNft = typeof gerbilNfts.$inferSelect;
export type InsertGerbilNft = z.infer<typeof insertGerbilNftSchema>;
export type CardanoTransaction = typeof cardanoTransactions.$inferSelect;
export type InsertCardanoTransaction = z.infer<typeof insertCardanoTransactionSchema>;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertGameScore = z.infer<typeof insertGameScoreSchema>;
export type GameScore = typeof gameScores.$inferSelect;
export type InsertSkillReward = z.infer<typeof insertSkillRewardSchema>;
export type SkillReward = typeof skillRewards.$inferSelect;
export type InsertWinksExchange = z.infer<typeof insertWinksExchangeSchema>;
export type WinksExchange = typeof winksExchanges.$inferSelect;

// Wallet interface for frontend
export interface WalletState {
  walletAddress: string | null;
  isConnected: boolean;
  hasGerbilNft: boolean;
  lemmiBalance: number;
  winks: number;
  chain: 'cardano' | null;
}

// Lace Wallet API Types for Cardano
interface LaceAPI {
  enable(): Promise<any>;
  isEnabled(): Promise<boolean>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getBalance(): Promise<string>;
  getUtxos(): Promise<any[]>;
  signTx(tx: string): Promise<string>;
  submitTx(tx: string): Promise<string>;
}

declare global {
  interface Window {
    cardano?: {
      lace?: LaceAPI;
    };
  }
}
