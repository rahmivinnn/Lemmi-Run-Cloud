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
    { id: 'game', name: 'ARENA CORE', icon: '🎮', path: '/game', color: 'green', category: 'GAMEPLAY', status: 'READY' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Professional Unity-style Header */}
      <div className="unity-toolbar bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b-2 border-blue-800 relative overflow-hidden">
        {/* Animated data streams */}
        <div className="data-stream top-0 w-32 opacity-30" style={{ animationDelay: '0s' }} />
        <div className="data-stream top-1 w-24 opacity-20" style={{ animationDelay: '1s' }} />
        
        <div className="flex items-center justify-between h-20 px-6 relative z-10">
          {/* Left: Project Info & Avatar */}
          <div className="flex items-center space-x-4">
            <div className="unity-gizmo">
              <div className="w-16 h-16 unity-panel p-1">
                <LemmiAvatar variant="small" className="rounded" />
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-800 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-700 tracking-wider" style={{ fontFamily: 'Source Code Pro' }}>
                LEMMI.RUN
              </h1>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-green-400">v2.1.2006</span>
                <span className="text-gray-400">•</span>
                <span className="text-blue-700">MAIN_HUB</span>
                <span className="text-gray-400">•</span>
                <span className="text-orange-400">{frameRate}fps</span>
              </div>
            </div>
          </div>
          
          {/* Center: System Status */}
          <div className="unity-console px-4 py-2 max-w-md">
            <div className="flex items-center space-x-2 text-xs">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-green-300 font-mono">{terminalText}</span>
            </div>
          </div>
          
          {/* Right: System Stats & Wallet */}
          <div className="flex items-center space-x-4">
            {/* System Monitor */}
            <div className="unity-panel px-3 py-2 text-xs font-mono">
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
                  <Clock className="w-3 h-3 text-blue-800" />
                  <span className="text-blue-700">{systemTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            
            <RetroWalletButton />
          </div>
        </div>
      </div>

      {/* Unity-style Main Workspace */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300ffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40z'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          {/* Unity Inspector-style Header */}
          <div className="unity-inspector mb-8">
            <div className="unity-header flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>LEMMI RUNTIME MANAGER</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <Battery className="w-3 h-3 text-green-400" />
                <span className="text-green-400">SYSTEMS ONLINE</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 tracking-wide" style={{ fontFamily: 'Source Code Pro' }}>
                  LEMMI RUN v2.1
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                  Select system module to initialize • {screens.length} modules loaded
                </p>
              </div>
              
              {/* Module Categories */}
              <div className="flex justify-center space-x-6 mb-6">
                {['CORE', 'ECONOMY', 'BLOCKCHAIN', 'GAMEPLAY'].map(category => {
                  const moduleCount = screens.filter(s => s.category === category).length;
                  return (
                    <div key={category} className="hud-element">
                      <div className="text-xs font-bold">{category}</div>
                      <div className="text-xs opacity-70">{moduleCount} modules</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unity Hierarchy-style Module Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {screens.map((screen, index) => (
              <Link key={screen.id} href={screen.path}>
                <div className={`game-ui-card group border-2 border-${screen.color}-400/60 hover:border-${screen.color}-400 transition-all duration-300 cursor-pointer relative`}
                     style={{ animationDelay: `${index * 100}ms` }}>
                  
                  {/* Unity-style header bar */}
                  <div className={`unity-tab active bg-${screen.color}-500/20 border-b border-${screen.color}-400/40 px-3 py-2`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-${screen.color}-400 animate-pulse`} />
                        <span className="text-xs font-mono font-bold text-gray-300">{screen.category}</span>
                      </div>
                      <div className={`text-xs font-mono px-2 py-1 rounded bg-${screen.color}-500/30 text-${screen.color}-300`}>
                        {screen.status}
                      </div>
                    </div>
                  </div>
                  
                  {/* Module content */}
                  <div className="p-6 text-center relative">
                    {/* Unity gizmo-style icon */}
                    <div className="unity-gizmo mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                        {screen.icon}
                      </div>
                    </div>
                    
                    <h3 className={`font-bold text-${screen.color}-300 text-base mb-2 tracking-wide`} style={{ fontFamily: 'Source Code Pro' }}>
                      {screen.name}
                    </h3>
                    
                    <div className={`text-xs font-mono text-${screen.color}-400/70 mb-4`}>
                      {screen.id.toUpperCase()}_MODULE.dll
                    </div>
                    
                    {/* Unity-style progress indicator */}
                    <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                      <div className={`h-full bg-${screen.color}-400 transition-all duration-1000 group-hover:w-full`} 
                           style={{ width: screen.status === 'ACTIVE' ? '100%' : screen.status === 'READY' ? '80%' : '60%' }} />
                    </div>
                    
                    <div className={`text-xs font-mono text-${screen.color}-300/60 mt-2`}>
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
            ))}
          </div>
        </div>

        {/* Unity-style Bottom Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 unity-toolbar bg-gray-800/95 border-t border-blue-800/50 backdrop-blur-sm z-50">
          <div className="container mx-auto px-6 py-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>RUNTIME: ACTIVE</span>
                </div>
                <div className="text-blue-700">CARDANO: CONNECTED</div>
                <div className="text-purple-300">LACE: READY</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-orange-300">GERBIL EDITION</span>
                <div className="text-gray-400">•</div>
                <span className="text-blue-300">BUILD {Date.now().toString().slice(-6)}</span>
                <div className="text-gray-400">•</div>
                <span className="text-blue-700">{systemTime.toLocaleString('en-US', { 
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