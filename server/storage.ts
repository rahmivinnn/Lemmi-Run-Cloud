import { 
  type User, 
  type InsertUser, 
  type Wallet, 
  type InsertWallet,
  type Referral,
  type InsertReferral,
  type GameScore,
  type InsertGameScore,
  type SkillReward,
  type InsertSkillReward
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWallet(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(address: string, updates: Partial<Wallet>): Promise<Wallet | undefined>;
  
  getReferral(code: string): Promise<Referral | undefined>;
  getReferralsByWallet(walletAddress: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  incrementReferralClick(code: string): Promise<void>;
  
  getGameScores(walletAddress: string, game: string): Promise<GameScore[]>;
  getHighScore(walletAddress: string, game: string): Promise<number>;
  createGameScore(score: InsertGameScore): Promise<GameScore>;
  
  getSkillReward(walletAddress: string): Promise<SkillReward | undefined>;
  createSkillReward(reward: InsertSkillReward): Promise<SkillReward>;
  updateSkillReward(walletAddress: string, updates: Partial<SkillReward>): Promise<SkillReward | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private referrals: Map<string, Referral>;
  private gameScores: Map<string, GameScore>;
  private skillRewards: Map<string, SkillReward>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.referrals = new Map();
    this.gameScores = new Map();
    this.skillRewards = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWallet(address: string): Promise<Wallet | undefined> {
    return this.wallets.get(address);
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = { 
      ...insertWallet, 
      id, 
      createdAt: new Date()
    };
    this.wallets.set(wallet.address, wallet);
    return wallet;
  }

  async updateWallet(address: string, updates: Partial<Wallet>): Promise<Wallet | undefined> {
    const wallet = this.wallets.get(address);
    if (!wallet) return undefined;
    
    const updated = { ...wallet, ...updates };
    this.wallets.set(address, updated);
    return updated;
  }

  async getReferral(code: string): Promise<Referral | undefined> {
    return Array.from(this.referrals.values()).find(ref => ref.code === code);
  }

  async getReferralsByWallet(walletAddress: string): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(ref => ref.walletAddress === walletAddress);
  }

  async createReferral(insertReferral: InsertReferral): Promise<Referral> {
    const id = randomUUID();
    const referral: Referral = { 
      ...insertReferral, 
      id, 
      clickCount: 0, 
      createdAt: new Date() 
    };
    this.referrals.set(id, referral);
    return referral;
  }

  async incrementReferralClick(code: string): Promise<void> {
    const referral = await this.getReferral(code);
    if (referral) {
      referral.clickCount = (referral.clickCount || 0) + 1;
      this.referrals.set(referral.id, referral);
    }
  }

  async getGameScores(walletAddress: string, game: string): Promise<GameScore[]> {
    return Array.from(this.gameScores.values())
      .filter(score => score.walletAddress === walletAddress && score.game === game)
      .sort((a, b) => b.score - a.score);
  }

  async getHighScore(walletAddress: string, game: string): Promise<number> {
    const scores = await this.getGameScores(walletAddress, game);
    return scores.length > 0 ? scores[0].score : 0;
  }

  async createGameScore(insertScore: InsertGameScore): Promise<GameScore> {
    const id = randomUUID();
    const score: GameScore = { 
      ...insertScore, 
      id, 
      createdAt: new Date() 
    };
    this.gameScores.set(id, score);
    return score;
  }

  async getSkillReward(walletAddress: string): Promise<SkillReward | undefined> {
    return Array.from(this.skillRewards.values()).find(reward => reward.walletAddress === walletAddress);
  }

  async createSkillReward(insertReward: InsertSkillReward): Promise<SkillReward> {
    const id = randomUUID();
    const reward: SkillReward = { 
      ...insertReward, 
      id, 
      updatedAt: new Date() 
    };
    this.skillRewards.set(id, reward);
    return reward;
  }

  async updateSkillReward(walletAddress: string, updates: Partial<SkillReward>): Promise<SkillReward | undefined> {
    const reward = await this.getSkillReward(walletAddress);
    if (!reward) return undefined;
    
    const updated = { ...reward, ...updates, updatedAt: new Date() };
    this.skillRewards.set(reward.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
