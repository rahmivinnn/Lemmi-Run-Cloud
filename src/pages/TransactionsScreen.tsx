import { Link } from 'wouter';
import { ArrowLeft } from 'lucide-react';
import CardanoTransactionTracker from '@/components/CardanoTransactionTracker';
import { useLaceWallet } from '@/hooks/useLaceWallet';

export default function TransactionsScreen() {
  const { address } = useLaceWallet();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="h-20 bg-gradient-to-r from-black via-gray-900 to-black border-b border-blue-800 relative">
        <div className="flex items-center justify-between h-full px-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-blue-800 hover:text-blue-700 font-mono">
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO HUB</span>
            </button>
          </Link>
          <h1 className="text-xl font-orbitron font-black text-blue-800 tracking-wider">
            TRANSACTIONS
          </h1>
          <div className="bg-black border border-blue-800 px-3 py-1 font-mono text-xs">
            CARDANO_SCAN.EXE
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Transaction Tracker */}
          <div className="bg-black border-2 border-blue-800 p-8 relative">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-800" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-800" />
            
            <CardanoTransactionTracker walletAddress={address} />
          </div>
        </div>
      </div>
    </div>
  );
}