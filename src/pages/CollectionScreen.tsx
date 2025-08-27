import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, Star, Gift, Zap } from 'lucide-react';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { useLaceWallet } from '@/hooks/useLaceWallet';

// Import Gerbil claim characters
import gerbilK1 from '@assets/k1_1755247198361.png';
import gerbilK2 from '@assets/k2_1755247198375.png';
import gerbilK3 from '@assets/k3_1755247198376.png';
import gerbilK4 from '@assets/k4_1755247198376.png';

interface OwnedNFT {
  id: string;
  name: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  image: string;
  lastClaim: Date | null;
  canClaim: boolean;
  rewardAmount: number;
  cooldownHours: number;
}

interface ClaimHistory {
  nftId: string;
  claimedAt: Date;
  reward: number;
  streak: number;
}

export default function CollectionScreen() {
  const { isConnected, address } = useLaceWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [claimHistory, setClaimHistory] = useState<ClaimHistory[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalClaimed, setTotalClaimed] = useState(0);
  
  // Mock owned NFTs - In real implementation, this would come from blockchain
  const [ownedNFTs, setOwnedNFTs] = useState<OwnedNFT[]>([
    { 
      id: '1', name: 'Gentleman Gerbil', rarity: 'RARE', image: gerbilK1, 
      lastClaim: null, canClaim: true, rewardAmount: 50, cooldownHours: 12 
    },
    { 
      id: '2', name: 'Happy Gerbil', rarity: 'COMMON', image: gerbilK2, 
      lastClaim: null, canClaim: true, rewardAmount: 25, cooldownHours: 24 
    },
    { 
      id: '3', name: 'Wise Gerbil', rarity: 'EPIC', image: gerbilK3, 
      lastClaim: null, canClaim: true, rewardAmount: 100, cooldownHours: 8 
    },
    { 
      id: '4', name: 'Leader Gerbil', rarity: 'LEGENDARY', image: gerbilK4, 
      lastClaim: null, canClaim: true, rewardAmount: 250, cooldownHours: 6 
    }
  ]);

  // Check if NFT can be claimed (cooldown check)
  const canClaimNFT = (nft: OwnedNFT): boolean => {
    if (!nft.lastClaim) return true;
    const now = new Date();
    const timeDiff = now.getTime() - nft.lastClaim.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    return hoursDiff >= nft.cooldownHours;
  };

  // Get remaining cooldown time
  const getRemainingCooldown = (nft: OwnedNFT): string => {
    if (!nft.lastClaim || canClaimNFT(nft)) return 'Ready!';
    const now = new Date();
    const timeDiff = nft.lastClaim.getTime() + (nft.cooldownHours * 60 * 60 * 1000) - now.getTime();
    const hoursLeft = Math.ceil(timeDiff / (1000 * 60 * 60));
    return `${hoursLeft}h left`;
  };

  const handleNFTClaim = async (nftId: string) => {
    if (!isConnected) {
      alert('⚠️ Connect Lace wallet first to access your Gerbil NFTs!');
      return;
    }
    
    const nft = ownedNFTs.find(n => n.id === nftId);
    if (!nft) {
      alert('❌ NFT not found in your collection!');
      return;
    }

    if (!canClaimNFT(nft)) {
      alert(`⏰ ${nft.name} is on cooldown. ${getRemainingCooldown(nft)}`);
      return;
    }

    setIsLoading(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate streak bonus
    const baseReward = nft.rewardAmount;
    const streakBonus = Math.floor(baseReward * (currentStreak * 0.1));
    const totalReward = baseReward + streakBonus;
    
    // Update NFT claim status
    setOwnedNFTs(prev => prev.map(n => 
      n.id === nftId ? { ...n, lastClaim: new Date(), canClaim: false } : n
    ));
    
    // Add to claim history
    const newClaim: ClaimHistory = {
      nftId,
      claimedAt: new Date(),
      reward: totalReward,
      streak: currentStreak + 1
    };
    setClaimHistory(prev => [...prev, newClaim]);
    setCurrentStreak(prev => prev + 1);
    setTotalClaimed(prev => prev + totalReward);
    
    setIsLoading(false);
    alert(`🎉 Successfully claimed ${totalReward} $LEMMI from ${nft.name}! Streak: ${currentStreak + 1}`);
  };

  // Update claimable status based on cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setOwnedNFTs(prev => prev.map(nft => ({
        ...nft,
        canClaim: canClaimNFT(nft)
      })));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-purple-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/mainhub">
            <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-purple-400 tracking-wider">
            DAILY CLAIMS
          </h1>
          <div className="bg-black border border-purple-400 px-3 py-1 font-mono text-xs">
            GERBIL.CLAIM
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Daily Claims Header */}
          <div className="bg-black border-2 border-purple-400 p-8 mb-8 relative overflow-hidden">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-orange-600/5 to-purple-600/5 animate-pulse" />
            
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-400" />
            
            <div className="text-center mb-8 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-purple-400" />
                <h2 className="text-4xl font-orbitron font-bold text-purple-400 tracking-wider">
                  DAILY GERBIL CLAIM
                </h2>
                <Gift className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-purple-300/70 font-mono">Own NFTs • Earn $LEMMI • Build Streaks</p>
            </div>

            {/* Gaming Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-black/60 border border-green-400/50 p-4 text-center">
                <div className="text-3xl text-green-400 font-mono font-bold">{currentStreak}</div>
                <div className="text-xs text-green-300/70 font-mono flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" /> CLAIM STREAK
                </div>
              </div>
              <div className="bg-black/60 border border-orange-400/50 p-4 text-center">
                <div className="text-3xl text-orange-400 font-mono font-bold">{totalClaimed}</div>
                <div className="text-xs text-orange-300/70 font-mono flex items-center justify-center gap-1">
                  <Star className="w-3 h-3" /> TOTAL $LEMMI
                </div>
              </div>
              <div className="bg-black/60 border border-blue-400/50 p-4 text-center">
                <div className="text-3xl text-blue-400 font-mono font-bold">{ownedNFTs.filter(n => n.canClaim).length}</div>
                <div className="text-xs text-blue-300/70 font-mono flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> READY TO CLAIM
                </div>
              </div>
              <div className="bg-black/60 border border-purple-400/50 p-4 text-center">
                <div className="text-3xl text-purple-400 font-mono font-bold">{ownedNFTs.length}</div>
                <div className="text-xs text-purple-300/70 font-mono">OWNED NFTS</div>
              </div>
            </div>

            {/* Blockchain Rules Warning */}
            <div className="bg-yellow-600/20 border-2 border-yellow-400 p-6 mb-6 relative">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400 animate-pulse" />
              <div className="text-center">
                <div className="text-2xl text-yellow-400 font-mono font-bold mb-2">⚡ BLOCKCHAIN GAMING RULES</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-yellow-300/80 font-mono text-sm">
                  <div>🔐 Must own Gerbil NFTs</div>
                  <div>⏰ Cooldown between claims</div>
                  <div>🔥 Streak bonuses multiply rewards</div>
                </div>
              </div>
            </div>

            {/* Connection Status Warning */}
            {!isConnected && (
              <div className="bg-red-600/20 border border-red-400 p-4 mb-6 text-center">
                <div className="text-red-400 font-mono font-bold mb-2">⚠️ LACE WALLET NOT CONNECTED</div>
                <div className="text-red-300/70 font-mono text-sm mb-3">
                  Connect your Lace wallet to access your Gerbil NFT collection
                </div>
                <Link href="/wallet">
                  <button className="bg-red-600/30 border border-red-400 px-4 py-2 text-red-400 hover:bg-red-600/40 transition-colors font-mono">
                    CONNECT LACE WALLET →
                  </button>
                </Link>
              </div>
            )}

            {/* Owned NFTs Claim Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ownedNFTs.map((nft) => {
                const canClaim = canClaimNFT(nft);
                const remainingCooldown = getRemainingCooldown(nft);
                
                return (
                  <div key={nft.id} className="relative group">
                    <div 
                      className={`bg-gray-900 border-2 p-4 relative transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                        !isConnected 
                          ? 'border-red-400/50 opacity-60' 
                          : canClaim
                          ? 'border-green-400/80 hover:border-green-400 hover:bg-green-400/10 hover:shadow-lg hover:shadow-green-400/20'
                          : 'border-orange-400/50 hover:border-orange-400/80'
                      }`}
                      onClick={() => handleNFTClaim(nft.id)}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))'
                      }}
                    >
                      {/* Gaming corner brackets */}
                      <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${
                        !isConnected ? 'border-red-400' :
                        canClaim ? 'border-green-400 animate-pulse' : 'border-orange-400'
                      }`} />
                      
                      {/* Rarity indicator */}
                      <div className={`absolute top-2 right-2 px-2 py-1 text-xs font-mono font-bold ${
                        nft.rarity === 'LEGENDARY' ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' :
                        nft.rarity === 'EPIC' ? 'bg-purple-400/20 text-purple-400 border border-purple-400/50' :
                        nft.rarity === 'RARE' ? 'bg-blue-400/20 text-blue-400 border border-blue-400/50' :
                        'bg-gray-400/20 text-gray-400 border border-gray-400/50'
                      }`}>
                        {nft.rarity}
                      </div>
                      
                      {/* NFT Image with gaming effects */}
                      <div className="aspect-square bg-black border border-purple-400/30 mb-4 relative overflow-hidden mt-8">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className={`w-full h-full object-contain transition-all duration-300 ${
                            canClaim ? 'brightness-110 saturate-110' : 'brightness-75'
                          }`}
                        />
                        
                        {/* Scanning effect for claimable NFTs */}
                        {canClaim && isConnected && (
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-green-400/0 via-green-400/30 to-green-400/0 animate-pulse" />
                            <div className="absolute top-0 left-0 w-full h-1 bg-green-400 animate-ping" />
                          </div>
                        )}
                        
                        {/* Cooldown overlay */}
                        {!canClaim && isConnected && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-orange-900/70">
                            <Clock className="w-8 h-8 text-orange-400 mb-2 animate-spin" />
                            <div className="text-sm text-orange-400 font-mono font-bold">{remainingCooldown}</div>
                          </div>
                        )}
                        
                        {/* Wallet not connected overlay */}
                        {!isConnected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-900/70">
                            <div className="text-2xl text-red-400 animate-pulse">⚠️</div>
                          </div>
                        )}
                      </div>
                      
                      {/* NFT Info and Rewards */}
                      <div className="text-center">
                        <div className="font-mono text-purple-300 text-sm mb-2 font-bold truncate">
                          {nft.name}
                        </div>
                        
                        {/* Reward Amount */}
                        <div className="bg-black/60 border border-purple-400/50 px-3 py-2 mb-3">
                          <div className="text-xl text-purple-400 font-mono font-bold">
                            {nft.rewardAmount} $LEMMI
                          </div>
                          <div className="text-xs text-purple-300/70 font-mono">
                            Base Reward
                          </div>
                        </div>
                        
                        {/* Status and Action */}
                        <div className="mt-2 text-xs font-mono">
                          {!isConnected ? (
                            <div className="bg-red-600/20 border border-red-400 px-2 py-1 text-red-400">
                              CONNECT LACE
                            </div>
                          ) : canClaim ? (
                            <div className="bg-green-600/20 border border-green-400 px-2 py-1 text-green-400 animate-pulse">
                              🎮 READY TO CLAIM
                            </div>
                          ) : (
                            <div className="bg-orange-600/20 border border-orange-400 px-2 py-1 text-orange-400">
                              ⏰ {remainingCooldown}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Blockchain Gaming Instructions */}
            <div className="mt-8 bg-black/80 border-2 border-purple-400/50 p-6 relative">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-purple-400 animate-pulse" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-purple-400 animate-pulse" />
              
              <h3 className="font-orbitron font-bold text-purple-400 mb-4 text-center text-xl tracking-wider">
                🎮 BLOCKCHAIN GAMING MECHANICS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-black/60 border border-green-400/30 p-4">
                  <div className="text-3xl text-green-400 mb-2">💎</div>
                  <div className="text-sm text-green-400 font-mono font-bold mb-1">NFT OWNERSHIP</div>
                  <div className="text-xs text-green-300/70 font-mono">Only owners can claim rewards</div>
                </div>
                
                <div className="bg-black/60 border border-orange-400/30 p-4">
                  <div className="text-3xl text-orange-400 mb-2">⏰</div>
                  <div className="text-sm text-orange-400 font-mono font-bold mb-1">COOLDOWN SYSTEM</div>
                  <div className="text-xs text-orange-300/70 font-mono">Each NFT has unique cooldowns</div>
                </div>
                
                <div className="bg-black/60 border border-yellow-400/30 p-4">
                  <div className="text-3xl text-yellow-400 mb-2">🔥</div>
                  <div className="text-sm text-yellow-400 font-mono font-bold mb-1">STREAK BONUSES</div>
                  <div className="text-xs text-yellow-300/70 font-mono">Daily claims build multipliers</div>
                </div>
                
                <div className="bg-black/60 border border-purple-400/30 p-4">
                  <div className="text-3xl text-purple-400 mb-2">⭐</div>
                  <div className="text-sm text-purple-400 font-mono font-bold mb-1">RARITY REWARDS</div>
                  <div className="text-xs text-purple-300/70 font-mono">Higher rarity = bigger rewards</div>
                </div>
              </div>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center space-x-2 bg-purple-600/20 border border-purple-400 px-6 py-3">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-purple-400 font-mono font-bold">PROCESSING BLOCKCHAIN TRANSACTION...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Gaming sound effects would be triggered here */}
      <audio id="claim-sound" preload="auto">
        {/* Add claim sound effect */}
      </audio>
    </div>
  );
}