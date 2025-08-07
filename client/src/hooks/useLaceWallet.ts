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
    return typeof window !== 'undefined' && !!window.cardano?.lace;
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

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!isLaceAvailable()) return;

      try {
        const laceAPI = window.cardano!.lace!;
        const isEnabled = await laceAPI.isEnabled();
        
        if (isEnabled) {
          // Auto-reconnect if previously connected
          await connectWallet();
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    // Wait a bit for the extension to load
    const timer = setTimeout(checkConnection, 1000);
    return () => clearTimeout(timer);
  }, []);

  return {
    ...walletState,
    isLaceAvailable: isLaceAvailable(),
    connectWallet,
    disconnectWallet
  };
}