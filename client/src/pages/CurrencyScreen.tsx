import { Link } from 'wouter';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function CurrencyScreen() {
  const { isConnected, balance } = useLaceWallet();

  const formatBalance = (bal: string | null) => {
    if (!bal) return '0.00';
    try {
      const lovelace = parseInt(bal);
      const ada = (lovelace / 1000000).toFixed(2);
      return ada;
    } catch {
      return '0.00';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-purple-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-purple-400 tracking-wider">
            CURRENCY
          </h1>
          <div className="bg-black border border-purple-400 px-3 py-1 font-mono text-xs">
            TOKENS.SYS
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Currency Overview */}
          <div className="bg-black border-2 border-purple-400 p-8 mb-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-purple-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-purple-400 mb-2 tracking-wider">
                💎 $LEMMI TOKENS
              </h2>
              <p className="text-purple-300/70 font-mono">Digital Currency</p>
            </div>

            {/* Token Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 border border-purple-500/50 p-6 text-center">
                <div className="text-4xl text-purple-400 font-mono font-bold mb-2">0</div>
                <div className="text-sm text-purple-300/70 font-mono">$LEMMI</div>
                <div className="text-xs text-gray-400 font-mono mt-2">Digital Currency</div>
              </div>
              
              <div className="bg-gray-900 border border-cyan-500/50 p-6 text-center">
                <div className="text-4xl text-cyan-400 font-mono font-bold mb-2">
                  {formatBalance(balance)}
                </div>
                <div className="text-sm text-cyan-300/70 font-mono">ADA</div>
                <div className="text-xs text-gray-400 font-mono mt-2">Cardano Native</div>
              </div>
              
              <div className="bg-gray-900 border border-yellow-500/50 p-6 text-center">
                <div className="text-4xl text-yellow-400 font-mono font-bold mb-2">0</div>
                <div className="text-sm text-yellow-300/70 font-mono">REWARDS</div>
                <div className="text-xs text-gray-400 font-mono mt-2">Skill Points</div>
              </div>
            </div>

            {/* Last Update */}
            <div className="bg-black/60 border border-purple-400/30 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="font-mono text-purple-400">
                  <div className="text-sm text-purple-300/70">LAST UPDATE</div>
                  <div className="text-lg font-bold">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour12: false,
                      hour: '2-digit',
                      minute: '2-digit'
                    })} PM
                  </div>
                </div>
                <button className="flex items-center space-x-2 bg-purple-600/20 border border-purple-400 px-4 py-2 text-purple-400 hover:bg-purple-600/30 transition-colors font-mono">
                  <RefreshCw className="w-4 h-4" />
                  <span>REFRESH BALANCE</span>
                </button>
              </div>
            </div>

            {/* Connection Status */}
            <div className="text-center">
              {isConnected ? (
                <div className="inline-flex items-center space-x-2 bg-green-600/20 border border-green-400 px-4 py-2 text-green-400 font-mono">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>WALLET CONNECTED</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-red-600/20 border border-red-400 px-4 py-2 text-red-400 font-mono">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>WALLET DISCONNECTED</span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction History Preview */}
          <div className="bg-black border-2 border-purple-400/50 p-8 relative">
            <div className="text-center mb-6">
              <h3 className="text-xl font-mono font-bold text-purple-400 tracking-wider">
                TRANSACTION HISTORY
              </h3>
            </div>
            
            <div className="text-center py-12">
              <div className="text-6xl text-purple-400/20 mb-4">📊</div>
              <div className="text-purple-300/70 font-mono">No transactions available</div>
              <div className="text-sm text-gray-500 font-mono mt-2">
                Connect wallet to view transaction history
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Link href="/transactions">
                <button className="bg-purple-600/20 border border-purple-400 px-6 py-2 text-purple-400 hover:bg-purple-600/30 transition-colors font-mono">
                  VIEW ALL TRANSACTIONS →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}