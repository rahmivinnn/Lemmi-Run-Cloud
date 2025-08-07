import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface SkillRewardPanelProps {
  walletAddress: string | null;
}

export default function SkillRewardPanel({ walletAddress }: SkillRewardPanelProps) {
  const { playClick, playHover } = useAudio();

  const { data: skillsData, isLoading } = useQuery({
    queryKey: ["/api/skills", walletAddress],
    enabled: !!walletAddress,
  });

  const efficiency = skillsData?.efficiency || 0;
  const neuralSync = skillsData?.neuralSync || 0;
  const maxSync = 1000;
  const syncPercentage = Math.min((neuralSync / maxSync) * 100, 100);

  return (
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-blue-500/5 transition-all duration-300 animate-float"
      style={{ animationDelay: "-2s" }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-0.5">
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg">⚡</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-blue-400">SKILL REWARDS</h3>
            <p className="text-xs text-gray-400">Performance Tracking</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-mono font-bold text-cyber-cyan">
            {isLoading ? "..." : `${efficiency.toFixed(1)}%`}
          </div>
          <div className="text-xs text-gray-400">Efficiency</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-cyber-dark/50 rounded p-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Neural Sync</span>
            <span>{neuralSync}/{maxSync}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyber-cyan to-cyber-green h-2 rounded-full transition-all duration-500"
              style={{ width: `${syncPercentage}%` }}
            />
          </div>
        </div>
        
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
          <span className="text-cyber-cyan">TOTAL_REWARDS:</span> 
          <span className="ml-2">{skillsData?.totalRewards || 0}</span>
        </div>
        
        <Button 
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-blue-500/10 transition-all"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          VIEW DETAILED STATS
        </Button>
      </div>
    </div>
  );
}
