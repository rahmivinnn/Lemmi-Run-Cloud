import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import WalletConnect from "@/components/WalletConnect";
import NeuralFeatureCard from "@/components/NeuralFeatureCard";
import TokenDisplay from "@/components/TokenDisplay";
import ReferralPanel from "@/components/ReferralPanel";
import SkillRewardPanel from "@/components/SkillRewardPanel";
import DegenModeToggle from "@/components/DegenModeToggle";
import KingLemmiViewer from "@/components/KingLemmiViewer";
import MiniGameTikus from "@/components/MiniGameTikus";
import GerbilNftGallery from "@/components/GerbilNftGallery";
import CardanoTransactionTracker from "@/components/CardanoTransactionTracker";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CharacterSelection } from "@/components/CharacterSelection";
import { GameRunner } from "@/components/GameRunner";
import { useWallet } from "@/hooks/useWallet";
import { useAudio } from "@/hooks/useAudio";
import AshinaImage from "@assets/ashina_1754580592322.webp";

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  stats: {
    speed: number;
    jump: number;
    special: number;
  };
}

export default function NeuralInterface() {
  const [gameState, setGameState] = useState<'loading' | 'main' | 'character-select' | 'game'>('loading');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'main' | 'inventory' | 'skills' | 'network'>('main');
  const [terminalText, setTerminalText] = useState("");
  const { walletAddress, isConnected, connectWallet, hasGerbilNft } = useWallet();
  const { playClick, playHover } = useAudio();

  const { data: features } = useQuery({
    queryKey: ["/api/features", walletAddress],
    enabled: !!walletAddress,
  });

  useEffect(() => {
    const messages = [
      "[INITIALIZING] Neural pathways... ONLINE",
      "[SCANNING] Wallet connections... DETECTED",
      "[SYNCING] Blockchain data... SYNCHRONIZED",
      "[READY] Neural interface active..."
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setTerminalText(messages[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      // Track referral click
      fetch(`/api/referral/${refCode}/click`, { method: 'POST' })
        .catch(console.error);
    }
  }, []);

  const activeFeaturesCount = features ? 
    ((features as any).freeAccess ? 1 : 0) + 
    ((features as any).lemmiBalance > 0 ? 1 : 0) + 
    ((features as any).skillRewards?.efficiency > 50 ? 1 : 0) +
    ((features as any).referralCount > 0 ? 1 : 0) : 0;

  const canJackIn = activeFeaturesCount >= 3;

  return (
    <div className="min-h-screen overflow-hidden relative bg-black">
      {/* Cyberpunk Skyscraper Background */}
      <div className="fixed inset-0 z-0">
        {/* Night Sky */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black" />
        
        {/* City Silhouette Layer 1 - Far Buildings */}
        <div className="absolute bottom-0 left-0 w-full h-3/4 opacity-60">
          <div className="absolute bottom-0 left-0 w-24 h-64 bg-gradient-to-t from-gray-800 to-gray-700 transform skew-x-2" />
          <div className="absolute bottom-0 left-20 w-32 h-80 bg-gradient-to-t from-gray-700 to-gray-600" />
          <div className="absolute bottom-0 left-48 w-28 h-72 bg-gradient-to-t from-gray-800 to-gray-600 transform -skew-x-1" />
          <div className="absolute bottom-0 left-72 w-36 h-96 bg-gradient-to-t from-gray-600 to-gray-500" />
          <div className="absolute bottom-0 left-96 w-24 h-56 bg-gradient-to-t from-gray-700 to-gray-600 transform skew-x-1" />
        </div>
        
        {/* City Silhouette Layer 2 - Mid Buildings */}
        <div className="absolute bottom-0 right-0 w-full h-4/5 opacity-80">
          <div className="absolute bottom-0 right-0 w-28 h-72 bg-gradient-to-t from-gray-600 to-gray-500 transform -skew-x-2" />
          <div className="absolute bottom-0 right-24 w-40 h-88 bg-gradient-to-t from-gray-700 to-gray-500" />
          <div className="absolute bottom-0 right-56 w-32 h-76 bg-gradient-to-t from-gray-600 to-gray-400 transform skew-x-1" />
          <div className="absolute bottom-0 right-80 w-36 h-84 bg-gradient-to-t from-gray-700 to-gray-500" />
        </div>
        
        {/* Neon Building Lights */}
        <div className="absolute bottom-20 left-8 w-1 h-12 bg-cyan-400 animate-pulse opacity-80" />
        <div className="absolute bottom-32 left-12 w-1 h-8 bg-pink-400 animate-pulse opacity-70" />
        <div className="absolute bottom-28 left-52 w-1 h-10 bg-green-400 animate-pulse opacity-75" />
        <div className="absolute bottom-36 left-76 w-1 h-14 bg-purple-400 animate-pulse opacity-80" />
        <div className="absolute bottom-40 left-100 w-1 h-6 bg-orange-400 animate-pulse opacity-70" />
        
        {/* Right side neon lights */}
        <div className="absolute bottom-24 right-8 w-1 h-16 bg-blue-400 animate-pulse opacity-80" />
        <div className="absolute bottom-44 right-28 w-1 h-12 bg-red-400 animate-pulse opacity-75" />
        <div className="absolute bottom-30 right-60 w-1 h-18 bg-yellow-400 animate-pulse opacity-70" />
        <div className="absolute bottom-48 right-84 w-1 h-10 bg-green-400 animate-pulse opacity-80" />
        
        {/* Window Lights Pattern */}
        <div className="absolute bottom-32 left-24 w-0.5 h-1 bg-yellow-200 opacity-60" />
        <div className="absolute bottom-40 left-24 w-0.5 h-1 bg-yellow-200 opacity-60" />
        <div className="absolute bottom-48 left-24 w-0.5 h-1 bg-yellow-200 opacity-60" />
        <div className="absolute bottom-56 left-28 w-0.5 h-1 bg-white opacity-40" />
        <div className="absolute bottom-64 left-28 w-0.5 h-1 bg-white opacity-40" />
        
        {/* More scattered window lights */}
        <div className="absolute bottom-36 left-56 w-0.5 h-1 bg-cyan-200 opacity-50" />
        <div className="absolute bottom-52 left-56 w-0.5 h-1 bg-cyan-200 opacity-50" />
        <div className="absolute bottom-44 left-80 w-0.5 h-1 bg-purple-200 opacity-50" />
        <div className="absolute bottom-60 left-80 w-0.5 h-1 bg-purple-200 opacity-50" />
        
        {/* Right side windows */}
        <div className="absolute bottom-40 right-32 w-0.5 h-1 bg-orange-200 opacity-50" />
        <div className="absolute bottom-56 right-32 w-0.5 h-1 bg-orange-200 opacity-50" />
        <div className="absolute bottom-48 right-64 w-0.5 h-1 bg-pink-200 opacity-50" />
        <div className="absolute bottom-68 right-64 w-0.5 h-1 bg-pink-200 opacity-50" />
        
        {/* Atmospheric Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-pink-500/5" />
        
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Unity-style Game Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Unity-style Top HUD */}
        <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-orange-400 relative">
          {/* Unity-style corner decorations */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-orange-400"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-400"></div>
          
          <div className="flex items-center justify-between h-full px-8">
            
            {/* Game Logo & Title */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 bg-black border border-orange-400 flex items-center justify-center relative">
                  <img src={AshinaImage} alt="Lemmi" className="w-10 h-10 object-contain" />
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-400"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-orbitron font-black text-orange-400 tracking-widest">
                  LEMMI RUN
                </h1>
                <p className="text-sm font-mono text-orange-300/80 tracking-wider">CARDANO GAMING SYSTEM</p>
              </div>
            </div>
            
            {/* Center HUD - Game Stats */}
            <div className="flex items-center space-x-6">
              <div className="bg-black border border-green-400 px-4 py-2 min-w-[180px] relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-green-400 tracking-wider">STATUS</span>
                  <span className="text-xs font-mono text-green-300 font-bold">{terminalText}</span>
                </div>
              </div>
              
              <div className="bg-black border border-blue-400 px-4 py-2 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-blue-400 tracking-wider">LVL</span>
                  <span className="text-lg font-mono text-blue-300 font-bold">01</span>
                </div>
              </div>
              
              <div className="bg-black border border-purple-400 px-4 py-2 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400"></div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-purple-400 tracking-wider">PTS</span>
                  <span className="text-lg font-mono text-purple-300 font-bold">0000</span>
                </div>
              </div>
            </div>
            
            {/* Wallet HUD */}
            <WalletConnect 
              onConnect={connectWallet}
              isConnected={isConnected}
              address={walletAddress}
              hasNft={hasGerbilNft}
            />
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Unity-style Game Menu */}
          <div className="w-full md:w-80 bg-black border-r-2 border-orange-400 relative">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-400"></div>
            
            <div className="p-6">
              <div className="mb-8">
                <div className="bg-black border border-orange-400 px-4 py-3 relative">
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
                  <h3 className="font-orbitron font-bold text-orange-400 text-center tracking-widest">GAME SYSTEMS</h3>
                </div>
                <div className="mt-2 text-center text-xs font-mono text-orange-300/60">NEURAL INTERFACE v2.1</div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setActiveScreen('main')}
                  className={`w-full bg-black border font-orbitron transition-all duration-200 relative ${
                    activeScreen === 'main' 
                      ? 'border-orange-400 text-orange-300 bg-orange-900/20' 
                      : 'border-gray-600 text-gray-400 hover:border-orange-400 hover:text-orange-400'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="px-6 py-4 flex items-center space-x-4">
                    {activeScreen === 'main' && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
                      </>
                    )}
                    <div className="text-xl">🎮</div>
                    <div className="text-left">
                      <div className="font-bold tracking-wider">MAIN HUB</div>
                      <div className="text-xs opacity-70 font-mono">System Control</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('inventory')}
                  className={`w-full bg-black border font-orbitron transition-all duration-200 relative ${
                    activeScreen === 'inventory' 
                      ? 'border-purple-400 text-purple-300 bg-purple-900/20' 
                      : 'border-gray-600 text-gray-400 hover:border-purple-400 hover:text-purple-400'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="px-6 py-4 flex items-center space-x-4">
                    {activeScreen === 'inventory' && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400"></div>
                      </>
                    )}
                    <div className="text-xl">💎</div>
                    <div className="text-left">
                      <div className="font-bold tracking-wider">INVENTORY</div>
                      <div className="text-xs opacity-70 font-mono">Asset Management</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => window.location.href = '/game'}
                  className="w-full bg-black border font-orbitron transition-all duration-200 relative border-green-400 text-green-400 hover:bg-green-900/20"
                  onMouseEnter={playHover}
                >
                  <div className="px-6 py-4 flex items-center space-x-4">
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                    <div className="text-xl">🎯</div>
                    <div className="text-left">
                      <div className="font-bold tracking-wider">START GAME</div>
                      <div className="text-xs opacity-70 font-mono">Lemmi Run Arena</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('skills')}
                  className={`w-full bg-black border font-orbitron transition-all duration-200 relative ${
                    activeScreen === 'skills' 
                      ? 'border-cyan-400 text-cyan-300 bg-cyan-900/20' 
                      : 'border-gray-600 text-gray-400 hover:border-cyan-400 hover:text-cyan-400'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="px-6 py-4 flex items-center space-x-4">
                    {activeScreen === 'skills' && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400"></div>
                      </>
                    )}
                    <div className="text-xl">⚡</div>
                    <div className="text-left">
                      <div className="font-bold tracking-wider">SKILL TREE</div>
                      <div className="text-xs opacity-70 font-mono">Power Upgrades</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('network')}
                  className={`w-full bg-black border font-orbitron transition-all duration-200 relative ${
                    activeScreen === 'network' 
                      ? 'border-blue-400 text-blue-300 bg-blue-900/20' 
                      : 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="px-6 py-4 flex items-center space-x-4">
                    {activeScreen === 'network' && (
                      <>
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400"></div>
                      </>
                    )}
                    <div className="text-xl">🌐</div>
                    <div className="text-left">
                      <div className="font-bold tracking-wider">NETWORK</div>
                      <div className="text-xs opacity-70 font-mono">Social System</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Unity Game Main Area */}
          <div className="flex-1 bg-gradient-to-br from-black/90 via-gray-900/80 to-black/90 backdrop-blur-md">
            
            {activeScreen === 'main' && (
              <div className="p-4 md:p-6 h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
                  
                  {/* Player Access Panel */}
                  <div className="group bg-gradient-to-br from-green-900/20 to-black/60 rounded-xl border-2 border-green-500/30 p-4 md:p-6 min-h-[220px] hover:border-green-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <h3 className="font-orbitron font-bold text-green-400">PLAYER ACCESS</h3>
                    </div>
                    <NeuralFeatureCard 
                      title="ACCESS CONTROL"
                      subtitle="Gerbil NFT Verification"
                      icon="🐹"
                      status={hasGerbilNft}
                      walletAddress={walletAddress}
                      gradientFrom="cyber-green"
                      gradientTo="cyber-cyan"
                      delay={0}
                    />
                  </div>
                  
                  {/* Currency Panel */}
                  <div className="group bg-gradient-to-br from-purple-900/20 to-black/60 rounded-xl border-2 border-purple-500/30 p-4 md:p-6 min-h-[220px] hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
                      <h3 className="font-orbitron font-bold text-purple-400">CURRENCY</h3>
                    </div>
                    <TokenDisplay walletAddress={walletAddress} />
                  </div>
                  
                  {/* Special Mode Panel */}
                  <div className="group bg-gradient-to-br from-red-900/20 to-black/60 rounded-xl border-2 border-red-500/30 p-4 md:p-6 min-h-[220px] hover:border-red-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                      <h3 className="font-orbitron font-bold text-red-400">CHAOS MODE</h3>
                    </div>
                    <DegenModeToggle onActivateMiniGame={() => setShowMiniGame(true)} />
                  </div>
                  
                  {/* Character Collection Panel */}
                  <div className="group bg-gradient-to-br from-orange-900/20 to-black/60 rounded-xl border-2 border-orange-500/30 p-4 md:p-6 min-h-[220px] hover:border-orange-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
                      <h3 className="font-orbitron font-bold text-orange-400">COLLECTION</h3>
                    </div>
                    <KingLemmiViewer walletAddress={walletAddress} />
                  </div>
                </div>
              </div>
            )}

            {activeScreen === 'inventory' && (
              <div className="p-6 h-full overflow-y-auto">
                <h2 className="text-2xl font-orbitron text-purple-400 mb-6">🎮 DIGITAL INVENTORY</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* NFT Collection */}
                  <div className="bg-black/60 rounded-lg border-2 border-purple-500/50 p-4">
                    <h3 className="text-xl font-orbitron text-orange-400 mb-4">🐹 GERBIL NFT COLLECTION</h3>
                    <GerbilNftGallery walletAddress={walletAddress} />
                  </div>
                  
                  {/* Token Display */}
                  <div className="bg-black/60 rounded-lg border-2 border-green-500/50 p-4">
                    <h3 className="text-xl font-orbitron text-green-400 mb-4">💰 TOKEN ASSETS</h3>
                    <TokenDisplay walletAddress={walletAddress} />
                  </div>
                </div>
              </div>
            )}

            {activeScreen === 'skills' && (
              <div className="p-6 h-full">
                <h2 className="text-2xl font-orbitron text-cyber-green mb-6">NEURAL SKILLS</h2>
                <SkillRewardPanel walletAddress={walletAddress} />
              </div>
            )}

            {activeScreen === 'network' && (
              <div className="p-6 h-full overflow-y-auto">
                <h2 className="text-2xl font-orbitron text-blue-400 mb-6">🌐 BLOCKCHAIN NETWORK</h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Transaction Tracker */}
                  <div className="bg-black/60 rounded-lg border-2 border-blue-500/50 p-4">
                    <h3 className="text-xl font-orbitron text-cyan-400 mb-4">🔗 CARDANO TRANSACTIONS</h3>
                    <CardanoTransactionTracker walletAddress={walletAddress} />
                  </div>
                  
                  {/* Referral Network */}
                  <div className="bg-black/60 rounded-lg border-2 border-yellow-500/50 p-4">
                    <h3 className="text-xl font-orbitron text-yellow-400 mb-4">👥 REFERRAL NETWORK</h3>
                    <ReferralPanel walletAddress={walletAddress} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Quick Stats (Hidden on mobile) */}
          <div className="hidden lg:block w-80 border-l-2 border-cyber-cyan/30 bg-black/90 backdrop-blur-sm">
            <div className="p-4">
              <h3 className="font-orbitron text-cyber-cyan mb-4">NEURAL STATUS</h3>
              
              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="bg-black/70 rounded border border-cyber-green/30 p-3">
                  <div className="text-xs font-mono text-cyber-green mb-1">CONNECTION STATUS</div>
                  <div className="text-sm font-bold">{isConnected ? 'ONLINE' : 'OFFLINE'}</div>
                </div>
                
                <div className="bg-black/70 rounded border border-cyber-cyan/30 p-3">
                  <div className="text-xs font-mono text-cyber-cyan mb-1">ACTIVE PATHWAYS</div>
                  <div className="text-sm font-bold">{activeFeaturesCount}/7</div>
                </div>
                
                <div className="bg-black/70 rounded border border-cyber-magenta/30 p-3">
                  <div className="text-xs font-mono text-cyber-magenta mb-1">NFT STATUS</div>
                  <div className="text-sm font-bold">{hasGerbilNft ? 'VERIFIED' : 'UNVERIFIED'}</div>
                </div>
              </div>

              {/* Jack In Button */}
              <div className="mt-8">
                <button 
                  className={`w-full px-4 py-6 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-green rounded-lg font-orbitron font-bold text-sm transition-all duration-300 ${
                    canJackIn ? 'hover:animate-glow cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={!canJackIn}
                  onClick={() => {
                    if (canJackIn) {
                      playClick();
                    }
                  }}
                  onMouseEnter={playHover}
                >
                  JACK IN
                  <br />
                  <span className="text-xs opacity-70">NEURAL NETWORK</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Game Modal */}
      {showMiniGame && (
        <MiniGameTikus onClose={() => setShowMiniGame(false)} walletAddress={walletAddress} />
      )}

      {/* Mobile Game Button */}
      <div className="lg:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <button 
          className={`px-8 py-3 bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 rounded-full font-orbitron font-bold text-sm transition-all duration-300 shadow-lg ${
            canJackIn ? 'hover:scale-105 cursor-pointer animate-pulse' : 'opacity-50 cursor-not-allowed'
          }`}
          disabled={!canJackIn}
          onClick={() => {
            if (canJackIn) {
              playClick();
            }
          }}
          onMouseEnter={playHover}
        >
          🏃 START GAME ({activeFeaturesCount}/4)
        </button>
      </div>

      {/* Game Character Helper */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="relative group cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 p-1 animate-bounce">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-orange-400/50 group-hover:scale-110 transition-transform">
              <span className="text-xl">🐹</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-black/90 text-orange-300 text-xs font-mono px-2 py-1 rounded border border-orange-500/50 whitespace-nowrap">
              Gerbil Guide 🐹
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
