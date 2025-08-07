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
      // Check Lace wallet for Cardano
      if (window.cardano?.lace) {
        const lace = window.cardano.lace;
        const isEnabled = await lace.isEnabled();
        if (isEnabled) {
          const addresses = await lace.getUsedAddresses();
          if (addresses && addresses.length > 0) {
            setWalletState(prev => ({
              ...prev,
              walletAddress: addresses[0],
              isConnected: true,
              chain: 'cardano'
            }));
          }
        }
      }
    } catch (error) {
      console.log("No existing Lace wallet connection");
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

  const connectWallet = useCallback(async () => {
    try {
      if (!window.cardano?.lace) {
        throw new Error("Lace wallet not installed. Please install Lace wallet extension for Cardano.");
      }

      const lace = window.cardano.lace;
      const isEnabled = await lace.isEnabled();
      
      if (!isEnabled) {
        const enabledLace = await lace.enable();
        if (!enabledLace) {
          throw new Error('Lace wallet access denied by user');
        }
      }
      
      const addresses = await lace.getUsedAddresses();
      if (!addresses || addresses.length === 0) {
        throw new Error('No addresses found in Lace wallet');
      }

      const address = addresses[0];
      
      setWalletState(prev => ({
        ...prev,
        walletAddress: address,
        isConnected: true,
        chain: 'cardano'
      }));

      // Create/update wallet in backend
      await walletMutation.mutateAsync({
        address,
        chain: 'cardano',
        hasGerbilNft: false,
        lemmiBalance: 0
      });

      toast({
        title: "Lace Connected",
        description: `Connected to Cardano: ${address.slice(0, 8)}...${address.slice(-6)}`,
      });

    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Lace wallet",
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
        hasGerbilNft: (nftData as any).hasGerbilNft || false
      }));
    }
  }, [nftData]);

  useEffect(() => {
    if (tokenData) {
      setWalletState(prev => ({
        ...prev,
        lemmiBalance: (tokenData as any).balance || 0
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
