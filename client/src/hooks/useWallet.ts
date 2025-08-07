import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletState {
  walletAddress: string | null;
  isConnected: boolean;
  hasGerbilNft: boolean;
  lemmiBalance: number;
  chain: 'ethereum' | 'solana' | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    walletAddress: null,
    isConnected: false,
    hasGerbilNft: false,
    lemmiBalance: 0,
    chain: null,
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check for existing wallet connection on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      // Check MetaMask
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletState(prev => ({
            ...prev,
            walletAddress: accounts[0],
            isConnected: true,
            chain: 'ethereum'
          }));
        }
      }
      
      // Check Phantom
      if (window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect({ onlyIfTrusted: true });
        if (response.publicKey) {
          setWalletState(prev => ({
            ...prev,
            walletAddress: response.publicKey.toString(),
            isConnected: true,
            chain: 'solana'
          }));
        }
      }
    } catch (error) {
      console.log("No existing wallet connection");
    }
  };

  // NFT verification query
  const { data: nftData } = useQuery({
    queryKey: ["/api/wallet", walletState.walletAddress, "nfts"],
    enabled: !!walletState.walletAddress,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Token balance query
  const { data: tokenData } = useQuery({
    queryKey: ["/api/wallet", walletState.walletAddress, "lemmi"],
    enabled: !!walletState.walletAddress,
    refetchInterval: 30000,
  });

  // Create/update wallet mutation
  const walletMutation = useMutation({
    mutationFn: async (walletData: any) => {
      const response = await apiRequest("POST", "/api/wallet", walletData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
  });

  const connectWallet = useCallback(async (preferredChain: 'ethereum' | 'solana' = 'ethereum') => {
    try {
      let address = "";
      let chain: 'ethereum' | 'solana' = preferredChain;

      if (preferredChain === 'ethereum' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
        chain = 'ethereum';
      } else if (preferredChain === 'solana' && window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        address = response.publicKey.toString();
        chain = 'solana';
      } else {
        throw new Error(`${preferredChain} wallet not found`);
      }

      setWalletState(prev => ({
        ...prev,
        walletAddress: address,
        isConnected: true,
        chain
      }));

      // Create/update wallet in backend
      await walletMutation.mutateAsync({
        address,
        chain,
        hasGerbilNft: false,
        lemmiBalance: 0
      });

      toast({
        title: "Wallet Connected",
        description: `Connected to ${chain} wallet: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  }, [walletMutation, toast]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      walletAddress: null,
      isConnected: false,
      hasGerbilNft: false,
      lemmiBalance: 0,
      chain: null,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected successfully",
    });
  }, [toast]);

  // Update wallet state when data changes
  useEffect(() => {
    if (nftData) {
      setWalletState(prev => ({
        ...prev,
        hasGerbilNft: nftData.hasGerbilNft || false
      }));
    }
  }, [nftData]);

  useEffect(() => {
    if (tokenData) {
      setWalletState(prev => ({
        ...prev,
        lemmiBalance: tokenData.balance || 0
      }));
    }
  }, [tokenData]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    isLoading: walletMutation.isPending,
  };
}

// Extend window object for TypeScript
declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}
