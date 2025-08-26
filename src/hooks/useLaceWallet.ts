import { useState, useEffect } from 'react';

interface LaceAPI {
  isEnabled(): Promise<boolean>;
  enable(): Promise<any>;
  getBalance(): Promise<string>;
  getChangeAddress(): Promise<string>;
  getNetworkId(): Promise<number>;
  getUtxos(): Promise<any[]>;
  signTx(tx: string): Promise<string>;
  submitTx(tx: string): Promise<string>;
}

declare global {
  interface Window {
    cardano?: {
      lace?: LaceAPI;
    };
  }
}

export interface WalletState {
  isConnected: boolean;
  isLoading: boolean;
  address: string | null;
  balance: string | null;
  networkId: number | null;
  error: string | null;
}

export function useLaceWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    isLoading: false,
    address: null,
    balance: null,
    networkId: null,
    error: null
  });

  // Check if Lace is available
  const isLaceAvailable = (): boolean => {
    const available = typeof window !== 'undefined' && !!window.cardano?.lace;
    if (available) {
      console.log('Lace wallet detected and available');
    }
    return available;
  };

  // Connect to Lace wallet
  const connectWallet = async (): Promise<void> => {
    if (!isLaceAvailable()) {
      setWalletState(prev => ({
        ...prev,
        error: 'Lace wallet not found. Please install Lace wallet extension.',
        isLoading: false
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const laceAPI = window.cardano!.lace!;
      
      // Enable the wallet
      const walletAPI = await laceAPI.enable();
      console.log('Lace wallet enabled:', walletAPI);

      // Get wallet information
      const [address, balance, networkId] = await Promise.all([
        walletAPI.getChangeAddress(),
        walletAPI.getBalance(),
        walletAPI.getNetworkId()
      ]);

      setWalletState({
        isConnected: true,
        isLoading: false,
        address,
        balance,
        networkId,
        error: null
      });

      console.log('Wallet connected:', { address, balance, networkId });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWalletState(prev => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet'
      }));
    }
  };

  // Disconnect wallet
  const disconnectWallet = (): void => {
    setWalletState({
      isConnected: false,
      isLoading: false,
      address: null,
      balance: null,
      networkId: null,
      error: null
    });
  };

  // Check connection on mount and detect Lace
  useEffect(() => {
    const checkConnection = async () => {
      console.log('Lace wallet detected, checking connection...');
      if (!isLaceAvailable()) {
        console.log('Lace wallet not available yet, retrying...');
        return;
      }

      try {
        const laceAPI = window.cardano!.lace!;
        console.log('Lace enabled:', await laceAPI.isEnabled());
        const isEnabled = await laceAPI.isEnabled();
        
        if (isEnabled) {
          console.log('Lace already enabled, auto-connecting...');
          // Auto-reconnect if previously connected
          await connectWallet();
        } else {
          console.log('Lace available but not enabled');
        }
      } catch (error) {
        console.error('Error checking Lace connection:', error);
      }
    };

    // Check multiple times to ensure Lace is loaded
    const timer1 = setTimeout(checkConnection, 500);
    const timer2 = setTimeout(checkConnection, 1500);
    const timer3 = setTimeout(checkConnection, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return {
    ...walletState,
    isLaceAvailable: isLaceAvailable(),
    connectWallet,
    disconnectWallet
  };
}