import { FBXCharacterLoader } from './FBXCharacterLoader';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 font-mono">
      {/* CRT Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
      
      <div className="text-center w-full h-full flex flex-col items-center justify-center px-6">
        {/* Logo/Title */}
        <div className="mb-8">
          <div className="text-xs text-cyan-400/60 mb-2">
            &gt; BOOTING_SYSTEM.EXE
          </div>
          <h1 className="text-5xl font-orbitron font-black text-cyan-400 mb-2 animate-pulse tracking-wider">
            LEMMI.RUN
          </h1>
          <h2 className="text-lg font-orbitron font-bold text-green-400 mb-2 tracking-widest">
            GERBIL_EDITION_v2.1
          </h2>
          <div className="text-xs text-cyan-300/60">
            CARDANO // NEURAL_INTERFACE // GERBIL_PROTOCOL
          </div>
        </div>
        
        {/* FBX Character Animation - Full Screen */}
        <div className="flex-1 w-full max-w-2xl mx-auto">
          <FBXCharacterLoader 
            variant="loading" 
            onAnimationComplete={onLoadingComplete}
          />
        </div>
      </div>
      
      {/* Terminal Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none crt-screen">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}