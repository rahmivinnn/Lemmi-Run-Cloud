import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { LemmiRun } from '@/components/LemmiRun';
import { Link } from 'wouter';

export default function LemmiRunGame() {
  const [gameState, setGameState] = useState<'loading' | 'menu' | 'game'>('loading');
  const [highScore, setHighScore] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);

  const handleLoadingComplete = () => {
    setGameState('menu');
  };

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleGameEnd = (score: number, coins: number) => {
    if (score > highScore) {
      setHighScore(score);
    }
    setTotalCoins(prev => prev + coins);
    setGameState('menu');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  // Loading screen
  if (gameState === 'loading') {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  // Main menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          {/* Game Title */}
          <div className="text-center mb-12">
            <h1 className="text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              LEMMI RUN
            </h1>
            <div className="text-2xl text-cyan-400 font-mono mb-2">NEURAL INTERFACE EDITION</div>
            <div className="text-lg text-gray-400 font-mono">3D Endless Runner • Cyberpunk Arena</div>
          </div>
          
          {/* Character Preview */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-6xl animate-bounce">
              🐹
            </div>
            <div className="text-center mt-4">
              <div className="text-xl font-bold text-orange-400">GERBIL RUNNER</div>
              <div className="text-sm text-gray-400">Speed: ⚡⚡⚡⚡⚡</div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{Math.floor(highScore)}</div>
              <div className="text-sm text-gray-400 font-mono">HIGH SCORE</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{totalCoins}</div>
              <div className="text-sm text-gray-400 font-mono">TOTAL COINS</div>
            </div>
          </div>
          
          {/* Game Modes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl">
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 border border-cyan-400/50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">🏃‍♂️</div>
              <div className="text-lg font-bold text-cyan-400 mb-2">NORMAL MODE</div>
              <div className="text-sm text-gray-400">Classic endless runner with neon cyberpunk aesthetics</div>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-purple-900/30 border border-red-400/50 rounded-lg p-6 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="text-lg font-bold text-red-400 mb-2">DEGEN MODE</div>
              <div className="text-sm text-gray-400">Unlocks at 500+ score • Glitch effects • Brutal difficulty</div>
            </div>
          </div>
          
          {/* Controls Info */}
          <div className="bg-black/50 border border-gray-600 rounded-lg p-6 mb-8 max-w-md">
            <div className="text-center text-lg font-bold text-white mb-4">CONTROLS</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-300">A/D or ←/→</div>
              <div className="text-cyan-400">Change Lane</div>
              <div className="text-gray-300">W/↑/Space</div>
              <div className="text-cyan-400">Jump</div>
              <div className="text-gray-300">S/↓</div>
              <div className="text-cyan-400">Slide</div>
              <div className="text-gray-300">ESC</div>
              <div className="text-cyan-400">Pause</div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleStartGame}
              className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xl rounded-lg hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25"
            >
              START GAME
            </button>
            <Link href="/">
              <button className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-white font-bold text-lg rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300">
                BACK TO HUB
              </button>
            </Link>
          </div>
          
          {/* Version Info */}
          <div className="absolute bottom-4 right-4 text-xs text-gray-500 font-mono">
            LEMMI RUN v2.1.2006 • THREE.JS ENGINE • NEURAL INTERFACE
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  if (gameState === 'game') {
    return <LemmiRun onGameEnd={handleGameEnd} onBack={handleBackToMenu} />;
  }

  // Fallback
  return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
}