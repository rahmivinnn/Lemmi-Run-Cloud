import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import { RetroWalletButton } from '@/components/RetroWalletButton';
import { RetroWalletScanner } from '@/components/RetroWalletScanner';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function WalletScreen() {
  const { isConnected, address, balance, connectWallet } = useLaceWallet();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-green-400 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-green-400 hover:text-green-300 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-green-400 tracking-wider">
            PLAYER ACCESS
          </h1>
          <div className="bg-black border border-green-400 px-3 py-1 font-mono text-xs">
            ACCESS_CONTROL.EXE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Player Access Panel */}
          <div className="bg-black border-2 border-green-400 p-8 mb-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-green-400" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-green-400" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-green-400" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-green-400" />
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-mono font-bold text-green-400 mb-2 tracking-wider">
                🔗 ACCESS CONTROL
              </h2>
              <p className="text-green-300/70 font-mono">Gerbil NFT Verification</p>
            </div>

            {/* Wallet Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-900 border border-green-500/50 p-6">
                  <h3 className="font-mono font-bold text-green-400 mb-4 text-center">
                    WALLET CONNECTION
                  </h3>
                  <div className="flex justify-center">
                    <RetroWalletButton />
                  </div>
                </div>

                <div className="bg-gray-900 border border-green-500/50 p-6">
                  <h3 className="font-mono font-bold text-green-400 mb-4 text-center">
                    NFT VERIFICATION
                  </h3>
                  <div className="flex justify-center">
                    <RetroWalletScanner
                      onConnect={connectWallet}
                      isConnected={isConnected}
                      address={address || undefined}
                      hasNft={false}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Access Level */}
                <div className="bg-gray-900 border border-green-500/50 p-6">
                  <h3 className="font-mono font-bold text-green-400 mb-4 text-center">
                    ACCESS LEVEL
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl text-green-400 font-mono font-bold mb-2">
                      {isConnected ? "GUEST" : "OFFLINE"}
                    </div>
                    <div className="text-sm text-green-300/70 font-mono">
                      {isConnected ? "Limited access granted" : "No connection detected"}
                    </div>
                  </div>
                </div>

                {/* NFT Status */}
                <div className="bg-gray-900 border border-green-500/50 p-6">
                  <h3 className="font-mono font-bold text-green-400 mb-4 text-center">
                    NFT STATUS
                  </h3>
                  <div className="text-center">
                    <div className="text-2xl text-red-400 mb-2">❌</div>
                    <div className="text-sm text-red-300 font-mono">
                      NO NFT FOUND
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Instructions */}
            {!isConnected && (
              <div className="mt-8 bg-black/60 border border-green-400/30 p-6">
                <h3 className="font-mono font-bold text-green-400 mb-4 text-center">
                  CONNECTION PROTOCOL
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="font-mono text-sm">
                    <div className="text-green-400 mb-2">STEP 1</div>
                    <div className="text-green-300/70">Install Lace Wallet</div>
                  </div>
                  <div className="font-mono text-sm">
                    <div className="text-green-400 mb-2">STEP 2</div>
                    <div className="text-green-300/70">Connect to Network</div>
                  </div>
                  <div className="font-mono text-sm">
                    <div className="text-green-400 mb-2">STEP 3</div>
                    <div className="text-green-300/70">Verify Gerbil NFT</div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Pathways */}
            <div className="mt-8 text-center">
              <h3 className="font-mono font-bold text-green-400 mb-4">ACTIVE PATHWAYS</h3>
              <div className="text-6xl text-green-400/20 font-mono">0/7</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}