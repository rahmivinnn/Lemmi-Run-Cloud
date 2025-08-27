import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function NetworkScreen() {
  const { isConnected, isLaceAvailable } = useLaceWallet();

  const networkStats = {
    connectionStatus: isConnected ? 'ONLINE' : 'OFFLINE',
    nodeCount: 3247,
    blockHeight: 9876543,
    networkLatency: isConnected ? '45ms' : 'N/A',
    syncProgress: isConnected ? 100 : 0,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-blue-800 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/mainhub">
            <button className="flex items-center space-x-2 text-blue-900 hover:text-blue-900 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-blue-800 tracking-wider">
            NETWORK
          </h1>
          <div className="bg-black border border-blue-800 px-3 py-1 font-mono text-xs">
            NEURAL_NETWORK.EXE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Network Status */}
          <div className="bg-black border-2 border-blue-800 p-8 mb-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-800" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-800" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-blue-800 mb-2 tracking-wider">
                🌐 NEURAL STATUS
              </h2>
              <p className="text-blue-900/70 font-mono">Cardano Network Integration</p>
            </div>

            {/* Connection Status */}
            <div className="text-center mb-8">
              <div className={`text-6xl font-mono font-bold mb-4 ${
                networkStats.connectionStatus === 'ONLINE' ? 'text-green-400' : 'text-red-400'
              }`}>
                {networkStats.connectionStatus}
              </div>
              <div className={`inline-flex items-center space-x-2 px-6 py-2 border font-mono ${
                networkStats.connectionStatus === 'ONLINE' 
                  ? 'border-green-400 bg-green-400/10 text-green-400'
                  : 'border-red-400 bg-red-400/10 text-red-400'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  networkStats.connectionStatus === 'ONLINE' 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-red-400'
                }`} />
                <span>CONNECTION STATUS</span>
              </div>
            </div>

            {/* Network Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900 border border-blue-800/50 p-6 text-center">
                <div className="text-3xl text-blue-800 font-mono font-bold mb-2">
                  {networkStats.nodeCount.toLocaleString()}
                </div>
                <div className="text-sm text-blue-900/70 font-mono">ACTIVE NODES</div>
              </div>
              
              <div className="bg-gray-900 border border-purple-500/50 p-6 text-center">
                <div className="text-3xl text-purple-400 font-mono font-bold mb-2">
                  {networkStats.blockHeight.toLocaleString()}
                </div>
                <div className="text-sm text-purple-300/70 font-mono">BLOCK HEIGHT</div>
              </div>
              
              <div className="bg-gray-900 border border-green-500/50 p-6 text-center">
                <div className="text-3xl text-green-400 font-mono font-bold mb-2">
                  {networkStats.networkLatency}
                </div>
                <div className="text-sm text-green-300/70 font-mono">LATENCY</div>
              </div>
              
              <div className="bg-gray-900 border border-yellow-500/50 p-6 text-center">
                <div className="text-3xl text-yellow-400 font-mono font-bold mb-2">
                  {networkStats.syncProgress}%
                </div>
                <div className="text-sm text-yellow-300/70 font-mono">SYNC PROGRESS</div>
              </div>
            </div>

            {/* Sync Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-800 font-mono text-sm">NETWORK SYNCHRONIZATION</span>
                <span className="text-blue-900 font-mono text-sm">{networkStats.syncProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 h-3 relative overflow-hidden">
                <div 
                  className="h-full bg-blue-800 transition-all duration-1000"
                  style={{ width: `${networkStats.syncProgress}%` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>

            {/* Wallet Status */}
            <div className="bg-gray-900 border border-blue-800/50 p-6">
              <h3 className="font-mono font-bold text-blue-800 mb-4 text-center">
                WALLET STATUS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {isLaceAvailable ? '✅' : '❌'}
                  </div>
                  <div className={`font-mono text-sm ${isLaceAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {isLaceAvailable ? 'LACE DETECTED' : 'LACE NOT FOUND'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {isConnected ? '🔗' : '🔌'}
                  </div>
                  <div className={`font-mono text-sm ${isConnected ? 'text-green-400' : 'text-orange-400'}`}>
                    {isConnected ? 'WALLET CONNECTED' : 'WALLET DISCONNECTED'}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-blue-400 font-mono text-sm">
                    CARDANO MAINNET
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <Link href="/wallet">
                <button className="bg-blue-800/20 border border-blue-800 px-6 py-2 text-blue-800 hover:bg-blue-800/30 transition-colors font-mono">
                  WALLET SETTINGS →
                </button>
              </Link>
              
              <Link href="/transactions">
                <button className="bg-purple-600/20 border border-purple-400 px-6 py-2 text-purple-400 hover:bg-purple-600/30 transition-colors font-mono">
                  VIEW TRANSACTIONS →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}