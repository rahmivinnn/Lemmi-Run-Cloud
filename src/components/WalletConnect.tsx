import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { useGameNotifications, createSuccessNotification, createErrorNotification } from "@/components/GameNotification";

interface WalletConnectProps {
  onConnect: () => Promise<void>;
  isConnected: boolean;
  address: string | null;
  hasNft: boolean;
}

export default function WalletConnect({ onConnect, isConnected, address, hasNft }: WalletConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const { playClick, playHover } = useAudio();
  const { addNotification } = useGameNotifications();

  const handleConnect = async () => {
    setIsConnecting(true);
    playClick();
    try {
      await onConnect();
      addNotification(createSuccessNotification(
        "Wallet Connected!",
        "Lace wallet successfully connected to LEMMI RUN"
      ));
    } catch (error) {
      addNotification(createErrorNotification(
        "Connection Failed",
        "Failed to connect Lace wallet. Please try again."
      ));
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-3">
        {/* Unity-style Status Panel */}
        <div className="bg-black border border-green-400 px-4 py-2 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400"></div>
            <div>
              <div className="text-xs font-orbitron text-green-400 font-bold tracking-wider">LACE ONLINE</div>
              <div className="text-xs font-mono text-green-300/80">
                {address.slice(0, 8)}...{address.slice(-6)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Unity-style NFT Badge */}
        {hasNft && (
          <div className="bg-black border border-purple-400 px-3 py-2 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400"></div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400"></div>
              <span className="text-xs font-orbitron text-purple-300 font-bold tracking-wider">GERBIL VERIFIED</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={handleConnect}
      className={`bg-black border border-orange-400 px-6 py-3 cursor-pointer transition-all duration-200 relative ${
        isConnecting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-orange-900/20'
      }`}
      onMouseEnter={playHover}
    >
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
      <div className="flex items-center space-x-3">
        {isConnecting ? (
          <>
            <div className="w-4 h-4 border border-orange-300 border-t-transparent animate-spin"></div>
            <span className="font-orbitron text-orange-300 font-bold tracking-wider">CONNECTING...</span>
          </>
        ) : (
          <>
            <div className="w-3 h-3 bg-orange-400"></div>
            <span className="font-orbitron text-orange-300 font-bold tracking-wider">CONNECT LACE</span>
          </>
        )}
      </div>
    </div>
  );
}
