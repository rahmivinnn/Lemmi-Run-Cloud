import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface Transaction {
  id: string;
  hash: string;
  type: 'sent' | 'received' | 'nft_transfer' | 'smart_contract';
  amount: string;
  token: 'ADA' | 'LEMMI';
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  cardanoScanUrl: string;
  fromAddress?: string;
  toAddress?: string;
  nftData?: {
    name: string;
    image: string;
  };
}

// Mock transaction data - In real implementation, this would come from Cardano API
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    hash: "4a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    type: "received",
    amount: "150.75",
    token: "ADA",
    timestamp: "2024-01-07 14:23:15",
    status: "confirmed",
    cardanoScanUrl: "https://cardanoscan.io/transaction/4a2b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
    fromAddress: "addr1q9x2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c",
    toAddress: "Your Wallet"
  },
  {
    id: "tx2",
    hash: "1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a",
    type: "nft_transfer",
    amount: "1",
    token: "LEMMI",
    timestamp: "2024-01-07 13:15:42",
    status: "confirmed",
    cardanoScanUrl: "https://cardanoscan.io/transaction/1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a",
    fromAddress: "addr1q8x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0",
    toAddress: "Your Wallet",
    nftData: {
      name: "Jeff - Laser Eyes Gerbil",
      image: "/gerbil-jeff.png"
    }
  },
  {
    id: "tx3",
    hash: "2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b",
    type: "sent",
    amount: "50.25",
    token: "ADA",
    timestamp: "2024-01-07 12:08:30",
    status: "confirmed",
    cardanoScanUrl: "https://cardanoscan.io/transaction/2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b",
    fromAddress: "Your Wallet",
    toAddress: "addr1q7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8t"
  },
  {
    id: "tx4",
    hash: "3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c",
    type: "smart_contract",
    amount: "2500",
    token: "LEMMI",
    timestamp: "2024-01-07 11:42:18",
    status: "confirmed",
    cardanoScanUrl: "https://cardanoscan.io/transaction/3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c",
    fromAddress: "Lemmi Protocol",
    toAddress: "Your Wallet"
  },
  {
    id: "tx5",
    hash: "4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d",
    type: "received",
    amount: "75.00",
    token: "ADA",
    timestamp: "2024-01-06 18:30:45",
    status: "pending",
    cardanoScanUrl: "https://cardanoscan.io/transaction/4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d",
    fromAddress: "addr1q6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4z3y2x1w0v9u8t7s",
    toAddress: "Your Wallet"
  }
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'sent': return '📤';
    case 'received': return '📥';
    case 'nft_transfer': return '🖼️';
    case 'smart_contract': return '📄';
    default: return '💼';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return 'text-green-400 bg-green-400/10';
    case 'pending': return 'text-yellow-400 bg-yellow-400/10';
    case 'failed': return 'text-red-400 bg-red-400/10';
    default: return 'text-gray-400 bg-gray-400/10';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'sent': return 'text-red-400';
    case 'received': return 'text-green-400';
    case 'nft_transfer': return 'text-purple-400';
    case 'smart_contract': return 'text-blue-400';
    default: return 'text-gray-400';
  }
};

interface CardanoTransactionTrackerProps {
  walletAddress: string | null;
}

export default function CardanoTransactionTracker({ walletAddress }: CardanoTransactionTrackerProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'nft_transfer' | 'smart_contract'>('all');

  // Simulate real-time transaction fetching
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/cardano/transactions', walletAddress],
    enabled: !!walletAddress,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => 
    filter === 'all' || tx.type === filter
  );

  const openCardanoScan = (url: string) => {
    window.open(url, '_blank');
  };

  if (!walletAddress) {
    return (
      <div className="text-center p-8">
        <div className="text-6xl mb-4">🔗</div>
        <p className="text-gray-400 font-mono">Connect Lace Wallet to track Cardano transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-orbitron font-bold text-orange-400 mb-2">
          🔗 CARDANO TRANSACTION TRACKER
        </h2>
        <p className="text-sm text-gray-400 font-mono">
          Real-time blockchain transaction monitoring
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(['all', 'sent', 'received', 'nft_transfer', 'smart_contract'] as const).map((filterType) => (
          <Button
            key={filterType}
            size="sm"
            variant={filter === filterType ? 'default' : 'outline'}
            className={`${
              filter === filterType 
                ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                : 'border-gray-600 text-gray-400 hover:border-orange-500/50'
            }`}
            onClick={() => setFilter(filterType)}
          >
            {getTransactionIcon(filterType)} {filterType.replace('_', ' ').toUpperCase()}
          </Button>
        ))}
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <p className="text-gray-400 font-mono">Loading transactions...</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div 
              key={tx.id}
              className={`bg-black/60 rounded-lg border-2 p-4 cursor-pointer transition-all duration-300 hover:border-orange-400/50 ${
                selectedTx?.id === tx.id ? 'border-orange-500' : 'border-gray-600'
              }`}
              onClick={() => setSelectedTx(selectedTx?.id === tx.id ? null : tx)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getTransactionIcon(tx.type)}</span>
                  <div>
                    <p className={`font-mono text-sm font-bold ${getTypeColor(tx.type)}`}>
                      {tx.type.replace('_', ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {tx.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-mono font-bold ${tx.type === 'sent' ? 'text-red-400' : 'text-green-400'}`}>
                    {tx.type === 'sent' ? '-' : '+'}{tx.amount} {tx.token}
                  </p>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${getStatusColor(tx.status)}`}>
                    {tx.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 font-mono truncate max-w-xs">
                  Hash: {tx.hash}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCardanoScan(tx.cardanoScanUrl);
                  }}
                >
                  📊 CARDANOSCAN
                </Button>
              </div>

              {/* Expanded Details */}
              {selectedTx?.id === tx.id && (
                <div className="mt-4 pt-4 border-t border-gray-600 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 font-mono">From:</span>
                      <p className="text-white font-mono break-all">{tx.fromAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 font-mono">To:</span>
                      <p className="text-white font-mono break-all">{tx.toAddress}</p>
                    </div>
                  </div>

                  {tx.nftData && (
                    <div className="bg-gray-800/50 rounded p-3">
                      <span className="text-gray-400 font-mono text-sm">NFT Data:</span>
                      <p className="text-purple-400 font-mono">{tx.nftData.name}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-orange-500/20 border border-orange-500 text-orange-400 hover:bg-orange-500/30"
                      onClick={() => openCardanoScan(tx.cardanoScanUrl)}
                    >
                      🔍 VIEW FULL DETAILS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-gray-600 text-gray-400"
                      onClick={() => navigator.clipboard.writeText(tx.hash)}
                    >
                      📋 COPY HASH
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-black/80 rounded-lg border border-gray-600 p-4">
        <h3 className="font-orbitron font-bold text-orange-400 mb-3">Transaction Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-400">{filteredTransactions.filter(tx => tx.type === 'received').length}</p>
            <p className="text-xs text-gray-400 font-mono">Received</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-400">{filteredTransactions.filter(tx => tx.type === 'sent').length}</p>
            <p className="text-xs text-gray-400 font-mono">Sent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">{filteredTransactions.filter(tx => tx.type === 'nft_transfer').length}</p>
            <p className="text-xs text-gray-400 font-mono">NFTs</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">{filteredTransactions.filter(tx => tx.type === 'smart_contract').length}</p>
            <p className="text-xs text-gray-400 font-mono">Contracts</p>
          </div>
        </div>
      </div>
    </div>
  );
}