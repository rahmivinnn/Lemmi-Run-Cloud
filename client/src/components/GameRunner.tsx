import { useState, useEffect, useRef } from 'react';
import Game3D from './Game3D';

// Import Gerbil characters
import gerbilK1 from '@assets/k1_1755247198361.png';
import gerbilK2 from '@assets/k2_1755247198375.png';
import gerbilK3 from '@assets/k3_1755247198376.png';
import gerbilK4 from '@assets/k4_1755247198376.png';

interface Character {
  id: string;
  name: string;
  image: string;
  stats: {
    speed: number;
    jump: number;
    special: number;
  };
}

// Gerbil character configurations
const GERBIL_CHARACTERS = {
  k1: { image: gerbilK1, name: 'Gentleman Gerbil', color: '#00ff88' },
  k2: { image: gerbilK2, name: 'Happy Gerbil', color: '#ff6600' },
  k3: { image: gerbilK3, name: 'Wise Gerbil', color: '#8800ff' },
  k4: { image: gerbilK4, name: 'Leader Gerbil', color: '#ff0088' }
};

interface GameRunnerProps {
  character: Character;
  onGameEnd: (score: number) => void;
  onBack: () => void;
}

export function GameRunner({ character, onGameEnd, onBack }: GameRunnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<any>(null);
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game state
    const game = {
      player: {
        x: 100,
        y: 300,
        width: 40,
        height: 40,
        velocityY: 0,
        isJumping: false,
        groundY: 300,
        jumpPower: character.stats.jump * 2,
        speed: character.stats.speed
      },
      obstacles: [] as Array<{ x: number; y: number; width: number; height: number }>,
      coins: [] as Array<{ x: number; y: number; width: number; height: number; collected: boolean }>,
      gameSpeed: 2 + (character.stats.speed / 2),
      score: 0,
      lastObstacle: 0,
      lastCoin: 0
    };

    gameRef.current = game;

    // Load gerbil character images
    const gerbilImages = {
      k1: new Image(),
      k2: new Image(),
      k3: new Image(),
      k4: new Image()
    };
    
    gerbilImages.k1.src = gerbilK1;
    gerbilImages.k2.src = gerbilK2;
    gerbilImages.k3.src = gerbilK3;
    gerbilImages.k4.src = gerbilK4;
    
    // Determine which gerbil to use based on character ID
    const getCurrentGerbil = () => {
      const gerbilKey = character.id as keyof typeof gerbilImages;
      return gerbilImages[gerbilKey] || gerbilImages.k2; // default to k2
    };
    
    const getGerbilColor = () => {
      const gerbilKey = character.id as keyof typeof GERBIL_CHARACTERS;
      return GERBIL_CHARACTERS[gerbilKey]?.color || '#00ff88';
    };

    // Game loop
    const gameLoop = () => {
      if (!gameActive || gameOver) return;

      // Clear canvas with neural interface background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#000510');
      gradient.addColorStop(0.3, '#001122');
      gradient.addColorStop(0.7, '#002244');
      gradient.addColorStop(1, '#000510');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw neural network grid pattern
      ctx.strokeStyle = '#00ffff15';
      ctx.lineWidth = 1;
      const time = Date.now() * 0.001;
      for (let x = 0; x < canvas.width; x += 60) {
        const opacity = Math.sin(time + x * 0.01) * 0.3 + 0.7;
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 60) {
        const opacity = Math.cos(time + y * 0.01) * 0.3 + 0.7;
        ctx.globalAlpha = opacity * 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      
      // Draw neural pathway (ground)
      const pathGradient = ctx.createLinearGradient(0, canvas.height - 50, 0, canvas.height);
      pathGradient.addColorStop(0, '#00ffff20');
      pathGradient.addColorStop(0.5, '#0080ff30');
      pathGradient.addColorStop(1, '#004080');
      ctx.fillStyle = pathGradient;
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

      // Draw neural pathway line with animated glow
      const glowIntensity = Math.sin(time * 3) * 0.5 + 1;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 15 * glowIntensity;
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 * glowIntensity})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height - 50);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Update player physics
      if (game.player.isJumping) {
        game.player.y -= game.player.velocityY;
        game.player.velocityY -= 0.8; // gravity
        
        if (game.player.y >= game.player.groundY) {
          game.player.y = game.player.groundY;
          game.player.isJumping = false;
          game.player.velocityY = 0;
        }
      }

      // Draw gerbil character with enhanced neural effects
      const currentGerbil = getCurrentGerbil();
      const gerbilColor = getGerbilColor();
      
      if (currentGerbil.complete) {
        ctx.save();
        
        // Neural aura effect with character-specific color
        const auraSize = 25 + Math.sin(time * 4) * 8;
        const auraGradient = ctx.createRadialGradient(
          game.player.x + game.player.width / 2, game.player.y + game.player.height / 2,
          0,
          game.player.x + game.player.width / 2, game.player.y + game.player.height / 2,
          auraSize
        );
        
        // Convert hex color to rgba for gradient
        const hexToRgba = (hex: string, alpha: number) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        };
        
        auraGradient.addColorStop(0, hexToRgba(gerbilColor, 0.8));
        auraGradient.addColorStop(0.5, hexToRgba(gerbilColor, 0.4));
        auraGradient.addColorStop(0.8, 'rgba(0, 255, 255, 0.2)');
        auraGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2, auraSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Character glow effect with dynamic color
        ctx.shadowColor = gerbilColor;
        ctx.shadowBlur = 25;
        
        // Enhanced scale effect for jumping with rotation
        const jumpScale = game.player.velocityY > 0 ? 1.2 : 1.0;
        const rotation = game.player.velocityY * 0.02;
        const centerX = game.player.x + game.player.width / 2;
        const centerY = game.player.y + game.player.height / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.scale(jumpScale, jumpScale);
        
        // Draw gerbil with enhanced size
        const gerbilSize = 50; // Larger size for better visibility
        ctx.drawImage(currentGerbil, -gerbilSize/2, -gerbilSize/2, gerbilSize, gerbilSize);
        
        // Neural energy trails
        ctx.globalAlpha = 0.6;
        ctx.strokeStyle = gerbilColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const trailX = -gerbilSize/2 - (i * 15);
          const trailY = Math.sin(time * 5 + i) * 10;
          ctx.moveTo(trailX, trailY - 10);
          ctx.lineTo(trailX, trailY + 10);
        }
        ctx.stroke();
        
        ctx.restore();
      } else {
        // Enhanced fallback with gerbil-specific neural styling
        const pulseScale = 1 + Math.sin(time * 6) * 0.15;
        ctx.save();
        ctx.translate(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2);
        ctx.scale(pulseScale, pulseScale);
        
        // Neural core with character color
        ctx.fillStyle = gerbilColor;
        ctx.shadowColor = gerbilColor;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(0, 0, game.player.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Neural border
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, game.player.width / 2, 0, Math.PI * 2);
        ctx.stroke();
        
        // Gerbil emoji fallback
        ctx.font = '24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('🐹', 0, 8);
        
        ctx.restore();
      }

      // Spawn obstacles
      if (Date.now() - game.lastObstacle > 2000) {
        game.obstacles.push({
          x: canvas.width,
          y: 320,
          width: 30,
          height: 60
        });
        game.lastObstacle = Date.now();
      }

      // Spawn coins
      if (Date.now() - game.lastCoin > 1500) {
        game.coins.push({
          x: canvas.width,
          y: Math.random() > 0.5 ? 250 : 200,
          width: 20,
          height: 20,
          collected: false
        });
        game.lastCoin = Date.now();
      }

      // Update and draw system corruptions (obstacles)
      game.obstacles = game.obstacles.filter((obstacle, index) => {
        obstacle.x -= game.gameSpeed;
        
        ctx.save();
        
        // Corruption field effect
        const corruptionGradient = ctx.createRadialGradient(
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          0,
          obstacle.x + obstacle.width / 2,
          obstacle.y + obstacle.height / 2,
          obstacle.width
        );
        corruptionGradient.addColorStop(0, 'rgba(255, 0, 64, 0.8)');
        corruptionGradient.addColorStop(0.7, 'rgba(255, 0, 64, 0.4)');
        corruptionGradient.addColorStop(1, 'rgba(255, 0, 64, 0)');
        ctx.fillStyle = corruptionGradient;
        ctx.fillRect(
          obstacle.x - 10,
          obstacle.y - 10,
          obstacle.width + 20,
          obstacle.height + 20
        );
        
        // Main corruption block
        ctx.fillStyle = '#ff0040';
        ctx.shadowColor = '#ff0040';
        ctx.shadowBlur = 12;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Glitch effect
        const glitchOffset = Math.sin(time * 10 + index) * 2;
        ctx.fillStyle = '#ff6080';
        ctx.fillRect(
          obstacle.x + glitchOffset,
          obstacle.y,
          obstacle.width,
          obstacle.height / 4
        );
        
        // Neural corruption border
        ctx.strokeStyle = '#ff6080';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        ctx.restore();

        // Collision detection
        if (obstacle.x < game.player.x + game.player.width &&
            obstacle.x + obstacle.width > game.player.x &&
            obstacle.y < game.player.y + game.player.height &&
            obstacle.y + obstacle.height > game.player.y) {
          setGameOver(true);
          onGameEnd(game.score);
          return false;
        }

        return obstacle.x > -obstacle.width;
      });

      // Update and draw data fragments (coins)
      game.coins = game.coins.filter((coin, index) => {
        coin.x -= game.gameSpeed;
        
        if (!coin.collected) {
          ctx.save();
          ctx.translate(coin.x + coin.width / 2, coin.y + coin.height / 2);
          
          // Rotation and pulsing
          const rotation = time * 2 + index;
          const pulse = 1 + Math.sin(time * 4 + index) * 0.2;
          ctx.rotate(rotation);
          ctx.scale(pulse, pulse);
          
          // Data fragment aura
          const fragmentGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coin.width);
          fragmentGradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');
          fragmentGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.4)');
          fragmentGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
          ctx.fillStyle = fragmentGradient;
          ctx.beginPath();
          ctx.arc(0, 0, coin.width, 0, Math.PI * 2);
          ctx.fill();
          
          // Main data fragment
          ctx.shadowColor = '#ffff00';
          ctx.shadowBlur = 15;
          ctx.fillStyle = '#ffff00';
          ctx.beginPath();
          ctx.arc(0, 0, coin.width / 2, 0, Math.PI * 2);
          ctx.fill();
          
          // Neural core
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, coin.width / 4, 0, Math.PI * 2);
          ctx.fill();
          
          // Data streams
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 1;
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const length = coin.width / 2 + Math.sin(time * 3 + i) * 5;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * coin.width / 3, Math.sin(angle) * coin.width / 3);
            ctx.lineTo(Math.cos(angle) * length, Math.sin(angle) * length);
            ctx.stroke();
          }
          
          ctx.restore();

          // Collision detection
          if (coin.x < game.player.x + game.player.width &&
              coin.x + coin.width > game.player.x &&
              coin.y < game.player.y + game.player.height &&
              coin.y + coin.height > game.player.y) {
            coin.collected = true;
            game.score += 10;
            setScore(game.score);
          }
        }

        return coin.x > -coin.width;
      });

      // Enhanced neural interface overlay effects
      ctx.save();
      
      // Scanning lines with varying opacity
      const scanLine1 = (time * 120) % canvas.height;
      const scanLine2 = (time * 80) % canvas.height;
      const scanLine3 = (time * 200) % canvas.height;
      
      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(0, scanLine1, canvas.width, 3);
      
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#ff6600';
      ctx.fillRect(0, scanLine2, canvas.width, 2);
      
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#8800ff';
      ctx.fillRect(0, scanLine3, canvas.width, 1);
      
      // Neural particles floating in background
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 15; i++) {
        const particleX = ((time * 30 + i * 50) % (canvas.width + 100)) - 50;
        const particleY = 100 + Math.sin(time * 2 + i) * 80;
        const particleSize = 2 + Math.sin(time * 3 + i) * 1;
        
        ctx.fillStyle = i % 3 === 0 ? '#00ffff' : i % 3 === 1 ? '#ff6600' : '#8800ff';
        ctx.beginPath();
        ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle trails
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particleX - 10, particleY);
        ctx.lineTo(particleX, particleY);
        ctx.stroke();
        ctx.globalAlpha = 0.6;
      }
      
      // Holographic interference patterns
      ctx.globalAlpha = 0.05;
      for (let y = 0; y < canvas.height; y += 4) {
        const interference = Math.sin(time * 5 + y * 0.1) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(0, 255, 255, ${interference * 0.1})`;
        ctx.fillRect(0, y, canvas.width, 1);
      }
      
      // Neural network connections in background
      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const startX = (time * 20 + i * 100) % canvas.width;
        const startY = 50 + Math.sin(time + i) * 30;
        const endX = startX + 80;
        const endY = startY + Math.cos(time * 1.5 + i) * 40;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Connection nodes
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(startX, startY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(endX, endY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Data stream effects on edges
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 5; i++) {
        const streamY = (time * 150 + i * 80) % canvas.height;
        const streamOpacity = Math.sin(time * 4 + i) * 0.3 + 0.7;
        
        // Left edge stream
        ctx.fillStyle = `rgba(0, 255, 255, ${streamOpacity * 0.4})`;
        ctx.fillRect(0, streamY, 5, 20);
        
        // Right edge stream
        ctx.fillRect(canvas.width - 5, streamY, 5, 20);
      }
      
      // Glitch effects occasionally
      if (Math.random() < 0.02) {
        ctx.globalAlpha = 0.3;
        const glitchY = Math.random() * canvas.height;
        const glitchHeight = 20 + Math.random() * 40;
        
        ctx.fillStyle = '#ff0040';
        ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
        
        // Digital noise
        for (let x = 0; x < canvas.width; x += 4) {
          for (let y = glitchY; y < glitchY + glitchHeight; y += 4) {
            if (Math.random() < 0.3) {
              ctx.fillStyle = Math.random() < 0.5 ? '#ffffff' : '#000000';
              ctx.fillRect(x, y, 2, 2);
            }
          }
        }
      }
      
      ctx.restore();

      // Increase game speed gradually
      game.gameSpeed += 0.001;

      requestAnimationFrame(gameLoop);
    };

    // Controls
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !game.player.isJumping) {
        game.player.isJumping = true;
        game.player.velocityY = game.player.jumpPower;
      }
    };

    const handleClick = () => {
      if (!game.player.isJumping) {
        game.player.isJumping = true;
        game.player.velocityY = game.player.jumpPower;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('click', handleClick);

    if (gameActive) {
      gameLoop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('click', handleClick);
    };
  }, [character, gameActive, gameOver, onGameEnd]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setGameOver(false);
    if (gameRef.current) {
      gameRef.current.score = 0;
      gameRef.current.obstacles = [];
      gameRef.current.coins = [];
      gameRef.current.player.y = gameRef.current.player.groundY;
      gameRef.current.player.isJumping = false;
      gameRef.current.gameSpeed = 2 + (character.stats.speed / 2);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex flex-col relative overflow-hidden">
      {/* Neural Interface Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Scanlines Effect */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)',
          animation: 'scanlines 2s linear infinite'
        }} />
      </div>

      {/* Advanced HUD Header */}
      <div className="h-24 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-cyan-400 relative flex items-center justify-between px-8 z-10">
        {/* Corner Brackets */}
        <div className="absolute top-1 left-1 w-8 h-8">
          <div className="absolute top-0 left-0 w-4 h-1 bg-cyan-400 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-1 h-4 bg-cyan-400 animate-pulse"></div>
        </div>
        <div className="absolute top-1 right-1 w-8 h-8">
          <div className="absolute top-0 right-0 w-4 h-1 bg-cyan-400 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-1 h-4 bg-cyan-400 animate-pulse"></div>
        </div>
        <div className="absolute bottom-1 left-1 w-8 h-8">
          <div className="absolute bottom-0 left-0 w-4 h-1 bg-cyan-400 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-1 h-4 bg-cyan-400 animate-pulse"></div>
        </div>
        <div className="absolute bottom-1 right-1 w-8 h-8">
          <div className="absolute bottom-0 right-0 w-4 h-1 bg-cyan-400 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-1 h-4 bg-cyan-400 animate-pulse"></div>
        </div>
        
        {/* Exit Button */}
        <button
          onClick={onBack}
          className="bg-black border border-red-400 px-6 py-3 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 group overflow-hidden"
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400 animate-pulse"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <span className="relative z-10 transition-all duration-300 group-hover:text-yellow-100">◄ EXIT</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        {/* Central HUD Display */}
        <div className="flex items-center space-x-6">
          {/* Player Info */}
          <div className="bg-black/80 border border-orange-400 px-6 py-3 relative backdrop-blur-sm">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-400">
                <img src={character.image} alt={character.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-orbitron text-orange-400 font-bold tracking-wider text-sm">
                PILOT: {character.name.toUpperCase()}
              </span>
            </div>
          </div>
          
          {/* Score Display */}
          <div className="bg-black/80 border border-green-400 px-6 py-3 relative backdrop-blur-sm">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 text-xs">◆</span>
              <span className="font-orbitron text-green-400 font-bold tracking-wider text-sm">
                SCORE: {score.toString().padStart(6, '0')}
              </span>
            </div>
          </div>
          
          {/* Health/Status Bar */}
          <div className="bg-black/80 border border-blue-400 px-4 py-3 relative backdrop-blur-sm">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 text-xs">●</span>
              <span className="font-orbitron text-blue-400 font-bold tracking-wider text-xs">
                NEURAL LINK: ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="text-right">
          <div className="text-xs font-mono text-cyan-400/60">LEMMI.RUN v2.1</div>
          <div className="text-xs font-mono text-cyan-400/60">NEURAL INTERFACE</div>
        </div>
      </div>

      {/* Neural Interface Game Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900/50 to-black/80 backdrop-blur-sm relative z-10">
        {!gameActive ? (
          <div className="text-center relative">
            {/* Holographic Frame */}
            <div className="bg-black/90 border-2 border-cyan-400 p-12 relative backdrop-blur-md">
              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
              
              {/* Glowing Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-orange-400/10 animate-pulse"></div>
              
              {/* Title with Glow Effect */}
              <h2 className="text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-orange-400 to-cyan-400 mb-6 tracking-wider relative z-10">
                NEURAL INTERFACE
              </h2>
              <h3 className="text-2xl font-orbitron font-bold text-orange-400 mb-8 tracking-widest animate-pulse">
                LEMMI.RUN PROTOCOL
              </h3>
              
              {/* Mission Briefing */}
              <div className="bg-black/60 border border-orange-400/50 p-6 mb-8 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <h4 className="text-orange-400 font-orbitron font-bold mb-3 text-sm tracking-wider">MISSION BRIEFING:</h4>
                <p className="text-cyan-300/80 font-mono text-sm leading-relaxed">
                  Navigate through the neural pathways using quantum jumps.<br/>
                  Collect data fragments while avoiding system corruptions.<br/>
                  <span className="text-orange-400">Controls:</span> SPACE/CLICK to execute quantum leap
                </p>
              </div>
              
              {/* Character Stats Display */}
              <div className="bg-black/60 border border-blue-400/50 p-4 mb-8 relative">
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <h4 className="text-blue-400 font-orbitron font-bold mb-3 text-sm tracking-wider">PILOT SPECIFICATIONS:</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-cyan-400 font-mono">VELOCITY</div>
                    <div className="text-white font-bold">{character.stats.speed}/10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-mono">QUANTUM LEAP</div>
                    <div className="text-white font-bold">{character.stats.jump}/10</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-mono">NEURAL SYNC</div>
                    <div className="text-white font-bold">{character.stats.special}/10</div>
                  </div>
                </div>
              </div>
              
              {/* Start Button */}
              <button
                onClick={startGame}
                className="bg-black border-2 border-green-400 px-12 py-4 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-400/50 group overflow-hidden"
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span className="relative z-10 transition-all duration-300 group-hover:text-yellow-100 text-lg">► INITIALIZE NEURAL LINK</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Game Canvas Container */}
            <div className="bg-black/95 border-2 border-cyan-400 relative backdrop-blur-sm">
              {/* Corner Brackets */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
              
              {/* Holographic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-orange-400/5 pointer-events-none"></div>
              
              <canvas
                ref={canvasRef}
                width={900}
                height={500}
                className="block relative z-10"
              />
              
              {/* 3D Model Overlay */}
              {gameActive && (
                <Game3D 
                  character={character}
                  canvasRef={canvasRef}
                  gameState={gameRef.current || { player: { x: 0, y: 0, width: 40, height: 40, isJumping: false } }}
                />
              )}
            </div>
            
            {/* Enhanced Side HUD Panels */}
            <div className="absolute -left-52 top-0 w-48 h-full">
              {/* Left Panel - System Status */}
              <div className="bg-black/90 border border-blue-400/70 p-4 mb-4 backdrop-blur-sm relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-blue-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-blue-400 animate-pulse"></div>
                <div className="text-blue-400 font-orbitron font-bold text-xs mb-3 tracking-wider">◆ SYSTEM STATUS</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">NEURAL LINK:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">ACTIVE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">QUANTUM STATE:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400">STABLE</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">DATA FLOW:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-orange-400">OPTIMAL</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">GERBIL SYNC:</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-400">100%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Neural Network Mini-Map */}
              <div className="bg-black/90 border border-cyan-400/70 p-4 mb-4 backdrop-blur-sm relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-cyan-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-cyan-400 animate-pulse"></div>
                <div className="text-cyan-400 font-orbitron font-bold text-xs mb-3 tracking-wider">◆ NEURAL MAP</div>
                <div className="w-full h-16 bg-black/50 border border-cyan-400/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-cyan-400/10 animate-pulse"></div>
                  <div className="absolute top-2 left-2 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
                  <div className="absolute top-6 left-8 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute top-10 left-4 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                  <div className="absolute bottom-2 right-4 w-1 h-1 bg-red-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
            
            <div className="absolute -right-52 top-0 w-48 h-full">
              {/* Right Panel - Performance Metrics */}
              <div className="bg-black/90 border border-orange-400/70 p-4 mb-4 backdrop-blur-sm relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-orange-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-orange-400 animate-pulse"></div>
                <div className="text-orange-400 font-orbitron font-bold text-xs mb-3 tracking-wider">◆ PERFORMANCE</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">VELOCITY:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-gray-700 rounded">
                        <div className="h-full bg-green-400 rounded" style={{width: `${Math.min(100, (gameRef.current?.gameSpeed || 0) * 20)}%`}}></div>
                      </div>
                      <span className="text-green-400">{Math.round((gameRef.current?.gameSpeed || 0) * 10)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">FRAGMENTS:</span>
                    <span className="text-orange-400">{Math.floor(score / 10)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">EFFICIENCY:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-gray-700 rounded">
                        <div className="h-full bg-purple-400 rounded animate-pulse" style={{width: '98%'}}></div>
                      </div>
                      <span className="text-purple-400">98.7%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">NEURAL LOAD:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-gray-700 rounded">
                        <div className="h-full bg-yellow-400 rounded" style={{width: `${Math.min(100, score / 5)}%`}}></div>
                      </div>
                      <span className="text-yellow-400">{Math.min(100, Math.floor(score / 5))}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gerbil Status Panel */}
              <div className="bg-black/90 border border-purple-400/70 p-4 mb-4 backdrop-blur-sm relative">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-purple-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-purple-400 animate-pulse"></div>
                <div className="text-purple-400 font-orbitron font-bold text-xs mb-3 tracking-wider">◆ GERBIL STATUS</div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-center mb-2">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-400 overflow-hidden">
                      <img src={getCurrentGerbil().src} alt="Gerbil" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 font-bold">{GERBIL_CHARACTERS[character.id as keyof typeof GERBIL_CHARACTERS]?.name || 'Unknown Gerbil'}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">ENERGY:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-gray-700 rounded">
                        <div className="h-full bg-green-400 rounded animate-pulse" style={{width: '100%'}}></div>
                      </div>
                      <span className="text-green-400">100%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">FOCUS:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 h-1 bg-gray-700 rounded">
                        <div className="h-full bg-blue-400 rounded" style={{width: `${Math.max(50, 100 - score / 20)}%`}}></div>
                      </div>
                      <span className="text-blue-400">{Math.max(50, Math.floor(100 - score / 20))}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Game Over Screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-black border-2 border-red-400 p-8 relative text-center">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-400"></div>
            
            <h2 className="text-4xl font-orbitron font-black text-red-400 mb-4 tracking-wider">
              GAME OVER
            </h2>
            <p className="text-2xl font-mono text-orange-400 mb-6">
              FINAL SCORE: {score}
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={startGame}
                className="bg-black border border-green-400 px-6 py-3 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                PLAY AGAIN
              </button>
              
              <button
                onClick={onBack}
                className="bg-black border border-red-400 px-6 py-3 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
                EXIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}