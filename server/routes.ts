import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWalletSchema, insertReferralSchema, insertGameScoreSchema, insertSkillRewardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Wallet NFT verification endpoint
  app.get("/api/wallet/:address/nfts", async (req, res) => {
    try {
      const { address } = req.params;
      const wallet = await storage.getWallet(address);
      
      if (!wallet) {
        return res.json({ hasGerbilNft: false, nfts: [] });
      }
      
      // In a real implementation, this would call Moralis/Alchemy API
      // For now, simulate NFT checking based on wallet data
      const nfts = wallet.hasGerbilNft ? ["GERBIL_CONTRACT_ADDRESS"] : [];
      
      res.json({ 
        hasGerbilNft: wallet.hasGerbilNft,
        nfts 
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NFTs" });
    }
  });

  // Token balance endpoint
  app.get("/api/wallet/:address/lemmi", async (req, res) => {
    try {
      const { address } = req.params;
      const wallet = await storage.getWallet(address);
      
      if (!wallet) {
        return res.json({ balance: 0 });
      }
      
      // In a real implementation, this would call smart contract
      res.json({ balance: wallet.lemmiBalance || 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch token balance" });
    }
  });

  // Create or update wallet
  app.post("/api/wallet", async (req, res) => {
    try {
      const walletData = insertWalletSchema.parse(req.body);
      
      const existingWallet = await storage.getWallet(walletData.address);
      if (existingWallet) {
        const updated = await storage.updateWallet(walletData.address, walletData);
        return res.json(updated);
      }
      
      const wallet = await storage.createWallet(walletData);
      res.json(wallet);
    } catch (error) {
      res.status(400).json({ error: "Invalid wallet data" });
    }
  });

  // Generate referral link
  app.post("/api/referral", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const referral = await storage.createReferral({ code, walletAddress });
      
      res.json({ 
        code: referral.code,
        link: `${req.protocol}://${req.get('host')}?ref=${referral.code}`
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate referral" });
    }
  });

  // Get referrals for wallet
  app.get("/api/referral/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const referrals = await storage.getReferralsByWallet(walletAddress);
      
      const totalClicks = referrals.reduce((sum, ref) => sum + (ref.clickCount || 0), 0);
      
      res.json({ 
        referrals,
        totalReferred: totalClicks,
        activeReferrals: referrals.length
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // Track referral click
  app.post("/api/referral/:code/click", async (req, res) => {
    try {
      const { code } = req.params;
      await storage.incrementReferralClick(code);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track referral click" });
    }
  });

  // Submit game score
  app.post("/api/game/score", async (req, res) => {
    try {
      const scoreData = insertGameScoreSchema.parse(req.body);
      const score = await storage.createGameScore(scoreData);
      
      // Get high score for comparison
      const highScore = await storage.getHighScore(scoreData.walletAddress, scoreData.game);
      
      res.json({ 
        score: score.score,
        highScore,
        isNewRecord: score.score > highScore
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  // Get game scores
  app.get("/api/game/:walletAddress/:game/scores", async (req, res) => {
    try {
      const { walletAddress, game } = req.params;
      const scores = await storage.getGameScores(walletAddress, game);
      const highScore = await storage.getHighScore(walletAddress, game);
      
      res.json({ 
        scores: scores.slice(0, 10), // Top 10 scores
        highScore
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scores" });
    }
  });

  // Get/Update skill rewards
  app.get("/api/skills/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const skills = await storage.getSkillReward(walletAddress);
      
      if (!skills) {
        // Create default skill reward entry
        const newSkills = await storage.createSkillReward({
          walletAddress,
          neuralSync: Math.floor(Math.random() * 1000),
          efficiency: Math.floor(Math.random() * 100),
          totalRewards: 0
        });
        return res.json(newSkills);
      }
      
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch skill rewards" });
    }
  });

  app.post("/api/skills/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const updates = req.body;
      
      let skills = await storage.getSkillReward(walletAddress);
      
      if (!skills) {
        skills = await storage.createSkillReward({
          walletAddress,
          neuralSync: updates.neuralSync || 0,
          efficiency: updates.efficiency || 0,
          totalRewards: updates.totalRewards || 0
        });
      } else {
        skills = await storage.updateSkillReward(walletAddress, updates);
      }
      
      res.json(skills);
    } catch (error) {
      res.status(500).json({ error: "Failed to update skill rewards" });
    }
  });

  // Neural features status endpoint
  app.get("/api/features/:walletAddress?", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      let features = {
        freeAccess: false,
        lemmiBalance: 0,
        skillRewards: { efficiency: 0, neuralSync: 0 },
        referralCount: 0,
        degenMode: false,
        kingLemmiUnlocked: 5
      };
      
      if (walletAddress) {
        const wallet = await storage.getWallet(walletAddress);
        const skills = await storage.getSkillReward(walletAddress);
        const referrals = await storage.getReferralsByWallet(walletAddress);
        
        features = {
          freeAccess: wallet?.hasGerbilNft || false,
          lemmiBalance: wallet?.lemmiBalance || 0,
          skillRewards: {
            efficiency: skills?.efficiency || 0,
            neuralSync: skills?.neuralSync || 0
          },
          referralCount: referrals.reduce((sum, ref) => sum + (ref.clickCount || 0), 0),
          degenMode: false, // This would be based on some criteria
          kingLemmiUnlocked: Math.min(10, Math.floor((skills?.totalRewards || 0) / 100))
        };
      }
      
      res.json(features);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch features" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
