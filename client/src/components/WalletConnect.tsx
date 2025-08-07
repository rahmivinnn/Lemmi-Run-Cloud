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
      <div className="flex items-center space-x-3">
        <div className="bg-black/70 border border-orange-500/50 rounded px-3 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-mono text-orange-300">
              LACE: {address.slice(0, 8)}...{address.slice(-6)}
            </span>
          </div>
        </div>
        {hasNft && (
          <div className="text-xs text-cyber-green font-mono bg-cyber-green/10 px-2 py-1 rounded">
            ✅ GERBIL
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-orange-500/20 border border-orange-500/50 hover:bg-orange-500/30 text-orange-300 font-orbitron px-6 py-2 transition-all"
      onMouseEnter={playHover}
    >
      {isConnecting ? 'CONNECTING...' : '🟠 CONNECT LACE'}
    </Button>
  );
}
