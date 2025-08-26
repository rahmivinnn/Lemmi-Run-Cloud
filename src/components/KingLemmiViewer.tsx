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

  const unlockedCount = (featuresData as any)?.kingLemmiUnlocked || 5;
  const totalCount = 10;

  return (
    <div className="h-full">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded bg-black flex items-center justify-center">
            <span className="text-2xl">👑</span>
          </div>
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-purple-400">KING LEMMI</h3>
          <p className="text-xs text-gray-400">Visual Collection</p>
        </div>
        <div className="ml-auto">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500 animate-pulse-slow">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-black/50 rounded border border-purple-500/20 p-3">
          <div className="font-mono text-xs text-purple-400 mb-1">COLLECTION STATUS</div>
          <div className="text-sm font-bold">{unlockedCount}/{totalCount} UNLOCKED</div>
        </div>
        
        <div className="bg-black/50 rounded border border-pink-500/20 p-3">
          <div className="flex justify-between text-xs mb-2">
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
          className="w-full bg-purple-500/20 border border-purple-500/50 rounded px-3 py-2 text-sm font-mono hover:bg-purple-500/30 transition-all text-purple-400"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          OPEN GALLERY
        </Button>
      </div>
    </div>
  );
}
