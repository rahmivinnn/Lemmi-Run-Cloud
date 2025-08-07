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
    <div 
      className="glass-morph rounded-lg p-6 neon-border hover:bg-red-500/5 transition-all duration-300 animate-float"
      style={{ animationDelay: "-4s" }}
      onMouseEnter={playHover}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-pink-500 p-0.5">
            <div className="w-full h-full rounded-lg bg-cyber-dark flex items-center justify-center">
              <span className="text-lg animate-glitch">🧨</span>
            </div>
          </div>
          <div>
            <h3 className="font-orbitron font-bold text-red-400">DEGEN MODE</h3>
            <p className="text-xs text-gray-400">High Risk • Beta</p>
          </div>
        </div>
        <div className="relative">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={handleToggle}
              className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${
              isEnabled ? 'bg-red-500' : 'bg-gray-600'
            }`}>
              <div className={`block w-5 h-5 bg-white rounded-full transition-transform transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </label>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs text-red-400">
          <span className="animate-pulse">⚠ EXPERIMENTAL FEATURES</span>
        </div>
        
        {clickCount > 0 && (
          <div className="bg-cyber-dark/50 rounded p-2 font-mono text-xs text-cyber-cyan">
            <span>ACTIVATION: {clickCount}/3 clicks</span>
          </div>
        )}
        
        <Button 
          onClick={handleActivateClick}
          className="w-full glass-morph rounded px-3 py-2 text-sm font-mono hover:bg-red-500/10 transition-all"
          onMouseEnter={playHover}
        >
          ACTIVATE CHAOS MODE
        </Button>
      </div>
    </div>
  );
}
