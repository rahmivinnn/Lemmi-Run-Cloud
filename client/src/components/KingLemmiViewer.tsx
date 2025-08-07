import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface KingLemmiViewerProps {
  walletAddress: string | null;
}

export default function KingLemmiViewer({ walletAddress }: KingLemmiViewerProps) {
  const { playClick, playHover } = useAudio();

  const { data: featuresData } = useQuery({
    queryKey: ["/api/features", walletAddress],
    enabled: !!walletAddress,
  });

  const unlockedCount = featuresData?.kingLemmiUnlocked || 5;
  const totalCount = 10;

  return (
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-purple-500/5 transition-all duration-300 animate-float"
      style={{ animationDelay: "-5s" }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg">👑</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-purple-400">KING LEMMI</h3>
            <p className="text-xs text-gray-400">Visual Collection</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-purple-500 animate-pulse-slow">
          <img 
            src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" 
            alt="King Lemmi character" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs">
          <span className="text-cyber-cyan">COLLECTION:</span> 
          <span className="ml-2">{unlockedCount}/{totalCount} Unlocked</span>
        </div>
        
        <div className="bg-cyber-dark/50 rounded p-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        
        <Button 
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-purple-500/10 transition-all"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          VIEW GALLERY
        </Button>
      </div>
    </div>
  );
}
