import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface WalletConnectProps {
  onConnect: (chain: 'ethereum' | 'solana') => Promise<void>;
  isConnected: boolean;
  address: string | null;
  hasNft: boolean;
}

export default function WalletConnect({ onConnect, isConnected, address, hasNft }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { playClick, playHover } = useAudio();

  const handleConnect = async (chain: 'ethereum' | 'solana') => {
    setIsConnecting(true);
    playClick();
    try {
      await onConnect(chain);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="glass-morph rounded-lg p-3 neon-border">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full animate-pulse ${hasNft ? 'bg-cyber-green' : 'bg-cyber-cyan'}`} />
            <span className="text-sm font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>
        {hasNft && (
          <div className="text-xs text-cyber-green font-mono">
            ✅ GERBIL NFT
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => handleConnect('ethereum')}
        disabled={isConnecting}
        className="glass-morph rounded-lg px-4 py-2 neon-border hover:bg-cyber-cyan/10 transition-all duration-300 hover:animate-glow"
        onMouseEnter={playHover}
      >
        <span className="font-orbitron text-sm">
          {isConnecting ? 'CONNECTING...' : 'METAMASK'}
        </span>
      </Button>
      
      <Button
        onClick={() => handleConnect('solana')}
        disabled={isConnecting}
        className="glass-morph rounded-lg px-4 py-2 neon-border hover:bg-purple-500/10 transition-all duration-300 hover:animate-glow"
        onMouseEnter={playHover}
      >
        <span className="font-orbitron text-sm">
          {isConnecting ? 'CONNECTING...' : 'PHANTOM'}
        </span>
      </Button>
    </div>
  );
}
