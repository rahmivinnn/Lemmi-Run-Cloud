import { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING NEURAL INTERFACE...');

  const loadingSteps = [
    'INITIALIZING NEURAL INTERFACE...',
    'CONNECTING TO CARDANO NETWORK...',
    'LOADING GERBIL ASSETS...',
    'PREPARING GAME ENGINE...',
    'SYNCHRONIZING BLOCKCHAIN DATA...',
    'LEMMI RUN READY!'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 15;
        const stepIndex = Math.floor((next / 100) * loadingSteps.length);
        setLoadingText(loadingSteps[stepIndex] || loadingSteps[loadingSteps.length - 1]);
        
        if (next >= 100) {
          setTimeout(() => onLoadingComplete(), 1000);
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,165,0,0.3) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(255,165,0,0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 text-center">
        {/* Main Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-black border-2 border-orange-400 flex items-center justify-center relative mb-4">
            <img src="/attached_assets/ashina_1754580592322.webp" alt="Lemmi" className="w-28 h-28 object-contain" />
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-orange-400"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-orange-400"></div>
          </div>
          
          <h1 className="text-6xl font-orbitron font-black text-orange-400 tracking-widest mb-2">
            LEMMI RUN
          </h1>
          <p className="text-xl font-mono text-orange-300/80 tracking-wider">CARDANO GAMING SYSTEM</p>
        </div>

        {/* Progress Bar */}
        <div className="w-96 mx-auto mb-6">
          <div className="bg-black border border-orange-400 h-4 relative">
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-right">
            <span className="text-orange-400 font-mono text-sm">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="bg-black border border-orange-400 px-6 py-3 relative">
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-orange-400"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-400"></div>
          <p className="font-orbitron text-orange-400 font-bold tracking-widest animate-pulse">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
}