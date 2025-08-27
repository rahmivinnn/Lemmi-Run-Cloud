import { Link } from 'wouter';
import { ArrowLeft, Zap } from 'lucide-react';

export default function ChaosScreen() {
  const chaosLevel = 0;
  const maxChaos = 100;
  const isActive = false;

  const chaosEffects = [
    { name: 'Speed Chaos', description: 'Random speed bursts', active: false, color: 'red' },
    { name: 'Gravity Shift', description: 'Inverted physics', active: false, color: 'purple' },
    { name: 'Token Storm', description: 'Extra token spawns', active: false, color: 'yellow' },
    { name: 'Mirror Mode', description: 'Reversed controls', active: false, color: 'cyan' },
    { name: 'Time Warp', description: 'Time dilation effects', active: false, color: 'green' },
    { name: 'Dimension Rift', description: 'Reality glitches', active: false, color: 'orange' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/mainhub">
            <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-red-400 tracking-wider">
            CHAOS MODE
          </h1>
          <div className="bg-black border border-red-400 px-3 py-1 font-mono text-xs">
            CHAOS.EXE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Chaos Control Panel */}
          <div className="bg-black border-2 border-red-400 p-8 mb-8 relative overflow-hidden">
            {/* Warning stripes */}
            <div className="absolute top-0 left-0 w-full h-2 bg-repeating-linear-gradient-45deg bg-yellow-400 opacity-60" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0px, #fbbf24 10px, #000000 10px, #000000 20px)'
            }} />
            
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-4xl font-mono font-bold text-red-400 mb-2 tracking-wider animate-pulse">
                🔥 CHAOS MODE
              </h2>
              <p className="text-red-300/70 font-mono">⚠️ EXPERIMENTAL GAMEPLAY MODIFIERS ⚠️</p>
            </div>

            {/* Chaos Level */}
            <div className="text-center mb-8">
              <div className="text-8xl font-mono font-bold text-red-400 mb-4 animate-pulse">
                {chaosLevel}%
              </div>
              <div className="text-red-300/70 font-mono mb-4">CHAOS LEVEL</div>
              
              {/* Chaos Bar */}
              <div className="max-w-md mx-auto">
                <div className="w-full bg-gray-700 h-4 relative overflow-hidden border-2 border-red-400">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000 relative"
                    style={{ width: `${(chaosLevel / maxChaos) * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Activation Button */}
            <div className="text-center mb-8">
              <button 
                className={`px-12 py-4 border-4 font-mono font-bold text-2xl tracking-wider transition-all duration-300 ${
                  isActive 
                    ? 'border-red-400 bg-red-600/30 text-red-300 animate-pulse'
                    : chaosLevel >= 25
                    ? 'border-red-400 bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:scale-105'
                    : 'border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                }`}
                disabled={chaosLevel < 25}
                style={{
                  clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)'
                }}
              >
                {isActive ? (
                  <span className="flex items-center space-x-2">
                    <Zap className="w-6 h-6 animate-spin" />
                    <span>CHAOS ACTIVE</span>
                    <Zap className="w-6 h-6 animate-spin" />
                  </span>
                ) : chaosLevel >= 25 ? (
                  'ACTIVATE CHAOS'
                ) : (
                  'INSUFFICIENT CHAOS'
                )}
              </button>
            </div>

            {/* Warning Message */}
            {chaosLevel < 25 && (
              <div className="bg-yellow-600/20 border border-yellow-400 p-4 text-center">
                <div className="text-yellow-400 font-mono font-bold mb-2">⚠️ CHAOS LEVEL TOO LOW</div>
                <div className="text-yellow-300/70 font-mono text-sm">
                  Complete more runs to build chaos energy. Minimum 25% required.
                </div>
              </div>
            )}
          </div>

          {/* Chaos Effects Grid */}
          <div className="bg-black border-2 border-red-400/50 p-8 relative">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-mono font-bold text-red-400 tracking-wider">
                CHAOS EFFECTS
              </h3>
              <p className="text-red-300/70 font-mono text-sm mt-2">
                Active modifiers when chaos mode is enabled
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chaosEffects.map((effect, index) => (
                <div 
                  key={index}
                  className={`bg-gray-900 border-2 p-6 relative transition-all duration-300 ${
                    effect.active 
                      ? `border-${effect.color}-400 bg-${effect.color}-600/20`
                      : `border-${effect.color}-400/30 hover:border-${effect.color}-400/60`
                  }`}
                >
                  <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-${effect.color}-400 ${
                    effect.active ? 'animate-pulse' : ''
                  }`} />
                  
                  <div className="text-center">
                    <div className={`text-4xl mb-3 ${effect.active ? 'animate-bounce' : ''}`}>
                      {effect.active ? '⚡' : '💀'}
                    </div>
                    
                    <h4 className={`font-mono font-bold text-${effect.color}-400 text-lg mb-2 tracking-wider`}>
                      {effect.name}
                    </h4>
                    
                    <p className={`text-${effect.color}-300/70 font-mono text-sm mb-4`}>
                      {effect.description}
                    </p>
                    
                    <div className={`inline-block px-3 py-1 border font-mono text-xs ${
                      effect.active
                        ? `border-${effect.color}-400 bg-${effect.color}-600/30 text-${effect.color}-300`
                        : `border-gray-600 bg-gray-800/50 text-gray-400`
                    }`}>
                      {effect.active ? 'ACTIVE' : 'DORMANT'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-8 bg-black/60 border border-red-400/30 p-6">
              <h4 className="font-mono font-bold text-red-400 mb-4 text-center">
                HOW TO BUILD CHAOS ENERGY
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="font-mono text-sm">
                  <div className="text-orange-400 mb-2">HIGH RISK PLAYS</div>
                  <div className="text-orange-300/70">Take dangerous routes for bonus chaos</div>
                </div>
                <div className="font-mono text-sm">
                  <div className="text-purple-400 mb-2">COMBO STREAKS</div>
                  <div className="text-purple-300/70">Long combos generate chaos energy</div>
                </div>
                <div className="font-mono text-sm">
                  <div className="text-red-400 mb-2">NEAR MISSES</div>
                  <div className="text-red-300/70">Close calls with obstacles build chaos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}