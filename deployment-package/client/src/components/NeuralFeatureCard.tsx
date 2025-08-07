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
    <div className="h-full">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-cyber-green to-cyber-cyan p-0.5">
          <div className="w-full h-full rounded bg-black flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-cyber-green">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
        <div className="ml-auto">
          <div className={`w-4 h-4 rounded-full animate-pulse ${status ? 'bg-cyber-green' : 'bg-red-500'}`} />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-black/50 rounded border border-cyber-green/20 p-3">
          <div className="font-mono text-xs text-cyber-green mb-1">NFT VERIFICATION</div>
          <div className="text-sm font-bold">
            {(nftData as any)?.hasGerbilNft ? "✅ GERBIL DETECTED" : "❌ NO NFT FOUND"}
          </div>
        </div>
        
        <div className="bg-black/50 rounded border border-cyber-cyan/20 p-3">
          <div className="font-mono text-xs text-cyber-cyan mb-1">ACCESS LEVEL</div>
          <div className="text-sm font-bold">{status ? "PREMIUM" : "GUEST"}</div>
        </div>
        
        <Button 
          onClick={handleVerifyNFT}
          className="w-full bg-cyber-green/20 border border-cyber-green/50 rounded px-3 py-2 text-sm font-mono hover:bg-cyber-green/30 transition-all text-cyber-green"
          onMouseEnter={playHover}
        >
          SCAN WALLET
        </Button>
      </div>
    </div>
  );
}
