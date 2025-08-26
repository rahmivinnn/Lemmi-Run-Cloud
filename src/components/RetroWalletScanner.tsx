import { useState, useEffect } from 'react';

interface RetroWalletScannerProps {
  onConnect: () => void;
  isConnected: boolean;
  address?: string;
  hasNft?: boolean;
}

export function RetroWalletScanner({ onConnect, isConnected, address, hasNft }: RetroWalletScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState('');

  const scanSequence = [
    '> INITIALIZING NEURAL SCAN...',
    '> DETECTING CARDANO NODES...',
    '> SCANNING FOR LACE WALLET...',
    '> ANALYZING BLOCKCHAIN DATA...',
    '> VERIFYING NFT COLLECTION...',
    '> ESTABLISHING SECURE LINK...',
    '> CONNECTION ESTABLISHED!'
  ];

  useEffect(() => {
    if (scanning) {
      let lineIndex = 0;
      let progress = 0;
      setTerminalLines([]);
      
      const interval = setInterval(() => {
        if (lineIndex < scanSequence.length) {
          setTerminalLines(prev => [...prev, scanSequence[lineIndex]]);
          lineIndex++;
          progress += 14.3;
          setScanProgress(Math.min(progress, 100));
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setScanning(false);
            onConnect();
          }, 500);
        }
      }, 400);

      return () => clearInterval(interval);
    }
  }, [scanning, onConnect]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCurrentLine(prev => prev === '_' ? ' ' : '_');
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const startScan = () => {
    if (!isConnected && !scanning) {
      setScanning(true);
      setScanProgress(0);
    }
  };

  if (isConnected) {
    return (
      <div className="bg-black border border-green-400 px-4 py-3 relative font-mono">
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400"></div>
        
        <div className="text-xs text-green-400/60 mb-1">WALLET_STATUS:</div>
        <div className="text-sm text-green-300 font-bold mb-2">CONNECTED</div>
        
        <div className="text-xs text-green-400/60 mb-1">ADDRESS:</div>
        <div className="text-xs text-green-300 font-bold mb-2 break-all">
          {address ? `${address.slice(0, 8)}...${address.slice(-6)}` : 'N/A'}
        </div>
        
        <div className="text-xs text-green-400/60 mb-1">NFT_SCAN:</div>
        <div className={`text-xs font-bold ${hasNft ? 'text-cyan-300' : 'text-yellow-300'}`}>
          {hasNft ? 'GERBIL_DETECTED ✓' : 'NO_GERBIL_FOUND'}
        </div>
        
        <div className="mt-2 w-full h-1 bg-gray-800 relative">
          <div className="h-full w-full bg-green-400 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-cyan-400 relative font-mono">
      <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400"></div>
      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400"></div>
      
      {scanning ? (
        <div className="px-4 py-3">
          <div className="text-xs text-cyan-400/60 mb-2">NEURAL_SCANNER_v2.1:</div>
          
          {/* Terminal Output */}
          <div className="h-32 mb-3 overflow-hidden">
            {terminalLines.map((line, i) => (
              <div key={i} className="text-xs text-cyan-300 mb-1 animate-pulse">
                {line}
              </div>
            ))}
            <div className="text-xs text-cyan-300">
              {scanning && scanProgress < 100 && (
                <span className="animate-pulse">SCANNING{currentLine}</span>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="text-xs text-cyan-400/60 mb-1">
              PROGRESS: {scanProgress.toFixed(0)}%
            </div>
            <div className="w-full h-2 bg-gray-800 border border-cyan-400/30 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              ></div>
              <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>
            </div>
          </div>
          
          <div className="text-xs text-yellow-300 animate-pulse">
            PLEASE WAIT... DO NOT DISCONNECT
          </div>
        </div>
      ) : (
        <button
          onClick={startScan}
          className="w-full px-4 py-3 text-left hover:bg-cyan-900/20 transition-all duration-200 group"
        >
          <div className="text-xs text-cyan-400/60 mb-1">WALLET_SCANNER:</div>
          <div className="text-sm text-cyan-300 font-bold mb-2 group-hover:animate-pulse">
            CLICK TO SCAN
          </div>
          <div className="text-xs text-cyan-400/60 mb-2">
            &gt; NEURAL_LINK.EXE
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cyan-400 animate-pulse"></div>
            <div className="text-xs text-cyan-400">READY_TO_SCAN</div>
            <div className="text-cyan-400 group-hover:animate-bounce ml-auto">&gt;&gt;</div>
          </div>
        </button>
      )}
    </div>
  );
}