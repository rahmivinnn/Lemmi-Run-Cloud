import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface NeuralFeatureCardProps {
  title: string;
  subtitle: string;
  icon: string;
  status: boolean;
  walletAddress: string | null;
  gradientFrom: string;
  gradientTo: string;
  delay: number;
}

export default function NeuralFeatureCard({ 
  title, 
  subtitle, 
  icon, 
  status, 
  walletAddress,
  gradientFrom,
  gradientTo,
  delay 
}: NeuralFeatureCardProps) {
  const { playClick, playHover } = useAudio();

  const { data: nftData, refetch } = useQuery({
    queryKey: ["/api/wallet", walletAddress, "nfts"],
    enabled: !!walletAddress,
  });

  const handleVerifyNFT = async () => {
    playClick();
    if (walletAddress) {
      await refetch();
    }
  };

  return (
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-cyber-cyan/5 transition-all duration-300 animate-float"
      style={{ animationDelay: `${delay}s` }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-${gradientFrom} to-${gradientTo} p-0.5`}>
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg">{icon}</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-cyber-green">{title}</h3>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full animate-pulse ${status ? 'bg-cyber-green' : 'bg-gray-500'}`} />
      </div>
      
      <div className="space-y-2">
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
          <span className="text-cyber-cyan">NFT_COUNT:</span> 
          <span className="ml-2">
            {nftData?.hasGerbilNft ? "1 Gerbil" : "0 NFTs"}
          </span>
        </div>
        <Button 
          onClick={handleVerifyNFT}
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-cyber-green/10 transition-all"
          onMouseEnter={playHover}
        >
          VERIFY OWNERSHIP
        </Button>
      </div>
    </div>
  );
}
