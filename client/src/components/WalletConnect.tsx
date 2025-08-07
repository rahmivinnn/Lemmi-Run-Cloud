import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface WalletConnectProps {
  onConnect: () => Promise<void>;
  isConnected: boolean;
  address: string | null;
  hasNft: boolean;
}

export default function WalletConnect({ onConnect, isConnected, address, hasNft }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { playClick, playHover } = useAudio();

  const handleConnect = async () => {
    setIsConnecting(true);
    playClick();
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        {/* Unity-style Status Panel */}
        <div className="bg-gradient-to-r from-green-900/80 to-black/80 border-2 border-green-400/60 rounded-lg px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-400/30 animate-ping" />
            </div>
            <div>
              <div className="text-xs font-orbitron text-green-400 font-bold">LACE CONNECTED</div>
              <div className="text-xs font-mono text-green-300/80">
                {address.slice(0, 12)}...{address.slice(-8)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Unity-style NFT Badge */}
        {hasNft && (
          <div className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 border-2 border-purple-400/60 rounded-lg px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs font-orbitron text-purple-300 font-bold">🐹 GERBIL VERIFIED</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="relative bg-gradient-to-r from-orange-600/20 to-red-600/20 border-2 border-orange-400/60 hover:border-orange-300 text-orange-300 font-orbitron font-bold px-8 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 rounded-lg backdrop-blur-sm"
      onMouseEnter={playHover}
    >
      <div className="flex items-center space-x-3">
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border-2 border-orange-300 border-t-transparent rounded-full animate-spin" />
            <span>CONNECTING TO LACE...</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
            <span>🔗 CONNECT LACE WALLET</span>
          </>
        )}
      </div>
      
      {/* Unity-style glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400/0 via-orange-400/10 to-orange-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </Button>
  );
}
