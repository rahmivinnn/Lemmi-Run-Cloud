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
import { useWallet } from "@/hooks/useWallet";
import { useAudio } from "@/hooks/useAudio";

export default function NeuralInterface() {
  const [showMiniGame, setShowMiniGame] = useState(false);
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
    (features.freeAccess ? 1 : 0) + 
    (features.lemmiBalance > 0 ? 1 : 0) + 
    (features.skillRewards.efficiency > 50 ? 1 : 0) +
    (features.referralCount > 0 ? 1 : 0) : 0;

  const canJackIn = activeFeaturesCount >= 3;

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Parallax Background */}
      <div className="fixed inset-0 z-0">
        {/* Cyberpunk cityscape background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay" />
        
        {/* Animated scanline */}
        <div className="scanline-overlay absolute inset-0" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="w-2 h-2 bg-cyber-cyan rounded-full absolute top-1/4 left-1/4 animate-float opacity-60" />
          <div className="w-1 h-1 bg-cyber-magenta rounded-full absolute top-1/3 right-1/3 animate-float opacity-40" style={{ animationDelay: '-2s' }} />
          <div className="w-3 h-3 bg-cyber-green rounded-full absolute bottom-1/4 left-1/3 animate-float opacity-30" style={{ animationDelay: '-4s' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="p-6 border-b border-cyber-cyan/20">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-magenta p-0.5">
                <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
                  <span className="text-2xl font-orbitron font-bold">🧠</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyber-cyan to-cyber-magenta bg-clip-text text-transparent">
                  NEURAL INTERFACE
                </h1>
                <p className="text-sm font-mono text-cyber-cyan/70">Lemmi Protocol v2.1.0</p>
              </div>
            </div>
            
            <WalletConnect 
              onConnect={connectWallet}
              isConnected={isConnected}
              address={walletAddress}
              hasNft={hasGerbilNft}
            />
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="container mx-auto p-6">
          {/* Status Terminal */}
          <div className="glass-morph rounded-lg p-6 mb-8 neon-border">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
              <span className="font-mono text-cyber-green">NEURAL_INTERFACE_STATUS</span>
            </div>
            <div className="font-mono text-sm">
              <div className="terminal-text inline-block">
                {terminalText}
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <NeuralFeatureCard 
              title="FREE ACCESS"
              subtitle="Gerbil NFT Holders"
              icon="🐹"
              status={hasGerbilNft}
              walletAddress={walletAddress}
              gradientFrom="cyber-green"
              gradientTo="cyber-cyan"
              delay={0}
            />

            <TokenDisplay walletAddress={walletAddress} />

            <SkillRewardPanel walletAddress={walletAddress} />

            <ReferralPanel walletAddress={walletAddress} />

            <DegenModeToggle onActivateMiniGame={() => setShowMiniGame(true)} />

            <KingLemmiViewer walletAddress={walletAddress} />
          </div>

          {/* Monetization Hub */}
          <div className="glass-morph rounded-lg p-6 mb-8 neon-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-orbitron font-bold bg-gradient-to-r from-cyber-cyan to-cyber-gold bg-clip-text text-transparent">
                  MONETIZATION HUB
                </h2>
                <p className="text-sm text-gray-400 font-mono">Long-term Infrastructure • Status: READY</p>
              </div>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-cyber-green/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs">💼</span>
                </div>
                <div className="w-8 h-8 bg-cyber-magenta/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs">🏢</span>
                </div>
                <div className="w-8 h-8 bg-cyber-cyan/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs">🌐</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-cyber-dark/30 rounded-lg p-4 border border-cyber-green/20">
                <h4 className="font-orbitron font-bold text-cyber-green mb-2">BRAND PARTNERSHIPS</h4>
                <p className="text-sm text-gray-400">Enterprise integration ready</p>
              </div>
              <div className="bg-cyber-dark/30 rounded-lg p-4 border border-cyber-magenta/20">
                <h4 className="font-orbitron font-bold text-cyber-magenta mb-2">NFT MARKETPLACE</h4>
                <p className="text-sm text-gray-400">Custom skin trading platform</p>
              </div>
              <div className="bg-cyber-dark/30 rounded-lg p-4 border border-cyber-cyan/20">
                <h4 className="font-orbitron font-bold text-cyber-cyan mb-2">API ECOSYSTEM</h4>
                <p className="text-sm text-gray-400">Developer-friendly integration</p>
              </div>
            </div>
          </div>

          {/* Jack In Button */}
          <div className="text-center">
            <button 
              className={`group relative px-12 py-4 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-green rounded-lg font-orbitron font-bold text-xl transition-all duration-300 ${
                canJackIn ? 'hover:animate-glow cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
              disabled={!canJackIn}
              onClick={() => {
                if (canJackIn) {
                  playClick();
                  // Implement jack in functionality
                }
              }}
              onMouseEnter={playHover}
            >
              <span className="relative z-10">JACK INTO THE NEURAL NETWORK</span>
              <div className={`absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-green opacity-20 rounded-lg blur-xl transition-opacity ${
                canJackIn ? 'group-hover:opacity-40' : ''
              }`} />
            </button>
            <p className="text-sm text-gray-400 mt-2 font-mono">
              {activeFeaturesCount}/7 neural pathways synchronized
            </p>
          </div>
        </main>

        {/* Mini Game Modal */}
        {showMiniGame && (
          <MiniGameTikus onClose={() => setShowMiniGame(false)} walletAddress={walletAddress} />
        )}
      </div>

      {/* Animated Lemmi Character (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-gold to-cyber-magenta p-1 animate-float">
          <div className="w-full h-full rounded-full bg-cyber-dark flex items-center justify-center border-2 border-cyber-cyan/30">
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
              alt="Animated Lemmi character" 
              className="w-12 h-12 rounded-full object-cover animate-pulse-slow" 
            />
          </div>
        </div>
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyber-green rounded-full animate-ping" />
      </div>
    </div>
  );
}
