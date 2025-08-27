import { Link } from 'wouter';
import { ArrowLeft, Shield, Key, Activity, Database, Cpu } from 'lucide-react';
import { RetroWalletButton } from '@/components/RetroWalletButton';
import { RetroWalletScanner } from '@/components/RetroWalletScanner';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function WalletScreen() {
  const { isConnected, address, balance, connectWallet } = useLaceWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Unity Professional Header */}
      <div className="unity-toolbar bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b-2 border-green-400 relative overflow-hidden">
        <div className="data-stream top-0 w-20 opacity-20" style={{ animationDelay: '0.5s' }} />
        <div className="data-stream top-2 w-16 opacity-30" style={{ animationDelay: '2s' }} />
        
        <div className="flex items-center justify-between h-16 px-6 relative z-10">
          <Link href="/mainhub">
            <button className="unity-button flex items-center space-x-2 text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO HUB</span>
            </button>
          </Link>
          
          <div className="unity-header text-center">
            <h1 className="text-lg font-bold text-green-300 tracking-wider" style={{ fontFamily: 'Source Code Pro' }}>
              LACE WALLET INTERFACE
            </h1>
            <div className="text-xs text-green-400/70 font-mono">ACCESS_CONTROL_v2.1</div>
          </div>
          
          <div className="hud-element">
            <Shield className="w-4 h-4 mr-1" />
            <span>SECURE</span>
          </div>
        </div>
      </div>

      {/* Unity Inspector-style Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Primary Access Panel */}
          <div className="unity-inspector mb-8">
            <div className="unity-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>CARDANO WALLET MODULE</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Key className="w-3 h-3 text-green-400" />
                  <span className="text-green-400 text-xs">AUTHENTICATION REQUIRED</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="unity-gizmo inline-block mb-4">
                  <div className="text-6xl filter drop-shadow-lg">🔗</div>
                </div>
                <h2 className="text-2xl font-bold text-green-300 mb-2 tracking-wide" style={{ fontFamily: 'Source Code Pro' }}>
                  LACE WALLET AUTHENTICATION
                </h2>
                <p className="text-gray-400 font-mono text-sm">Secure access to Cardano blockchain • Gerbil NFT verification</p>
              </div>

              {/* Connection Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Panel: Player Avatar & Status */}
                <div className="game-ui-card p-6">
                  <div className="unity-header mb-4">PLAYER IDENTITY</div>
                  
                  <div className="text-center mb-6">
                    <div className="unity-gizmo inline-block mb-4">
                      <div className="w-20 h-20 mx-auto">
                        <LemmiAvatar variant="large" />
                      </div>
                    </div>
                    
                    <div className="font-mono text-sm text-gray-300 mb-4">
                      GERBIL OPERATOR #{Math.floor(Math.random() * 9999).toString().padStart(4, '0')}
                    </div>
                    
                    <div className={`hud-element inline-block ${isConnected ? 'text-green-400' : 'text-orange-400'}`}>
                      <Activity className="w-3 h-3 mr-1" />
                      <span className="text-xs font-bold">
                        {isConnected ? 'AUTHENTICATED' : 'AWAITING AUTH'}
                      </span>
                    </div>
                  </div>

                  {/* Player Stats */}
                  <div className="space-y-3">
                    <div className="unity-panel p-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400">ACCESS LEVEL:</span>
                        <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                          {isConnected ? 'BLOCKCHAIN_USER' : 'GUEST'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400">NFT STATUS:</span>
                        <span className={isConnected ? 'text-green-400' : 'text-gray-500'}>
                          {isConnected ? 'VERIFIED' : 'PENDING'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-400">WALLET BALANCE:</span>
                        <span className="text-purple-400">
                          {balance ? `${balance} ADA` : '---.--- ADA'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel: Wallet Connection */}
                <div className="game-ui-card p-6">
                  <div className="unity-header mb-4">BLOCKCHAIN CONNECTION</div>
                  
                  {!isConnected ? (
                    <div className="text-center">
                      <div className="mb-6">
                        <div className="text-4xl mb-4">🔐</div>
                        <h3 className="text-lg text-orange-400 font-bold font-mono mb-2">
                          LACE WALLET REQUIRED
                        </h3>
                        <p className="text-gray-400 text-sm font-mono mb-6">
                          Connect your Lace wallet to access Gerbil NFTs and start claiming rewards
                        </p>
                      </div>
                      
                      <RetroWalletButton />
                      
                      <div className="mt-6 p-4 bg-yellow-600/20 border border-yellow-400/50 rounded">
                        <div className="text-yellow-400 font-mono font-bold text-xs mb-2">⚠️ AUTHENTICATION REQUIRED</div>
                        <div className="text-yellow-300/80 font-mono text-xs">
                          Install and connect Lace wallet to access full functionality
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-center mb-6">
                        <div className="text-4xl mb-4 animate-pulse">✅</div>
                        <h3 className="text-lg text-green-400 font-bold font-mono mb-2">
                          CONNECTION ESTABLISHED
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">
                          Lace wallet authenticated • Blockchain access granted
                        </p>
                      </div>
                      
                      {/* Connected Wallet Details */}
                      <div className="space-y-3">
                        <div className="unity-console p-3">
                          <div className="text-xs text-green-400 font-mono font-bold mb-1">WALLET ADDRESS:</div>
                          <div className="text-xs text-green-300 font-mono break-all">
                            {address ? `${address.slice(0, 16)}...${address.slice(-16)}` : 'Loading...'}
                          </div>
                        </div>
                        
                        <div className="unity-panel p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Database className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs text-cyan-400 font-mono">CARDANO NETWORK</span>
                            </div>
                            <div className="text-xs text-green-400 font-mono">MAINNET</div>
                          </div>
                        </div>
                        
                        <div className="unity-panel p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Cpu className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-400 font-mono">PROTOCOL</span>
                            </div>
                            <div className="text-xs text-green-400 font-mono">ACTIVE</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Security Scanner */}
              {isConnected && (
                <div className="mt-8">
                  <div className="unity-panel p-6">
                    <div className="unity-header mb-4">BLOCKCHAIN SCANNER</div>
                    <RetroWalletScanner 
                      onConnect={connectWallet}
                      isConnected={isConnected}
                      address={address || undefined}
                      hasNft={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional System Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="game-ui-card p-4 text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-xs text-blue-900 font-mono font-bold mb-1">SECURITY LEVEL</div>
                        <div className="text-xs text-blue-900 font-mono">MAXIMUM</div>
            </div>
            
            <div className="game-ui-card p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-xs text-yellow-400 font-mono font-bold mb-1">CONNECTION SPEED</div>
              <div className="text-xs text-yellow-300 font-mono">OPTIMAL</div>
            </div>
            
            <div className="game-ui-card p-4 text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="text-xs text-red-400 font-mono font-bold mb-1">SYSTEM STATUS</div>
              <div className="text-xs text-red-300 font-mono">READY</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}