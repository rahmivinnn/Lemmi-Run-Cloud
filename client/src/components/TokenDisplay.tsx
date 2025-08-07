import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface TokenDisplayProps {
  walletAddress: string | null;
}

export default function TokenDisplay({ walletAddress }: TokenDisplayProps) {
  const { playClick, playHover } = useAudio();

  const { data: tokenData, refetch, isLoading } = useQuery({
    queryKey: ["/api/wallet", walletAddress, "lemmi"],
    enabled: !!walletAddress,
    refetchInterval: 30000,
  });

  const handleRefreshBalance = async () => {
    playClick();
    await refetch();
  };

  const balance = tokenData?.balance || 0;
  const lastUpdate = new Date().toLocaleTimeString();

  return (
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-cyber-magenta/5 transition-all duration-300 animate-float"
      style={{ animationDelay: "-1s" }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-magenta to-cyber-gold p-0.5">
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg">💎</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-cyber-magenta">$LEMMI BALANCE</h3>
            <p className="text-xs text-gray-400">Token Payment System</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-cyber-gold">
            {isLoading ? "..." : balance.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">$LEMMI</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
          <span className="text-cyber-cyan">LAST_UPDATE:</span> 
          <span className="ml-2">{lastUpdate}</span>
        </div>
        <Button 
          onClick={handleRefreshBalance}
          disabled={isLoading}
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-cyber-magenta/10 transition-all"
          onMouseEnter={playHover}
        >
          {isLoading ? "REFRESHING..." : "REFRESH BALANCE"}
        </Button>
      </div>
    </div>
  );
}
