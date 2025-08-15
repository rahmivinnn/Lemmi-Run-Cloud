import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowLeft, TrendingUp, DollarSign, Zap, Coins, BarChart3, Activity, ArrowRightLeft, Eye, Calculator } from 'lucide-react';
import { LemmiAvatar } from '@/components/LemmiAvatar';
import { useLaceWallet } from '@/hooks/useLaceWallet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function CurrencyScreen() {
  const { isConnected, balance } = useLaceWallet();
  const { toast } = useToast();
  const [lemmiBalance] = useState(Math.floor(Math.random() * 5000) + 1000);
  const [winksBalance] = useState(Math.floor(Math.random() * 15000) + 5000);
  const [lemmiPrice] = useState((Math.random() * 0.05 + 0.01).toFixed(6));
  const [dailyChange] = useState(((Math.random() - 0.5) * 20).toFixed(2));
  const [marketCap] = useState('$2.1M');
  const [volume24h] = useState('$156K');
  const [circulating] = useState('45.2M');
  const [exchangeRate] = useState(100); // 100 winks = 1 LEMMI
  const [winksToExchange, setWinksToExchange] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Unity Professional Header */}
      <div className="unity-toolbar bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border-b-2 border-purple-400 relative overflow-hidden">
        <div className="data-stream top-0 w-24 opacity-25" style={{ animationDelay: '1s' }} />
        <div className="data-stream top-1 w-18 opacity-15" style={{ animationDelay: '3s' }} />
        
        <div className="flex items-center justify-between h-16 px-6 relative z-10">
          <Link href="/">
            <button className="unity-button flex items-center space-x-2 text-purple-400 hover:text-purple-300">
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO HUB</span>
            </button>
          </Link>
          
          <div className="unity-header text-center">
            <h1 className="text-lg font-bold text-purple-300 tracking-wider" style={{ fontFamily: 'Source Code Pro' }}>
              CURRENCY MANAGEMENT SYSTEM
            </h1>
            <div className="text-xs text-purple-400/70 font-mono">ECONOMY_ENGINE_v2.1</div>
          </div>
          
          <div className="hud-element">
            <DollarSign className="w-4 h-4 mr-1" />
            <span>TRADING</span>
          </div>
        </div>
      </div>

      {/* Unity Inspector-style Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Primary Currency Panel */}
          <div className="unity-inspector mb-8">
            <div className="unity-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <span>$LEMMI TOKEN ECONOMICS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400 text-xs">LIVE MARKET DATA</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="text-center mb-8">
                <div className="unity-gizmo inline-block mb-4">
                  <div className="text-6xl filter drop-shadow-lg">💎</div>
                </div>
                <h2 className="text-2xl font-bold text-purple-300 mb-2 tracking-wide" style={{ fontFamily: 'Source Code Pro' }}>
                  LEMMI TOKEN ECOSYSTEM
                </h2>
                <p className="text-gray-400 font-mono text-sm">Cardano native token • Gaming utility • Staking rewards</p>
              </div>

              {/* Token Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                {/* Price */}
                <div className="game-ui-card border-purple-400/60 hover:border-purple-400">
                  <div className="unity-tab active bg-purple-500/20 border-b border-purple-400/40 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-3 h-3 text-purple-400" />
                        <span className="text-xs font-mono font-bold text-gray-300">PRICE</span>
                      </div>
                      <div className={`text-xs font-mono px-2 py-1 rounded ${
                        parseFloat(dailyChange) >= 0 ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
                      }`}>
                        {parseFloat(dailyChange) >= 0 ? '+' : ''}{dailyChange}%
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-300 font-mono mb-1">
                      ${lemmiPrice}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">USD per LEMMI</div>
                  </div>
                </div>
                
                {/* Market Cap */}
                <div className="game-ui-card border-cyan-400/60 hover:border-cyan-400">
                  <div className="unity-tab active bg-cyan-500/20 border-b border-cyan-400/40 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-3 h-3 text-cyan-400" />
                      <span className="text-xs font-mono font-bold text-gray-300">MARKET CAP</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-300 font-mono mb-1">
                      {marketCap}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">Total value locked</div>
                  </div>
                </div>
                
                {/* Volume */}
                <div className="game-ui-card border-green-400/60 hover:border-green-400">
                  <div className="unity-tab active bg-green-500/20 border-b border-green-400/40 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-mono font-bold text-gray-300">24H VOLUME</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-300 font-mono mb-1">
                      {volume24h}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">Trading volume</div>
                  </div>
                </div>
                
                {/* Supply */}
                <div className="game-ui-card border-yellow-400/60 hover:border-yellow-400">
                  <div className="unity-tab active bg-yellow-500/20 border-b border-yellow-400/40 px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs font-mono font-bold text-gray-300">CIRCULATING</span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-300 font-mono mb-1">
                      {circulating}
                    </div>
                    <div className="text-xs text-gray-400 font-mono">LEMMI tokens</div>
                  </div>
                </div>
              </div>

              {/* Portfolio Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* User Portfolio */}
                <div className="game-ui-card p-6">
                  <div className="unity-header mb-4">YOUR PORTFOLIO</div>
                  
                  <div className="text-center mb-6">
                    <div className="unity-gizmo inline-block mb-4">
                      <div className="w-16 h-16 mx-auto">
                        <LemmiAvatar variant="small" />
                      </div>
                    </div>
                    
                    <div className="font-mono text-sm text-gray-300 mb-4">
                      GERBIL WALLET BALANCE
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* LEMMI Balance */}
                    <div className="unity-panel p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">L</span>
                          </div>
                          <span className="text-purple-300 font-mono font-bold">LEMMI</span>
                        </div>
                        <span className="text-purple-400 text-xs font-mono">GAMING TOKEN</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-300 font-mono">
                          {lemmiBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          ≈ ${(lemmiBalance * parseFloat(lemmiPrice)).toFixed(2)} USD
                        </div>
                      </div>
                    </div>
                    
                    {/* Winks Balance */}
                    <div className="unity-panel p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Eye className="w-3 h-3 text-black" />
                          </div>
                          <span className="text-yellow-300 font-mono font-bold">WINKS</span>
                        </div>
                        <span className="text-yellow-400 text-xs font-mono">GAME CURRENCY</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-300 font-mono">
                          {winksBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Earned through gameplay
                        </div>
                      </div>
                    </div>
                    
                    {/* ADA Balance */}
                    <div className="unity-panel p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold">₳</span>
                          </div>
                          <span className="text-blue-300 font-mono font-bold">ADA</span>
                        </div>
                        <span className="text-blue-400 text-xs font-mono">CARDANO</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-300 font-mono">
                          {balance || '----.---'}
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Base currency
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Winks Exchange */}
                <div className="game-ui-card p-6 border-yellow-400/60">
                  <div className="unity-header mb-4">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="w-4 h-4 text-yellow-400" />
                      <span>WINKS EXCHANGE</span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🪙</div>
                    <h3 className="text-lg font-bold text-yellow-300 mb-2" style={{ fontFamily: 'Source Code Pro' }}>
                      CONVERT WINKS TO LEMMI
                    </h3>
                    <p className="text-gray-400 font-mono text-sm">
                      Exchange your gameplay rewards for valuable LEMMI tokens
                    </p>
                  </div>

                  {/* Exchange Rate Display */}
                  <div className="unity-panel p-4 mb-6 bg-yellow-600/10 border border-yellow-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300 font-mono font-bold">EXCHANGE RATE</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-yellow-300 font-mono">
                          {exchangeRate} WINKS = 1 LEMMI
                        </div>
                        <div className="text-xs text-gray-400 font-mono">
                          Current market rate
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Exchange Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-mono text-yellow-400 mb-2">
                        WINKS TO EXCHANGE
                      </label>
                      <Input
                        type="number"
                        placeholder={`Max: ${winksBalance.toLocaleString()}`}
                        value={winksToExchange}
                        onChange={(e) => setWinksToExchange(e.target.value)}
                        className="unity-input text-center text-lg font-mono"
                        max={winksBalance}
                      />
                    </div>
                    
                    {winksToExchange && (
                      <div className="unity-panel p-3 bg-purple-600/10 border border-purple-400/30">
                        <div className="text-center">
                          <div className="text-xs text-purple-400 font-mono mb-1">YOU WILL RECEIVE</div>
                          <div className="text-xl font-bold text-purple-300 font-mono">
                            {(parseInt(winksToExchange) / exchangeRate).toFixed(2)} LEMMI
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setWinksToExchange(String(Math.floor(winksBalance * 0.25)))}
                        className="flex-1 unity-button text-xs"
                        variant="outline"
                      >
                        25%
                      </Button>
                      <Button
                        onClick={() => setWinksToExchange(String(Math.floor(winksBalance * 0.5)))}
                        className="flex-1 unity-button text-xs"
                        variant="outline"
                      >
                        50%
                      </Button>
                      <Button
                        onClick={() => setWinksToExchange(String(Math.floor(winksBalance * 0.75)))}
                        className="flex-1 unity-button text-xs"
                        variant="outline"
                      >
                        75%
                      </Button>
                      <Button
                        onClick={() => setWinksToExchange(String(winksBalance))}
                        className="flex-1 unity-button text-xs"
                        variant="outline"
                      >
                        MAX
                      </Button>
                    </div>
                    
                    <Button
                      onClick={async () => {
                        if (!winksToExchange || parseInt(winksToExchange) <= 0) {
                          toast({
                            title: "Invalid Amount",
                            description: "Please enter a valid amount of winks to exchange",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        if (parseInt(winksToExchange) > winksBalance) {
                          toast({
                            title: "Insufficient Winks",
                            description: "You don't have enough winks for this exchange",
                            variant: "destructive"
                          });
                          return;
                        }
                        
                        setIsExchanging(true);
                        
                        // Simulate exchange process
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        toast({
                          title: "Exchange Successful!",
                          description: `Converted ${parseInt(winksToExchange).toLocaleString()} winks to ${(parseInt(winksToExchange) / exchangeRate).toFixed(2)} LEMMI`,
                        });
                        
                        setWinksToExchange('');
                        setIsExchanging(false);
                      }}
                      disabled={!winksToExchange || parseInt(winksToExchange) <= 0 || parseInt(winksToExchange) > winksBalance || isExchanging}
                      className="w-full unity-button bg-yellow-600/20 border-yellow-400 text-yellow-300 hover:bg-yellow-600/40 font-mono font-bold py-3"
                    >
                      {isExchanging ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full" />
                          <span>PROCESSING EXCHANGE...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <ArrowRightLeft className="w-4 h-4" />
                          <span>EXCHANGE WINKS TO LEMMI</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Token Utilities */}
                <div className="game-ui-card p-6">
                  <div className="unity-header mb-4">TOKEN UTILITIES</div>
                  
                  <div className="space-y-4">
                    <div className="unity-panel p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🎮</div>
                        <div>
                          <div className="text-sm text-green-300 font-mono font-bold">GAMING REWARDS</div>
                          <div className="text-xs text-gray-400 font-mono">Earn winks & LEMMI by playing games</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🪙</div>
                        <div>
                          <div className="text-sm text-yellow-300 font-mono font-bold">WINKS EXCHANGE</div>
                          <div className="text-xs text-gray-400 font-mono">Convert gameplay winks to LEMMI tokens</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🏆</div>
                        <div>
                          <div className="text-sm text-yellow-300 font-mono font-bold">NFT CLAIMS</div>
                          <div className="text-xs text-gray-400 font-mono">Daily rewards for NFT holders</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">⚡</div>
                        <div>
                          <div className="text-sm text-purple-300 font-mono font-bold">STAKING REWARDS</div>
                          <div className="text-xs text-gray-400 font-mono">Stake tokens for passive income</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="unity-panel p-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg">🛒</div>
                        <div>
                          <div className="text-sm text-cyan-300 font-mono font-bold">IN-GAME PURCHASES</div>
                          <div className="text-xs text-gray-400 font-mono">Buy items and upgrades</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trading Interface */}
          {isConnected && (
            <div className="unity-inspector">
              <div className="unity-header">
                <div className="flex items-center justify-between">
                  <span>TRADING INTERFACE</span>
                  <div className="text-xs text-green-400">LIVE MARKET</div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-purple-300 mb-2" style={{ fontFamily: 'Source Code Pro' }}>
                    DECENTRALIZED EXCHANGE
                  </h3>
                  <p className="text-gray-400 font-mono text-sm">
                    Trade LEMMI tokens on Cardano DEX protocols
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="game-ui-card p-4 text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm text-green-400 font-mono font-bold mb-1">MINSWAP</div>
                    <div className="text-xs text-gray-400 font-mono">Available</div>
                  </div>
                  
                  <div className="game-ui-card p-4 text-center">
                    <div className="text-2xl mb-2">🌊</div>
                    <div className="text-sm text-blue-400 font-mono font-bold mb-1">SUNDAESWAP</div>
                    <div className="text-xs text-gray-400 font-mono">Available</div>
                  </div>
                  
                  <div className="game-ui-card p-4 text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-sm text-purple-400 font-mono font-bold mb-1">WINGRIDERS</div>
                    <div className="text-xs text-gray-400 font-mono">Available</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isConnected && (
            <div className="unity-panel p-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg text-orange-400 font-bold font-mono mb-2">
                WALLET CONNECTION REQUIRED
              </h3>
              <p className="text-gray-400 text-sm font-mono mb-4">
                Connect your Lace wallet to access trading features
              </p>
              <Link href="/wallet">
                <button className="unity-button text-orange-400 hover:text-orange-300">
                  CONNECT WALLET →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}