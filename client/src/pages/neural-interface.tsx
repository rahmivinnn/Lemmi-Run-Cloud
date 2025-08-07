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
      {/* Game-style Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 grid-overlay" />
        <div className="scanline-overlay absolute inset-0" />
      </div>

      {/* Unity-style Game Layout */}
      <div className="relative z-10 min-h-screen flex flex-col">
        
        {/* Top HUD Bar */}
        <div className="h-20 border-b-2 border-cyber-cyan/30 bg-black/90 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-6">
            {/* Left: Game Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded bg-gradient-to-br from-cyber-cyan to-cyber-magenta p-0.5">
                <div className="w-full h-full rounded bg-black flex items-center justify-center">
                  <span className="text-2xl">🧠</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-orbitron font-bold text-cyber-cyan">NEURAL INTERFACE</h1>
                <p className="text-xs font-mono text-gray-400">v2.1.0</p>
              </div>
            </div>
            
            {/* Center: Status Display */}
            <div className="flex-1 mx-8">
              <div className="bg-black/70 rounded border border-cyber-green/30 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse" />
                  <span className="font-mono text-xs text-cyber-green">{terminalText}</span>
                </div>
              </div>
            </div>
            
            {/* Right: Wallet */}
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
          
          {/* Left Sidebar - Navigation */}
          <div className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-cyber-cyan/30 bg-black/90 backdrop-blur-sm">
            <div className="p-4 space-y-2">
              <h3 className="font-orbitron text-cyber-cyan mb-4 text-center md:text-left">NEURAL MODULES</h3>
              
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <button 
                  onClick={() => setActiveScreen('main')}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded border font-mono transition-all ${
                    activeScreen === 'main' 
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan' 
                      : 'border-gray-600 text-gray-400 hover:border-cyber-cyan/50'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span>🏠</span>
                    <span className="hidden md:inline">DASHBOARD</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('inventory')}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded border font-mono transition-all ${
                    activeScreen === 'inventory' 
                      ? 'bg-cyber-magenta/20 border-cyber-magenta text-cyber-magenta' 
                      : 'border-gray-600 text-gray-400 hover:border-cyber-magenta/50'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span>💎</span>
                    <span className="hidden md:inline">ASSETS</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('skills')}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded border font-mono transition-all ${
                    activeScreen === 'skills' 
                      ? 'bg-cyber-green/20 border-cyber-green text-cyber-green' 
                      : 'border-gray-600 text-gray-400 hover:border-cyber-green/50'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span>⚡</span>
                    <span className="hidden md:inline">SKILLS</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => setActiveScreen('network')}
                  className={`flex-1 md:w-full text-left px-4 py-3 rounded border font-mono transition-all ${
                    activeScreen === 'network' 
                      ? 'bg-cyber-gold/20 border-cyber-gold text-cyber-gold' 
                      : 'border-gray-600 text-gray-400 hover:border-cyber-gold/50'
                  }`}
                  onMouseEnter={playHover}
                >
                  <div className="flex items-center justify-center md:justify-start space-x-2">
                    <span>🔗</span>
                    <span className="hidden md:inline">NETWORK</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Screen Area */}
          <div className="flex-1 bg-black/80 backdrop-blur-sm">
            
            {activeScreen === 'main' && (
              <div className="p-3 md:p-6 h-full overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 h-full">
                  
                  {/* Access Control */}
                  <div className="bg-black/70 rounded-lg border-2 border-cyber-green/30 p-4 md:p-6 min-h-[200px] md:min-h-[250px]">
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
                  
                  {/* Token Balance */}
                  <div className="bg-black/70 rounded-lg border-2 border-cyber-magenta/30 p-4 md:p-6 min-h-[200px] md:min-h-[250px]">
                    <TokenDisplay walletAddress={walletAddress} />
                  </div>
                  
                  {/* Degen Mode */}
                  <div className="bg-black/70 rounded-lg border-2 border-red-500/30 p-4 md:p-6 min-h-[200px] md:min-h-[250px]">
                    <DegenModeToggle onActivateMiniGame={() => setShowMiniGame(true)} />
                  </div>
                  
                  {/* King Lemmi */}
                  <div className="bg-black/70 rounded-lg border-2 border-purple-500/30 p-4 md:p-6 min-h-[200px] md:min-h-[250px]">
                    <KingLemmiViewer walletAddress={walletAddress} />
                  </div>
                </div>
              </div>
            )}

            {activeScreen === 'inventory' && (
              <div className="p-6 h-full">
                <h2 className="text-2xl font-orbitron text-cyber-magenta mb-6">DIGITAL ASSETS</h2>
                <div className="grid grid-cols-1 gap-6">
                  <TokenDisplay walletAddress={walletAddress} />
                  <KingLemmiViewer walletAddress={walletAddress} />
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
              <div className="p-6 h-full">
                <h2 className="text-2xl font-orbitron text-cyber-gold mb-6">NETWORK HUB</h2>
                <ReferralPanel walletAddress={walletAddress} />
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

      {/* Mobile Jack In Button (Shows only on mobile) */}
      <div className="lg:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <button 
          className={`px-8 py-4 bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-green rounded-full font-orbitron font-bold text-sm transition-all duration-300 ${
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
          JACK IN ({activeFeaturesCount}/7)
        </button>
      </div>

      {/* Floating Lemmi Assistant */}
      <div className="fixed bottom-6 right-6 z-20">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyber-gold to-cyber-magenta p-1 animate-float">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-cyber-cyan/30 cursor-pointer hover:scale-110 transition-transform">
            <span className="text-2xl animate-pulse-slow">🤖</span>
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-green rounded-full animate-ping" />
      </div>
    </div>
  );
}
