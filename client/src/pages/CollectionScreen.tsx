import { useState } from 'react';
import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { useLaceWallet } from '@/hooks/useLaceWallet';

// Import Gerbil claim characters
import gerbilK1 from '@assets/k1_1755244404882.png';
import gerbilK2 from '@assets/k2_1755244404884.png';
import gerbilK3 from '@assets/k3_1755244404885.png';
import gerbilK4 from '@assets/k4_1755244404886.png';

export default function CollectionScreen() {
  const { isConnected } = useLaceWallet();
  const [claimedGerbils, setClaimedGerbils] = useState<number[]>([]);
  
  const gerbilClaimOptions = [
    { id: 1, name: 'Gentleman Gerbil', image: gerbilK1, rarity: 'RARE', claimable: true },
    { id: 2, name: 'Happy Gerbil', image: gerbilK2, rarity: 'COMMON', claimable: true },
    { id: 3, name: 'Wise Gerbil', image: gerbilK3, rarity: 'EPIC', claimable: false }, // Not claimable
    { id: 4, name: 'Leader Gerbil', image: gerbilK4, rarity: 'LEGENDARY', claimable: false }, // Not claimable
  ];

  const handleGerbilClaim = (gerbilId: number) => {
    if (!isConnected) {
      alert('⚠️ Connect Lace wallet first to claim NFT!');
      return;
    }
    
    const gerbil = gerbilClaimOptions.find(g => g.id === gerbilId);
    if (!gerbil?.claimable) {
      alert('❌ This NFT is not available for claiming!');
      return;
    }
    
    if (!claimedGerbils.includes(gerbilId)) {
      setClaimedGerbils([...claimedGerbils, gerbilId]);
      alert(`✅ Successfully claimed ${gerbil.name}!`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-orange-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-orange-400 tracking-wider">
            COLLECTION
          </h1>
          <div className="bg-black border border-orange-400 px-3 py-1 font-mono text-xs">
            GERBIL.NFT
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Collection Header */}
          <div className="bg-black border-2 border-orange-400 p-8 mb-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-orange-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-orange-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-orange-400 mb-2 tracking-wider">
                🖼️ GERBIL NFT COLLECTION
              </h2>
              <p className="text-orange-300/70 font-mono">Cardano Native Assets</p>
            </div>

            {/* Connection Status Warning */}
            {!isConnected && (
              <div className="bg-red-600/20 border border-red-400 p-4 mb-6 text-center">
                <div className="text-red-400 font-mono font-bold mb-2">⚠️ WALLET NOT CONNECTED</div>
                <div className="text-red-300/70 font-mono text-sm mb-3">
                  You must connect your Lace wallet to claim Gerbil NFTs
                </div>
                <Link href="/wallet">
                  <button className="bg-red-600/30 border border-red-400 px-4 py-2 text-red-400 hover:bg-red-600/40 transition-colors font-mono">
                    CONNECT WALLET FIRST →
                  </button>
                </Link>
              </div>
            )}

            {/* Gerbil Claim Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gerbilClaimOptions.map((gerbil) => (
                <div key={gerbil.id} className="relative">
                  <div 
                    className={`bg-gray-900 border-2 p-4 relative transition-all duration-300 cursor-pointer ${
                      !gerbil.claimable 
                        ? 'border-gray-600 opacity-50' 
                        : claimedGerbils.includes(gerbil.id)
                        ? 'border-green-400 bg-green-400/10'
                        : isConnected
                        ? 'border-orange-400/50 hover:border-orange-400 hover:bg-orange-400/5'
                        : 'border-red-400/50 hover:border-red-400'
                    }`}
                    onClick={() => handleGerbilClaim(gerbil.id)}
                  >
                    {/* Corner brackets */}
                    <div className={`absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 ${
                      !gerbil.claimable ? 'border-gray-600' :
                      claimedGerbils.includes(gerbil.id) ? 'border-green-400' :
                      isConnected ? 'border-orange-400' : 'border-red-400'
                    }`} />
                    
                    {/* NFT Image */}
                    <div className="aspect-square bg-black border border-orange-400/30 mb-4 relative overflow-hidden">
                      <img
                        src={gerbil.image}
                        alt={gerbil.name}
                        className="w-full h-full object-contain"
                      />
                      
                      {/* Overlay for claimed/non-claimable */}
                      {claimedGerbils.includes(gerbil.id) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-green-400/20">
                          <div className="text-4xl text-green-400">✓</div>
                        </div>
                      )}
                      
                      {!gerbil.claimable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                          <div className="text-2xl text-gray-400">🔒</div>
                        </div>
                      )}
                      
                      {!isConnected && gerbil.claimable && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-900/60">
                          <div className="text-2xl text-red-400">⚠️</div>
                        </div>
                      )}
                    </div>
                    
                    {/* NFT Info */}
                    <div className="text-center">
                      <div className="font-mono text-orange-300 text-sm mb-2 truncate">
                        {gerbil.name}
                      </div>
                      <div className={`text-xs font-bold font-mono ${
                        gerbil.rarity === 'LEGENDARY' ? 'text-yellow-400' :
                        gerbil.rarity === 'EPIC' ? 'text-purple-400' :
                        gerbil.rarity === 'RARE' ? 'text-blue-400' : 'text-gray-400'
                      }`}>
                        {gerbil.rarity}
                      </div>
                      
                      {/* Status */}
                      <div className="mt-2 text-xs font-mono">
                        {claimedGerbils.includes(gerbil.id) ? (
                          <span className="text-green-400">CLAIMED</span>
                        ) : !gerbil.claimable ? (
                          <span className="text-gray-400">LOCKED</span>
                        ) : !isConnected ? (
                          <span className="text-red-400">CONNECT WALLET</span>
                        ) : (
                          <span className="text-orange-400">CLICK TO CLAIM</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 bg-gray-900 border border-orange-500/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl text-orange-400 font-mono font-bold mb-1">
                    {claimedGerbils.length}
                  </div>
                  <div className="text-xs text-orange-300/70 font-mono">CLAIMED</div>
                </div>
                <div>
                  <div className="text-2xl text-blue-400 font-mono font-bold mb-1">
                    {gerbilClaimOptions.filter(g => g.claimable).length}
                  </div>
                  <div className="text-xs text-blue-300/70 font-mono">AVAILABLE</div>
                </div>
                <div>
                  <div className="text-2xl text-gray-400 font-mono font-bold mb-1">
                    {gerbilClaimOptions.filter(g => !g.claimable).length}
                  </div>
                  <div className="text-xs text-gray-300/70 font-mono">LOCKED</div>
                </div>
                <div>
                  <div className="text-2xl text-purple-400 font-mono font-bold mb-1">
                    {gerbilClaimOptions.length}
                  </div>
                  <div className="text-xs text-purple-300/70 font-mono">TOTAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}