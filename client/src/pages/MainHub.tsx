import { useState } from 'react';
import { Link } from 'wouter';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { RetroWalletButton } from '@/components/RetroWalletButton';

export default function MainHub() {
  const [terminalText, setTerminalText] = useState("[READY] Neural interface active...");

  const screens = [
    { id: 'wallet', name: 'PLAYER ACCESS', icon: '🔗', path: '/wallet', color: 'green' },
    { id: 'currency', name: 'CURRENCY', icon: '💎', path: '/currency', color: 'purple' },
    { id: 'inventory', name: 'INVENTORY', icon: '🎒', path: '/inventory', color: 'blue' },
    { id: 'collection', name: 'COLLECTION', icon: '🖼️', path: '/collection', color: 'orange' },
    { id: 'skills', name: 'SKILLS', icon: '⚡', path: '/skills', color: 'yellow' },
    { id: 'network', name: 'NETWORK', icon: '🌐', path: '/network', color: 'cyan' },
    { id: 'chaos', name: 'CHAOS MODE', icon: '🔥', path: '/chaos', color: 'red' },
    { id: 'game', name: 'RUN ARENA', icon: '🎮', path: '/game', color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Unity-style Header */}
      <div className="h-24 bg-gradient-to-r from-black via-gray-900 to-black border-b border-cyan-400 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)'
        }} />
        
        <div className="flex items-center justify-between h-full px-8 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 border border-cyan-400 bg-black relative overflow-hidden">
              <LemmiAvatar variant="small" />
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400"></div>
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400"></div>
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-black text-cyan-400 tracking-widest">
                LEMMI.RUN
              </h1>
              <p className="text-xs font-mono text-green-400/70">v2.1.2006 | MAIN_HUB</p>
            </div>
          </div>
          
          <div className="bg-black border border-green-400 px-4 py-2 font-mono">
            <div className="text-xs text-green-400/60">NEURAL_LINK:</div>
            <div className="text-sm text-green-300 font-bold">{terminalText}</div>
          </div>
          
          <RetroWalletButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-orbitron font-black text-cyan-400 mb-4 tracking-wider">
            NEURAL INTERFACE
          </h2>
          <p className="text-gray-400 font-mono text-sm">
            Select system module to access
          </p>
        </div>

        {/* Screen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {screens.map((screen) => (
            <Link key={screen.id} href={screen.path}>
              <div className={`group bg-black border-2 border-${screen.color}-400 hover:border-${screen.color}-300 transition-all duration-300 cursor-pointer relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900" />
                <div className={`absolute inset-0 bg-${screen.color}-500/5 group-hover:bg-${screen.color}-500/10 transition-colors`} />
                
                {/* Corner brackets */}
                <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-${screen.color}-400`} />
                <div className={`absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-${screen.color}-400`} />
                <div className={`absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-${screen.color}-400`} />
                <div className={`absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-${screen.color}-400`} />
                
                <div className="relative z-10 p-6 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                    {screen.icon}
                  </div>
                  <h3 className={`font-mono font-bold text-${screen.color}-400 text-sm tracking-wider mb-2`}>
                    {screen.name}
                  </h3>
                  <div className={`text-xs font-mono text-${screen.color}-300/60`}>
                    [{screen.id.toUpperCase()}.EXE]
                  </div>
                </div>
                
                {/* Scan lines */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity" style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255, 255, 255, 0.1) 4px, rgba(255, 255, 255, 0.1) 8px)'
                }} />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="flex justify-center mt-12 space-x-8">
          <div className="bg-black border border-cyan-400 px-4 py-2 font-mono text-center">
            <div className="text-xs text-cyan-400/60">ACCESS_LV</div>
            <div className="text-2xl text-cyan-400 font-bold">01</div>
          </div>
          <div className="bg-black border border-yellow-400 px-4 py-2 font-mono text-center">
            <div className="text-xs text-yellow-400/60">TOKENS</div>
            <div className="text-2xl text-yellow-400 font-bold">0000</div>
          </div>
          <div className="bg-black border border-purple-400 px-4 py-2 font-mono text-center">
            <div className="text-xs text-purple-400/60">XP</div>
            <div className="text-2xl text-purple-400 font-bold">0000</div>
          </div>
        </div>
      </div>
    </div>
  );
}