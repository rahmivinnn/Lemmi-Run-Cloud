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

  const balance = (tokenData as any)?.balance || 0;
  const lastUpdate = new Date().toLocaleTimeString();

  return (
    <div className="h-full">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-cyber-magenta to-cyber-gold p-0.5">
          <div className="w-full h-full rounded bg-black flex items-center justify-center">
            <span className="text-2xl">💎</span>
          </div>
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-cyber-magenta">$LEMMI TOKENS</h3>
          <p className="text-xs text-gray-400">Digital Currency</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-black/50 rounded border border-cyber-magenta/20 p-4 text-center">
          <div className="text-3xl font-mono font-bold text-cyber-gold mb-1">
            {isLoading ? "..." : balance.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">$LEMMI</div>
        </div>
        
        <div className="bg-black/50 rounded border border-cyber-cyan/20 p-3">
          <div className="font-mono text-xs text-cyber-cyan mb-1">LAST UPDATE</div>
          <div className="text-sm font-bold">{lastUpdate}</div>
        </div>
        
        <Button 
          onClick={handleRefreshBalance}
          disabled={isLoading}
          className="w-full bg-cyber-magenta/20 border border-cyber-magenta/50 rounded px-3 py-2 text-sm font-mono hover:bg-cyber-magenta/30 transition-all text-cyber-magenta"
          onMouseEnter={playHover}
        >
          {isLoading ? "SYNCING..." : "REFRESH BALANCE"}
        </Button>
      </div>
    </div>
  );
}
