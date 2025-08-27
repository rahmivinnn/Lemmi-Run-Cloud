import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { RetroWalletButton } from '@/components/RetroWalletButton';
import { Activity, Cpu, HardDrive, Wifi, Battery, Clock } from 'lucide-react';

export default function MainHub() {
  const [terminalText, setTerminalText] = useState("[READY] Neural interface active...");
  const [systemTime, setSystemTime] = useState(new Date());
  const [cpuUsage] = useState(Math.floor(Math.random() * 30) + 15);
  const [memoryUsage] = useState(Math.floor(Math.random() * 40) + 30);
  const [networkStatus] = useState('CONNECTED');
  const [frameRate] = useState(Math.floor(Math.random() * 20) + 120);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const screens = [
    { id: 'wallet', name: 'LACE WALLET', icon: '🔗', path: '/wallet', color: 'green', category: 'CORE', status: 'ACTIVE' },
    { id: 'currency', name: 'CURRENCY SYS', icon: '💎', path: '/currency', color: 'purple', category: 'ECONOMY', status: 'LIVE' },
    { id: 'inventory', name: 'INVENTORY MGR', icon: '🎒', path: '/inventory', color: 'blue', category: 'ASSETS', status: 'READY' },
    { id: 'collection', name: 'NFT CLAIMS', icon: '🖼️', path: '/collection', color: 'orange', category: 'BLOCKCHAIN', status: 'SYNC' },
    { id: 'skills', name: 'SKILL TREE', icon: '⚡', path: '/skills', color: 'yellow', category: 'PROGRESSION', status: 'DEV' },
    { id: 'network', name: 'CARDANO NET', icon: '🌐', path: '/network', color: 'cyan', category: 'PROTOCOL', status: 'ONLINE' },
    { id: 'chaos', name: 'CHAOS ENGINE', icon: '🔥', path: '/chaos', color: 'red', category: 'EXPERIMENTAL', status: 'BETA' },
    { id: 'arena', name: 'ARENA CORE', icon: '🎮', path: '/game', color: 'green', category: 'GAMEPLAY', status: 'READY' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Professional Unity-style Header */}
      <div className="unity-toolbar bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b-2 border-blue-900 relative overflow-hidden">
        {/* Animated data streams */}
        <div className="data-stream top-0 w-32 opacity-30" style={{ animationDelay: '0s' }} />
        <div className="data-stream top-1 w-24 opacity-20" style={{ animationDelay: '1s' }} />
        
        <div className="flex items-center justify-between h-16 md:h-20 px-3 md:px-6 relative z-10">
          {/* Left: Project Info & Avatar */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="unity-gizmo">
              <div className="w-12 h-12 md:w-16 md:h-16 unity-panel p-1">
                <LemmiAvatar variant="small" className="rounded" />
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-900 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white tracking-wider" style={{ fontFamily: 'Source Code Pro' }}>
                LEMMI.RUN
              </h1>
              <div className="flex items-center space-x-1 md:space-x-2 text-xs font-mono">
                <span className="text-green-400">v2.1.2006</span>
                <span className="text-gray-400 hidden sm:inline">•</span>
                <span className="text-white hidden sm:inline">MAIN_HUB</span>
                <span className="text-gray-400 hidden md:inline">•</span>
                <span className="text-orange-400 hidden md:inline">{frameRate}fps</span>
              </div>
            </div>
          </div>
          
          {/* Center: System Status */}
          <div className="unity-console px-2 md:px-4 py-1 md:py-2 max-w-xs md:max-w-md hidden lg:block">
            <div className="flex items-center space-x-2 text-xs">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-green-300 font-mono truncate">{terminalText}</span>
            </div>
          </div>
          
          {/* Right: System Stats & Wallet */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* System Monitor */}
            <div className="unity-panel px-2 md:px-3 py-1 md:py-2 text-xs font-mono hidden xl:block">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-1">
                  <Cpu className="w-3 h-3 text-blue-400" />
                  <span className="text-blue-300">{cpuUsage}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HardDrive className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-300">{memoryUsage}%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-3 h-3 text-green-400" />
                  <span className="text-green-300">LIVE</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-blue-900" />
                  <span className="text-blue-800">{systemTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            
            {/* Mobile System Status */}
            <div className="xl:hidden flex items-center space-x-2 text-xs font-mono">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-800 hidden sm:inline">{cpuUsage}%</span>
            </div>
            
            <div className="absolute top-0 right-0 m-2">
              <RetroWalletButton />
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Retro Main Workspace */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background - Hitam */}
        <div className="fixed inset-0 z-0">
          {/* Background Hitam */}
          <div className="absolute inset-0 bg-black" />
          

        </div>
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Retro Terminal Header */}
          <div className="relative z-10 pt-8 pb-4">
            <div className="text-center mb-8">
              <h2 className="retro-title text-4xl font-bold mb-3 tracking-widest" style={{ fontFamily: 'Courier New' }}>
                NEURAL INTERFACE
              </h2>
              <p className="text-cyan-400 font-mono text-sm leading-relaxed">
                &gt; SELECT_MODULE.EXE • {screens.length} SYSTEMS LOADED
              </p>
            </div>
          </div>

          {/* Retro Gaming Module Grid - 4 kolom landscape */}
          <div className="relative z-10 grid grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
            {screens.map((screen, index) => {
              // Define retro color mappings
              const colorClasses = {
                green: {
                  border: 'border-green-400',
                  glow: 'shadow-green-400/50',
                  text: 'text-green-400',
                  bg: 'bg-green-400/10'
                },
                purple: {
                  border: 'border-purple-400',
                  glow: 'shadow-purple-400/50',
                  text: 'text-purple-400',
                  bg: 'bg-purple-400/10'
                },
                blue: {
                  border: 'border-blue-400',
                  glow: 'shadow-blue-400/50',
                  text: 'text-blue-400',
                  bg: 'bg-blue-400/10'
                },
                orange: {
                  border: 'border-orange-400',
                  glow: 'shadow-orange-400/50',
                  text: 'text-orange-400',
                  bg: 'bg-orange-400/10'
                },
                yellow: {
                  border: 'border-yellow-400',
                  glow: 'shadow-yellow-400/50',
                  text: 'text-yellow-400',
                  bg: 'bg-yellow-400/10'
                },
                cyan: {
                  border: 'border-cyan-400',
                  glow: 'shadow-cyan-400/50',
                  text: 'text-cyan-400',
                  bg: 'bg-cyan-400/10'
                },
                red: {
                  border: 'border-red-400',
                  glow: 'shadow-red-400/50',
                  text: 'text-red-400',
                  bg: 'bg-red-400/10'
                }
              };
              
              const colors = colorClasses[screen.color as keyof typeof colorClasses] || colorClasses.blue;
              
              return (
                <Link key={screen.id} href={screen.path}>
                  <div className={`retro-panel group cursor-pointer relative transition-all duration-300 hover:scale-105 hover:shadow-lg ${colors.glow}`}
                       style={{ animationDelay: `${index * 100}ms` }}>
                    
                    {/* Retro corner brackets */}
                    <div className="absolute top-1 left-1 w-4 h-4">
                      <div className={`absolute top-0 left-0 w-2 h-0.5 ${colors.bg}`}></div>
                      <div className={`absolute top-0 left-0 w-0.5 h-2 ${colors.bg}`}></div>
                    </div>
                    <div className="absolute top-1 right-1 w-4 h-4">
                      <div className={`absolute top-0 right-0 w-2 h-0.5 ${colors.bg}`}></div>
                      <div className={`absolute top-0 right-0 w-0.5 h-2 ${colors.bg}`}></div>
                    </div>
                    
                    {/* Module content - Compact untuk 4 kolom */}
                    <div className="p-3 text-center relative">
                      {/* Status indicator */}
                      <div className="absolute top-2 right-2">
                        <div className={`text-xs font-mono px-2 py-1 ${colors.border} ${colors.text} border rounded`}>
                          {screen.status}
                        </div>
                      </div>
                      
                      {/* Gaming icon - Smaller untuk 4 kolom */}
                      <div className="mb-2">
                        <div className={`text-2xl group-hover:scale-110 transition-transform duration-300 ${colors.text}`}>
                          {screen.icon}
                        </div>
                      </div>
                      
                      <h3 className={`font-bold ${colors.text} text-sm mb-1 tracking-widest`} style={{ fontFamily: 'Courier New' }}>
                        {screen.name}
                      </h3>
                      
                      <div className="text-xs font-mono text-cyan-400/70 mb-2">
                        {screen.id.toUpperCase()}_MODULE.dll
                      </div>
                      
                      <div className="text-xs font-mono text-gray-400 leading-tight">
                        {screen.status === 'ACTIVE' ? 'READY TO LAUNCH' : 
                         screen.status === 'READY' ? 'SYSTEM LOADED' : 
                         screen.status === 'LIVE' ? 'ONLINE SERVICE' : 
                         screen.status === 'SYNC' ? 'SYNCING DATA' : 
                         screen.status === 'DEV' ? 'IN DEVELOPMENT' :
                         screen.status === 'ONLINE' ? 'NETWORK ACTIVE' :
                         screen.status === 'BETA' ? 'BETA VERSION' : 'INITIALIZING...'}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Retro Bottom Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t-2 border-cyan-400 backdrop-blur-sm z-50">
          <div className="container mx-auto px-4 md:px-6 py-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-3 md:space-x-6">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="hidden sm:inline font-semibold">&gt; NEURAL_LINK: ACTIVE</span>
                  <span className="sm:hidden font-semibold">ACTIVE</span>
                </div>
                <div className="text-cyan-400 hidden md:inline font-medium">&gt; CARDANO: CONNECTED</div>
                <div className="text-purple-400 hidden lg:inline font-medium">&gt; LACE: READY</div>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-orange-400 hidden md:inline font-medium">GERBIL_EDITION</span>
                <div className="text-gray-500 hidden md:inline">|</div>
                <span className="text-cyan-400 hidden sm:inline font-medium">BUILD_{Date.now().toString().slice(-6)}</span>
                <div className="text-gray-500 hidden sm:inline">|</div>
                <span className="text-cyan-400 font-semibold">{systemTime.toLocaleString('en-US', { 
                  month: 'short', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}