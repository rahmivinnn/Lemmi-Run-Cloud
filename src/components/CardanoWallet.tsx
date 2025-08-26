import React, { useState, useEffect } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  winksBalance: number;
  lemmiBalance: number;
}

interface CardanoWalletProps {
  onWalletConnect?: (address: string) => void;
  onWalletDisconnect?: () => void;
}

export function CardanoWallet({ onWalletConnect, onWalletDisconnect }: CardanoWalletProps) {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: 0,
    winksBalance: 0,
    lemmiBalance: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Lace wallet is available
  const isLaceAvailable = () => {
    return typeof window !== 'undefined' && window.cardano && window.cardano.lace;
  };

  // Connect to Lace wallet
  const connectWallet = async () => {
    if (!isLaceAvailable()) {
      setError('Lace wallet not found. Please install Lace wallet extension.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const lace = window.cardano.lace;
      const isEnabled = await lace.isEnabled();
      
      if (!isEnabled) {
        await lace.enable();
      }

      const addresses = await lace.getUsedAddresses();
      const address = addresses[0];
      
      if (address) {
        // Get wallet balance from CardanoScan API
        const balance = await getWalletBalance(address);
        const { winksBalance, lemmiBalance } = await getTokenBalances(address);
        
        setWalletState({
          isConnected: true,
          address,
          balance,
          winksBalance,
          lemmiBalance
        });
        
        onWalletConnect?.(address);
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect to Lace wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletState({
      isConnected: false,
      address: null,
      balance: 0,
      winksBalance: 0,
      lemmiBalance: 0
    });
    onWalletDisconnect?.();
  };

  // Get wallet balance from CardanoScan
  const getWalletBalance = async (address: string): Promise<number> => {
    try {
      // Mock API call to CardanoScan - replace with actual API
      const response = await fetch(`https://cardanoscan.io/api/address/${address}`);
      if (response.ok) {
        const data = await response.json();
        return data.balance || 0;
      }
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
    return 0;
  };

  // Get token balances (WINKS and LEMMI)
  const getTokenBalances = async (address: string): Promise<{ winksBalance: number; lemmiBalance: number }> => {
    try {
      // Mock API call - replace with actual token balance API
      const response = await fetch(`https://cardanoscan.io/api/address/${address}/tokens`);
      if (response.ok) {
        const data = await response.json();
        const winksBalance = data.tokens?.find((t: any) => t.name === 'WINKS')?.amount || 0;
        const lemmiBalance = data.tokens?.find((t: any) => t.name === 'LEMMI')?.amount || 0;
        return { winksBalance, lemmiBalance };
      }
    } catch (err) {
      console.error('Failed to fetch token balances:', err);
    }
    return { winksBalance: 0, lemmiBalance: 0 };
  };

  // Convert WINKS to LEMMI COIN
  const convertWinksToLemmi = async (winksAmount: number) => {
    if (winksAmount < 1000) {
      setError('Minimum 1000 WINKS required for conversion');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Mock conversion logic - replace with actual smart contract interaction
      const lemmiAmount = Math.floor(winksAmount / 1000);
      
      // Update local state (in real implementation, this would be done after blockchain confirmation)
      setWalletState(prev => ({
        ...prev,
        winksBalance: prev.winksBalance - (lemmiAmount * 1000),
        lemmiBalance: prev.lemmiBalance + lemmiAmount
      }));
      
      console.log(`Converted ${lemmiAmount * 1000} WINKS to ${lemmiAmount} LEMMI COIN`);
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Conversion failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-connect if wallet was previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (isLaceAvailable()) {
        const lace = window.cardano.lace;
        const isEnabled = await lace.isEnabled();
        if (isEnabled) {
          connectWallet();
        }
      }
    };
    
    autoConnect();
  }, []);

  return {
    walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    convertWinksToLemmi,
    isLaceAvailable: isLaceAvailable()
  };
}

// Wallet connection component
export function WalletConnector() {
  const {
    walletState,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    convertWinksToLemmi,
    isLaceAvailable
  } = CardanoWallet({});

  const [convertAmount, setConvertAmount] = useState<number>(1000);

  if (!isLaceAvailable) {
    return (
      <div className="bg-black/60 border border-red-400/50 p-4 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400 animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 animate-pulse"></div>
        <div className="text-center">
          <h4 className="text-red-400 font-orbitron font-bold mb-2 text-sm tracking-wider">LACE WALLET NOT FOUND</h4>
          <p className="text-red-300/80 font-mono text-xs mb-3">Please install Lace wallet extension</p>
          <a 
            href="https://www.lace.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-black border border-red-400 px-4 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative transition-all duration-300 text-xs"
          >
            INSTALL LACE
          </a>
        </div>
      </div>
    );
  }

  if (!walletState.isConnected) {
    return (
      <div className="bg-black/60 border border-orange-400/50 p-4 relative">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
        <div className="text-center">
          <h4 className="text-orange-400 font-orbitron font-bold mb-2 text-sm tracking-wider">CARDANO WALLET</h4>
          <p className="text-orange-300/80 font-mono text-xs mb-3">Connect your Lace wallet to access WINKS conversion</p>
          {error && (
            <p className="text-red-400 font-mono text-xs mb-3">{error}</p>
          )}
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-black border border-orange-400 px-4 py-2 text-orange-400 font-orbitron font-bold tracking-wider hover:bg-orange-900/20 relative transition-all duration-300 disabled:opacity-50 text-xs"
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400 animate-pulse"></div>
            {isLoading ? 'CONNECTING...' : '🔗 CONNECT LACE'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/60 border border-green-400/50 p-4 relative">
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 animate-pulse"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 animate-pulse"></div>
      
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-green-400 font-orbitron font-bold text-sm tracking-wider">WALLET CONNECTED</h4>
        <button
          onClick={disconnectWallet}
          className="text-red-400 hover:text-red-300 font-mono text-xs"
        >
          DISCONNECT
        </button>
      </div>
      
      <div className="text-xs font-mono text-gray-400 mb-3">
        {walletState.address?.slice(0, 8)}...{walletState.address?.slice(-8)}
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
        <div className="text-center">
          <div className="text-cyan-400 font-bold">{walletState.balance.toFixed(2)}</div>
          <div className="text-gray-400">ADA</div>
        </div>
        <div className="text-center">
          <div className="text-yellow-400 font-bold">{walletState.winksBalance}</div>
          <div className="text-gray-400">WINKS</div>
        </div>
        <div className="text-center">
          <div className="text-orange-400 font-bold">{walletState.lemmiBalance}</div>
          <div className="text-gray-400">LEMMI</div>
        </div>
      </div>
      
      {error && (
        <p className="text-red-400 font-mono text-xs mb-3">{error}</p>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <input
          type="number"
          min="1000"
          step="1000"
          value={convertAmount}
          onChange={(e) => setConvertAmount(Number(e.target.value))}
          className="bg-black border border-gray-600 text-white px-2 py-1 text-xs flex-1"
          placeholder="WINKS amount"
        />
        <button
          onClick={() => convertWinksToLemmi(convertAmount)}
          disabled={isLoading || convertAmount < 1000 || walletState.winksBalance < convertAmount}
          className="bg-black border border-orange-400 px-3 py-1 text-orange-400 font-orbitron font-bold tracking-wider hover:bg-orange-900/20 relative transition-all duration-300 disabled:opacity-50 text-xs"
        >
          {isLoading ? 'CONVERTING...' : 'CONVERT'}
        </button>
      </div>
      
      <div className="text-center text-xs text-gray-400">
        Rate: 1000 WINKS = 1 LEMMI COIN
      </div>
    </div>
  );
}

// Type declarations for Cardano wallet
declare global {
  interface Window {
    cardano?: {
      lace?: {
        isEnabled(): Promise<boolean>;
        enable(): Promise<void>;
        getUsedAddresses(): Promise<string[]>;
        getUnusedAddresses(): Promise<string[]>;
        getBalance(): Promise<string>;
        signTx(tx: string): Promise<string>;
        submitTx(tx: string): Promise<string>;
      };
    };
  }
}