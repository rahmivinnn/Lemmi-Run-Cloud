import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function InventoryScreen() {
  const { isConnected } = useLaceWallet();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-blue-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-blue-400 tracking-wider">
            INVENTORY
          </h1>
          <div className="bg-black border border-blue-400 px-3 py-1 font-mono text-xs">
            INVENTORY.BAT
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Inventory Grid */}
          <div className="bg-black border-2 border-blue-400 p-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-blue-400 mb-2 tracking-wider">
                🎒 NFT COLLECTION
              </h2>
              <p className="text-blue-300/70 font-mono">Digital Asset Collection</p>
            </div>

            {/* Inventory Slots Grid */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
              {Array.from({ length: 32 }).map((_, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gray-900 border-2 border-blue-500/30 relative hover:border-blue-400/70 transition-colors cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center text-blue-400/30 group-hover:text-blue-400/50 transition-colors">
                    <div className="text-2xl">□</div>
                  </div>
                  {/* Slot number */}
                  <div className="absolute top-1 left-1 text-xs text-blue-400/50 font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>

            {/* Status Panel */}
            <div className="bg-gray-900 border border-blue-500/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl text-blue-400 font-mono font-bold mb-2">0</div>
                  <div className="text-sm text-blue-300/70 font-mono">TOTAL ITEMS</div>
                </div>
                <div>
                  <div className="text-3xl text-purple-400 font-mono font-bold mb-2">0</div>
                  <div className="text-sm text-purple-300/70 font-mono">NFT TOKENS</div>
                </div>
                <div>
                  <div className="text-3xl text-yellow-400 font-mono font-bold mb-2">32</div>
                  <div className="text-sm text-yellow-300/70 font-mono">SLOT CAPACITY</div>
                </div>
              </div>
            </div>

            {/* Connection Notice */}
            {!isConnected && (
              <div className="mt-6 bg-black/60 border border-red-400/50 p-6 text-center">
                <div className="text-red-400 font-mono mb-2">⚠️ WALLET NOT CONNECTED</div>
                <div className="text-red-300/70 font-mono text-sm">
                  Connect your Lace wallet to view NFT collection
                </div>
                <Link href="/wallet">
                  <button className="mt-4 bg-red-600/20 border border-red-400 px-4 py-2 text-red-400 hover:bg-red-600/30 transition-colors font-mono">
                    GO TO WALLET →
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}