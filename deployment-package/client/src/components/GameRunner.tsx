import { useState, useEffect, useRef } from 'react';

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

    // Load character image
    const characterImage = new Image();
    characterImage.src = character.image;

    // Game loop
    const gameLoop = () => {
      if (!gameActive || gameOver) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background (simple parallax)
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Ground
      ctx.fillStyle = '#333333';
      ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

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

      // Draw player
      if (characterImage.complete) {
        ctx.drawImage(characterImage, game.player.x, game.player.y, game.player.width, game.player.height);
      } else {
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(game.player.x, game.player.y, game.player.width, game.player.height);
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

      // Update and draw obstacles
      game.obstacles = game.obstacles.filter(obstacle => {
        obstacle.x -= game.gameSpeed;
        
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

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

      // Update and draw coins
      game.coins = game.coins.filter(coin => {
        coin.x -= game.gameSpeed;
        
        if (!coin.collected) {
          ctx.fillStyle = '#ffff00';
          ctx.fillRect(coin.x, coin.y, coin.width, coin.height);

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
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Game Header */}
      <div className="h-20 bg-black border-b-2 border-orange-400 relative flex items-center justify-between px-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>
        
        <button
          onClick={onBack}
          className="bg-black border border-red-400 px-6 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
          EXIT
        </button>

        <div className="flex items-center space-x-8">
          <div className="bg-black border border-orange-400 px-4 py-2 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
            <span className="font-orbitron text-orange-400 font-bold tracking-wider">
              PLAYER: {character.name}
            </span>
          </div>
          
          <div className="bg-black border border-green-400 px-4 py-2 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
            <span className="font-orbitron text-green-400 font-bold tracking-wider">
              SCORE: {score}
            </span>
          </div>
        </div>

        <div className="w-24"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        {!gameActive ? (
          <div className="text-center">
            <div className="bg-black border-2 border-orange-400 p-8 relative">
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
              
              <h2 className="text-3xl font-orbitron font-black text-orange-400 mb-4 tracking-wider">
                LEMMI RUN
              </h2>
              <p className="text-orange-300/80 font-mono mb-6">
                Press SPACE or CLICK to jump over obstacles and collect coins!
              </p>
              
              <button
                onClick={startGame}
                className="bg-black border border-green-400 px-8 py-4 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative"
              >
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400"></div>
                START GAME
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-black border-2 border-orange-400 relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
            
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="block"
            />
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