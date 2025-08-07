import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";

interface DegenModeToggleProps {
  onActivateMiniGame: () => void;
}

export default function DegenModeToggle({ onActivateMiniGame }: DegenModeToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { playClick, playHover, playNotification } = useAudio();

  const handleToggle = () => {
    playClick();
    setIsEnabled(!isEnabled);
  };

  const handleActivateClick = () => {
    playClick();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 3) {
      playNotification();
      onActivateMiniGame();
      setClickCount(0); // Reset counter
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded bg-gradient-to-br from-red-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded bg-black flex items-center justify-center">
            <span className="text-2xl animate-glitch">🧨</span>
          </div>
        </div>
        <div>
          <h3 className="font-orbitron font-bold text-red-400">DEGEN MODE</h3>
          <p className="text-xs text-gray-400">High Risk • Beta</p>
        </div>
        <div className="ml-auto">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              className="sr-only"
            />
            <div className={`block w-10 h-5 rounded-full transition-colors ${
              isEnabled ? 'bg-red-500' : 'bg-gray-600'
            }`}>
              <div className={`block w-4 h-4 bg-white rounded-full transition-transform transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </label>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-black/50 rounded border border-red-500/20 p-3">
          <div className="font-mono text-xs text-red-400 mb-1">⚠ SYSTEM STATUS</div>
          <div className="text-sm font-bold">{isEnabled ? "CHAOS ACTIVE" : "STABLE MODE"}</div>
        </div>
        
        {clickCount > 0 && (
          <div className="bg-black/50 rounded border border-cyber-cyan/20 p-3">
            <div className="font-mono text-xs text-cyber-cyan mb-1">ACTIVATION SEQUENCE</div>
            <div className="text-sm font-bold">{clickCount}/3 CLICKS</div>
          </div>
        )}
        
        <Button 
          onClick={handleActivateClick}
          className="w-full bg-red-500/20 border border-red-500/50 rounded px-3 py-2 text-sm font-mono hover:bg-red-500/30 transition-all text-red-400"
          onMouseEnter={playHover}
        >
          ACTIVATE NEURAL CHAOS
        </Button>
      </div>
    </div>
  );
}
