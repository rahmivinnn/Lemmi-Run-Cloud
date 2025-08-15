import { 
  type User, 
  type InsertUser, 
  type Wallet, 
  type InsertWallet,
  type GerbilNft,
  type InsertGerbilNft,
  type CardanoTransaction,
  type InsertCardanoTransaction,
  type Referral,
  type InsertReferral,
  type GameScore,
  type InsertGameScore,
  type SkillReward,
  type InsertSkillReward,
  type WinksExchange,
  type InsertWinksExchange
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  getWallet(address: string): Promise<Wallet | undefined>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(address: string, updates: Partial<Wallet>): Promise<Wallet | undefined>;
  
  getGerbilNfts(ownerId?: string): Promise<GerbilNft[]>;
  getGerbilNft(tokenId: string): Promise<GerbilNft | undefined>;
  createGerbilNft(nft: InsertGerbilNft): Promise<GerbilNft>;
  
  getCardanoTransactions(userId?: string): Promise<CardanoTransaction[]>;
  getCardanoTransaction(txHash: string): Promise<CardanoTransaction | undefined>;
  createCardanoTransaction(transaction: InsertCardanoTransaction): Promise<CardanoTransaction>;
  updateCardanoTransaction(txHash: string, updates: Partial<CardanoTransaction>): Promise<CardanoTransaction | undefined>;
  
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
  
  getWinksExchanges(walletAddress: string): Promise<WinksExchange[]>;
  createWinksExchange(exchange: InsertWinksExchange): Promise<WinksExchange>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private gerbilNfts: Map<string, GerbilNft>;
  private cardanoTransactions: Map<string, CardanoTransaction>;
  private referrals: Map<string, Referral>;
  private gameScores: Map<string, GameScore>;
  private skillRewards: Map<string, SkillReward>;
  private winksExchanges: Map<string, WinksExchange>;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.gerbilNfts = new Map();
    this.cardanoTransactions = new Map();
    this.referrals = new Map();
    this.gameScores = new Map();
    this.skillRewards = new Map();
    this.winksExchanges = new Map();
    
    // Initialize with Gerbil NFT data
    this.initializeGerbilNfts();
    this.initializeMockTransactions();
  }
  
  private initializeGerbilNfts() {
    const gerbilNfts = [
      {
        tokenId: "jeff123",
        name: "Jeff - Laser Eyes",
        rarity: "Legendary",
        attributes: ["Laser Eyes", "Mischievous", "Power Level 9000"],
        imageUrl: "/assets/jeff_1754579357023.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/jeff123",
        ownerId: null
      },
      {
        tokenId: "ashina456",
        name: "Ashina - Samurai Warrior",
        rarity: "Epic",
        attributes: ["Samurai", "Golden Armor", "Honor Badge"],
        imageUrl: "/assets/ashina_1754579357036.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/ashina456",
        ownerId: null
      },
      {
        tokenId: "undead789",
        name: "Undead - Zombie Gerbil",
        rarity: "Rare",
        attributes: ["Zombie", "Exposed Brain", "Creepy"],
        imageUrl: "/assets/undead_1754579357037.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/undead789",
        ownerId: null
      },
      {
        tokenId: "grim101",
        name: "Grim Reaper",
        rarity: "Epic",
        attributes: ["Death", "Scythe", "Dark Powers"],
        imageUrl: "/assets/grim reaper_1754579357037.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/grim101",
        ownerId: null
      },
      {
        tokenId: "cowboy202",
        name: "Cowboy - Wild West",
        rarity: "Uncommon",
        attributes: ["Cowboy Hat", "Gunslinger", "Desert Wanderer"],
        imageUrl: "/assets/cowboy_1754579357037.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/cowboy202",
        ownerId: null
      },
      {
        tokenId: "bomo303",
        name: "Bomo - Gentleman",
        rarity: "Rare",
        attributes: ["Gentleman", "Top Hat", "Sophisticated"],
        imageUrl: "/assets/bomo_1754579357038.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/bomo303",
        ownerId: null
      },
      {
        tokenId: "ico404",
        name: "Ico - Viking Warrior",
        rarity: "Epic",
        attributes: ["Viking", "Horned Helmet", "Battle Ready"],
        imageUrl: "/assets/ico_1754579357038.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/ico404",
        ownerId: null
      },
      {
        tokenId: "mumrik505",
        name: "Mumrik - Forest Ranger",
        rarity: "Common",
        attributes: ["Forest", "Nature Lover", "Green Cloak"],
        imageUrl: "/assets/mumrik_1754579357038.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/mumrik505",
        ownerId: null
      },
      {
        tokenId: "snow606",
        name: "Snow - Winter Survivor",
        rarity: "Rare",
        attributes: ["Winter", "Cold Resistant", "Furry Companion"],
        imageUrl: "/assets/snow_1754579357039.webp",
        cardanoScanUrl: "https://cardanoscan.io/token/snow606",
        ownerId: null
      }
    ];
    
    gerbilNfts.forEach(nft => {
      const fullNft: GerbilNft = {
        ...nft,
        id: randomUUID(),
        createdAt: new Date()
      };
      this.gerbilNfts.set(nft.tokenId, fullNft);
    });
  }
  
  private initializeMockTransactions() {
    const transactions: InsertCardanoTransaction[] = [
      {
        txHash: "4a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
        type: "received",
        amount: "150.75",
        token: "ADA",
        fromAddress: "addr1q9x2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c",
        toAddress: "Your Wallet",
        status: "confirmed",
        cardanoScanUrl: "https://cardanoscan.io/transaction/4a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
        userId: null
      },
      {
        txHash: "1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a",
        type: "nft_transfer",
        amount: "1",
        token: "LEMMI",
        fromAddress: "addr1q8x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0",
        toAddress: "Your Wallet",
        status: "confirmed",
        cardanoScanUrl: "https://cardanoscan.io/transaction/1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a",
        nftData: {
          name: "Jeff - Laser Eyes Gerbil",
          image: "/assets/jeff_1754579357023.webp"
        },
        userId: null
      }
    ];
    
    transactions.forEach(tx => {
      const fullTx: CardanoTransaction = {
        ...tx,
        id: randomUUID(),
        timestamp: new Date()
      };
      this.cardanoTransactions.set(tx.txHash, fullTx);
    });
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
    const user: User = { 
      ...insertUser, 
      id,
      lemmiTokens: "0",
      winks: 0,
      adaBalance: "0",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updated);
    return updated;
  }

  async getWallet(address: string): Promise<Wallet | undefined> {
    return this.wallets.get(address);
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = { 
      ...insertWallet, 
      id,
      winks: insertWallet.winks || 0,
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
  
  async getGerbilNfts(ownerId?: string): Promise<GerbilNft[]> {
    const allNfts = Array.from(this.gerbilNfts.values());
    if (ownerId) {
      return allNfts.filter(nft => nft.ownerId === ownerId);
    }
    return allNfts;
  }
  
  async getGerbilNft(tokenId: string): Promise<GerbilNft | undefined> {
    return this.gerbilNfts.get(tokenId);
  }
  
  async createGerbilNft(insertNft: InsertGerbilNft): Promise<GerbilNft> {
    const id = randomUUID();
    const nft: GerbilNft = {
      ...insertNft,
      id,
      createdAt: new Date()
    };
    this.gerbilNfts.set(insertNft.tokenId, nft);
    return nft;
  }
  
  async getCardanoTransactions(userId?: string): Promise<CardanoTransaction[]> {
    const allTxs = Array.from(this.cardanoTransactions.values());
    if (userId) {
      return allTxs.filter(tx => tx.userId === userId);
    }
    return allTxs.sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }
  
  async getCardanoTransaction(txHash: string): Promise<CardanoTransaction | undefined> {
    return this.cardanoTransactions.get(txHash);
  }
  
  async createCardanoTransaction(insertTx: InsertCardanoTransaction): Promise<CardanoTransaction> {
    const id = randomUUID();
    const transaction: CardanoTransaction = {
      ...insertTx,
      id,
      timestamp: new Date()
    };
    this.cardanoTransactions.set(insertTx.txHash, transaction);
    return transaction;
  }
  
  async updateCardanoTransaction(txHash: string, updates: Partial<CardanoTransaction>): Promise<CardanoTransaction | undefined> {
    const tx = this.cardanoTransactions.get(txHash);
    if (!tx) return undefined;
    
    const updated = { ...tx, ...updates };
    this.cardanoTransactions.set(txHash, updated);
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

  async getWinksExchanges(walletAddress: string): Promise<WinksExchange[]> {
    return Array.from(this.winksExchanges.values())
      .filter(exchange => exchange.walletAddress === walletAddress)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createWinksExchange(insertExchange: InsertWinksExchange): Promise<WinksExchange> {
    const id = randomUUID();
    const exchange: WinksExchange = {
      ...insertExchange,
      id,
      createdAt: new Date()
    };
    this.winksExchanges.set(id, exchange);
    return exchange;
  }
}

export const storage = new MemStorage();
