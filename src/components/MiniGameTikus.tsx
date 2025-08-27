import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/hooks/useAudio";
import { useGameNotifications, createSuccessNotification, createErrorNotification, createInfoNotification } from "@/components/GameNotification";
import { apiRequest } from "@/lib/queryClient";

interface MiniGameTikusProps {
  onClose: () => void;
  walletAddress: string | null;
}

interface GameState {
  mouseX: number;
  mouseY: number;
  cheeseX: number;
  cheeseY: number;
  laserX: number;
  laserY: number;
  score: number;
  gameActive: boolean;
  lives: number;
}

export default function MiniGameTikus({ onClose, walletAddress }: MiniGameTikusProps) {
  const [gameState, setGameState] = useState<GameState>({
    mouseX: 150,
    mouseY: 150,
    cheeseX: 300,
    cheeseY: 100,
    laserX: 100,
    laserY: 200,
    score: 0,
    gameActive: true,
    lives: 3,
  });
  
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const { playClick, playHover, playSuccess, playError } = useAudio();
  const { addNotification } = useGameNotifications();
  const queryClient = useQueryClient();

  // Load high score on mount
  useEffect(() => {
    if (walletAddress) {
      fetch(`/api/game/${walletAddress}/tikus-escape/scores`)
        .then(res => res.json())
        .then(data => setHighScore(data.highScore || 0))
        .catch(console.error);
    }
  }, [walletAddress]);

  const submitScoreMutation = useMutation({
    mutationFn: async (score: number) => {
      const response = await apiRequest("POST", "/api/game/score", {
        walletAddress,
        game: "tikus-escape",
        score,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isNewRecord) {
        playSuccess();
        addNotification(createSuccessNotification(
          "New High Score!",
          `Congratulations! Score: ${data.score}`
        ));
      }
      queryClient.invalidateQueries({ queryKey: ["/api/game"] });
    },
  });

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameState.gameActive) return;

    const moveSpeed = 15;
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;

    const rect = gameArea.getBoundingClientRect();
    const maxX = rect.width - 40; // Mouse size
    const maxY = rect.height - 40;

    setGameState(prev => {
      let newX = prev.mouseX;
      let newY = prev.mouseY;

      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          newY = Math.max(0, prev.mouseY - moveSpeed);
          break;
        case 's':
        case 'arrowdown':
          newY = Math.min(maxY, prev.mouseY + moveSpeed);
          break;
        case 'a':
        case 'arrowleft':
          newX = Math.max(0, prev.mouseX - moveSpeed);
          break;
        case 'd':
        case 'arrowright':
          newX = Math.min(maxX, prev.mouseX + moveSpeed);
          break;
        case 'escape':
          onClose();
          return prev;
        default:
          return prev;
      }

      return { ...prev, mouseX: newX, mouseY: newY };
    });
  }, [gameState.gameActive, onClose]);

  // Game loop for laser movement
  useEffect(() => {
    if (!gameState.gameActive) return;

    const interval = setInterval(() => {
      setGameState(prev => {
        const gameArea = gameAreaRef.current;
        if (!gameArea) return prev;

        const rect = gameArea.getBoundingClientRect();
        let newLaserX = prev.laserX + (Math.random() - 0.5) * 10;
        let newLaserY = prev.laserY + (Math.random() - 0.5) * 10;

        // Keep laser in bounds
        newLaserX = Math.max(0, Math.min(rect.width - 30, newLaserX));
        newLaserY = Math.max(0, Math.min(rect.height - 30, newLaserY));

        // Check collision with mouse
        const mouseDistance = Math.sqrt(
          Math.pow(prev.mouseX - newLaserX, 2) + Math.pow(prev.mouseY - newLaserY, 2)
        );

        if (mouseDistance < 35) {
          playError();
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            // Game over
            if (walletAddress && prev.score > 0) {
              submitScoreMutation.mutate(prev.score);
            }
            return { ...prev, gameActive: false, lives: 0 };
          }
          return { ...prev, lives: newLives, laserX: newLaserX, laserY: newLaserY };
        }

        return { ...prev, laserX: newLaserX, laserY: newLaserY };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameState.gameActive, playError, submitScoreMutation, walletAddress]);

  // Keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleCheeseClick = () => {
    if (!gameState.gameActive) return;
    
    playClick();
    setGameState(prev => {
      const newScore = prev.score + 10;
      const gameArea = gameAreaRef.current;
      if (!gameArea) return prev;
      
      const rect = gameArea.getBoundingClientRect();
      const newCheeseX = Math.random() * (rect.width - 30);
      const newCheeseY = Math.random() * (rect.height - 30);

      return {
        ...prev,
        score: newScore,
        cheeseX: newCheeseX,
        cheeseY: newCheeseY,
      };
    });
  };

  const restartGame = () => {
    playClick();
    setGameState({
      mouseX: 150,
      mouseY: 150,
      cheeseX: 300,
      cheeseY: 100,
      laserX: 100,
      laserY: 200,
      score: 0,
      gameActive: true,
      lives: 3,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass-morph rounded-lg p-8 max-w-2xl w-full neon-border">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-orbitron font-bold text-cyber-cyan mb-2">
              🐭 TIKUS NEURAL ESCAPE
            </h2>
            <p className="text-sm text-gray-400 font-mono">
              Unauthorized rodent detected in neural subsystem!
            </p>
          </div>
          
          <div className="bg-cyber-dark/50 rounded-lg p-4 mb-4 border border-cyber-cyan/20">
            <div className="font-mono text-xs text-cyber-green mb-2">
              [GAME_CONTROLS] WASD: Move • CLICK: Eat Cheese • ESC: Exit
            </div>
            <div 
              ref={gameAreaRef}
              className="h-64 bg-gradient-to-br from-cyber-dark to-cyber-blue/20 rounded border border-cyber-cyan/30 relative overflow-hidden cursor-crosshair"
            >
              {/* Mouse */}
              <div 
                className="absolute text-4xl transition-all duration-100 z-10"
                style={{ 
                  left: `${gameState.mouseX}px`, 
                  top: `${gameState.mouseY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                🐭
              </div>
              
              {/* Cheese */}
              <div 
                className="absolute text-2xl animate-pulse cursor-pointer z-10"
                style={{ 
                  left: `${gameState.cheeseX}px`, 
                  top: `${gameState.cheeseY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={handleCheeseClick}
              >
                🧀
              </div>
              
              {/* Laser */}
              <div 
                className="absolute text-red-500 text-2xl animate-pulse z-10"
                style={{ 
                  left: `${gameState.laserX}px`, 
                  top: `${gameState.laserY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                ⚡
              </div>

              {/* Game Over Overlay */}
              {!gameState.gameActive && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                  <div className="text-center">
                    <h3 className="text-2xl font-orbitron font-bold text-red-400 mb-2">
                      NEURAL BREACH!
                    </h3>
                    <p className="text-cyber-cyan font-mono mb-4">
                      Final Score: {gameState.score}
                    </p>
                    <Button
                      onClick={restartGame}
                      className="glass-morph rounded px-4 py-2 font-mono hover:bg-cyber-cyan/10 transition-all"
                      onMouseEnter={playHover}
                    >
                      RESTART SIMULATION
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="font-mono text-sm space-x-4">
              <span className="text-cyber-cyan">SCORE: {gameState.score}</span>
              <span className="text-cyber-magenta">HIGH: {Math.max(highScore, gameState.score)}</span>
              <span className="text-cyber-green">LIVES: {gameState.lives}</span>
            </div>
            <Button 
              onClick={onClose}
              className="glass-morph rounded px-4 py-2 font-mono hover:bg-red-500/10 transition-all"
              onMouseEnter={playHover}
            >
              EXIT NEURAL SUBSYSTEM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
