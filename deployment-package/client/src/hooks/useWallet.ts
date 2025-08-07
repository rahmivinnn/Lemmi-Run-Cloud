import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface WalletState {
  walletAddress: string | null;
  isConnected: boolean;
  hasGerbilNft: boolean;
  lemmiBalance: number;
  chain: 'ethereum' | 'solana' | 'cardano' | null;
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
      // Wait for page to load completely
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check Lace wallet for Cardano
      if (typeof window !== 'undefined' && window.cardano?.lace) {
        const lace = window.cardano.lace;
        console.log("Lace wallet detected, checking connection...");
        
        const isEnabled = await lace.isEnabled();
        console.log("Lace enabled:", isEnabled);
        
        if (isEnabled) {
          const addresses = await lace.getUsedAddresses();
          console.log("Lace addresses:", addresses);
          
          if (addresses && addresses.length > 0) {
            const address = addresses[0];
            setWalletState(prev => ({
              ...prev,
              walletAddress: address,
              isConnected: true,
              chain: 'cardano'
            }));
            console.log("Lace wallet reconnected:", address);
          }
        }
      } else {
        console.log("Lace wallet not found or not available yet");
      }
    } catch (error) {
      console.log("Error checking Lace connection:", error);
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
      console.log("Attempting to connect to Lace wallet...");
      
      // Check if window and cardano are available
      if (typeof window === 'undefined') {
        throw new Error("Window object not available");
      }
      
      // Wait for Lace to be fully loaded
      let attempts = 0;
      while (!window.cardano?.lace && attempts < 10) {
        console.log(`Waiting for Lace... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
      
      if (!window.cardano?.lace) {
        throw new Error("Lace wallet tidak terinstall! Silakan install Lace wallet extension untuk Cardano di browser Anda.");
      }

      const lace = window.cardano.lace;
      console.log("Lace wallet found, requesting access...");
      
      // Request access to wallet
      const api = await lace.enable();
      console.log("Lace API enabled:", api);
      
      if (!api) {
        throw new Error('Akses ke Lace wallet ditolak. Silakan coba lagi dan izinkan akses.');
      }
      
      // Get addresses
      const addresses = await api.getUsedAddresses();
      console.log("Got addresses:", addresses);
      
      let finalAddresses = addresses;
      if (!finalAddresses || finalAddresses.length === 0) {
        // Try to get unused addresses if no used addresses
        const unusedAddresses = await api.getUnusedAddresses();
        if (!unusedAddresses || unusedAddresses.length === 0) {
          throw new Error('Tidak ditemukan address di wallet Lace. Pastikan wallet Anda sudah memiliki address Cardano.');
        }
        finalAddresses = unusedAddresses;
      }

      const address = finalAddresses[0];
      console.log("Using address:", address);
      
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
        hasGerbilNft: true, // Set to true for demo
        lemmiBalance: 1000 // Demo balance
      });

      toast({
        title: "🎮 Lace Wallet Terhubung!",
        description: `Berhasil terhubung ke Cardano: ${address.slice(0, 12)}...${address.slice(-8)}`,
      });

    } catch (error: any) {
      console.error("Lace connection error:", error);
      toast({
        title: "❌ Koneksi Gagal",
        description: error.message || "Gagal terhubung ke Lace wallet. Pastikan extension sudah terinstall dan aktif.",
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
    cardano?: {
      lace?: {
        enable(): Promise<any>;
        isEnabled(): Promise<boolean>;
        getUsedAddresses(): Promise<string[]>;
        getUnusedAddresses(): Promise<string[]>;
        getBalance(): Promise<string>;
        getNetworkId(): Promise<number>;
      };
    };
  }
}
