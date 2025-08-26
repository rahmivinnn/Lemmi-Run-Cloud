import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ReferralPanelProps {
  walletAddress: string | null;
}

export default function ReferralPanel({ walletAddress }: ReferralPanelProps) {
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const { playClick, playHover, playSuccess } = useAudio();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: referralData } = useQuery({
    queryKey: ["/api/referral", walletAddress],
    enabled: !!walletAddress,
  });

  const generateReferralMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/referral", { walletAddress });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedLink(data.link);
      playSuccess();
      toast({
        title: "Referral Link Generated!",
        description: `Code: ${data.code}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/referral", walletAddress] });
    },
  });

  const handleGenerateLink = () => {
    playClick();
    if (walletAddress) {
      generateReferralMutation.mutate();
    }
  };

  const handleCopyLink = () => {
    playClick();
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const totalReferred = (referralData as any)?.totalReferred || 0;

  return (
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-cyber-gold/5 transition-all duration-300 animate-float"
      style={{ animationDelay: "-3s" }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-gold to-orange-500 p-0.5">
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg">🔗</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-cyber-gold">REFERRAL SYSTEM</h3>
            <p className="text-xs text-gray-400">Generate Unique Links</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-cyber-green">{totalReferred}</div>
          <div className="text-xs text-gray-400">Referred</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {generatedLink && (
          <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
            <span className="text-cyber-cyan">LINK:</span> 
            <button 
              onClick={handleCopyLink}
              className="ml-2 text-cyber-gold hover:text-cyber-cyan transition-colors cursor-pointer"
            >
              {generatedLink.slice(0, 30)}...
            </button>
          </div>
        )}
        
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
          <span className="text-cyber-cyan">ACTIVE_REFS:</span> 
          <span className="ml-2">{(referralData as any)?.activeReferrals || 0}</span>
        </div>
        
        <Button 
          onClick={handleGenerateLink}
          disabled={generateReferralMutation.isPending || !walletAddress}
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-cyber-gold/10 transition-all"
          onMouseEnter={playHover}
        >
          {generateReferralMutation.isPending ? "GENERATING..." : "GENERATE NEW LINK"}
        </Button>
      </div>
    </div>
  );
}
