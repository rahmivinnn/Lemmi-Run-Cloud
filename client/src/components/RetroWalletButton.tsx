import { useLaceWallet } from '../hooks/useLaceWallet';
import { Button } from './ui/button';

export function RetroWalletButton() {
  const { 
    isConnected, 
    isLoading, 
    address, 
    balance, 
    isLaceAvailable, 
    connectWallet, 
    disconnectWallet,
    error 
  } = useLaceWallet();

  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 8)}...${addr.slice(-8)}` : '';
  };

  const formatBalance = (bal: string) => {
    try {
      const lovelace = parseInt(bal);
      const ada = (lovelace / 1000000).toFixed(2);
      return `${ada} ADA`;
    } catch {
      return '0.00 ADA';
    }
  };

  if (!isLaceAvailable) {
    return (
      <div className="retro-panel p-4">
        <div className="text-red-400 text-sm font-mono mb-2">
          ⚠️ LACE WALLET NOT DETECTED
        </div>
        <Button 
          onClick={() => window.open('https://www.lace.io/', '_blank')}
          className="retro-button bg-red-600 hover:bg-red-700 text-white font-mono text-xs"
        >
          INSTALL LACE WALLET
        </Button>
      </div>
    );
  }

  if (isConnected && address) {
    return (
      <div className="retro-panel p-4">
        <div className="text-green-400 text-xs font-mono mb-1">
          🔗 WALLET CONNECTED
        </div>
        <div className="text-blue-700 text-xs font-mono mb-1">
          {formatAddress(address)}
        </div>
        <div className="text-yellow-400 text-xs font-mono mb-2">
          {balance ? formatBalance(balance) : 'Loading...'}
        </div>
        <Button 
          onClick={disconnectWallet}
          className="retro-button bg-gray-700 hover:bg-gray-600 text-white font-mono text-xs"
        >
          DISCONNECT
        </Button>
      </div>
    );
  }

  return (
    <div className="retro-panel p-4">
      <div className="text-orange-400 text-xs font-mono mb-2">
        🔌 WALLET DISCONNECTED
      </div>
      {error && (
        <div className="text-red-400 text-xs font-mono mb-2">
          {error}
        </div>
      )}
      <Button 
        onClick={connectWallet}
        disabled={isLoading}
        className="retro-button bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs disabled:opacity-50"
      >
        {isLoading ? 'CONNECTING...' : 'CONNECT LACE'}
      </Button>
    </div>
  );
}