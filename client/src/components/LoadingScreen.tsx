import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Gerbil characters
import gerbilK1 from '@assets/k1_1755244770033.png';
import gerbilK2 from '@assets/k2_1755244770066.png';
import gerbilK3 from '@assets/k3_1755244770066.png';
import gerbilK4 from '@assets/k4_1755244770066.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentGerbil, setCurrentGerbil] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const gerbilCharacters = [
    { image: gerbilK1, name: "Gentleman Gerbil", description: "Initializing blockchain protocols..." },
    { image: gerbilK2, name: "Happy Gerbil", description: "Loading Cardano network..." },
    { image: gerbilK3, name: "Wise Gerbil", description: "Synchronizing wallet connections..." },
    { image: gerbilK4, name: "Leader Gerbil", description: "Preparing neural interface..." }
  ];
  
  const loadingMessages = [
    ">> INITIALIZING GERBIL PROTOCOL",
    ">> CONNECTING TO CARDANO MAINNET",
    ">> LOADING NEURAL PATHWAYS",
    ">> SYNCING BLOCKCHAIN DATA",
    ">> PREPARING LEMMI INTERFACE",
    ">> FINALIZING SYSTEM BOOT"
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [onLoadingComplete]);
  
  // Rotate gerbils every 2 seconds
  useEffect(() => {
    const gerbilTimer = setInterval(() => {
      setCurrentGerbil(prev => (prev + 1) % gerbilCharacters.length);
    }, 2000);
    
    return () => clearInterval(gerbilTimer);
  }, []);
  
  // Update loading messages
  useEffect(() => {
    const messageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
    setLoadingMessage(loadingMessages[messageIndex]);
  }, [progress]);
  
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 font-mono overflow-hidden">
      {/* Immersive Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,255,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(168,85,247,0.1),transparent_70%)]" />
      </div>
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px),
            linear-gradient(rgba(0,255,255,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridMove 15s linear infinite'
        }} />
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="text-center w-full h-full flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo/Title */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="text-xs text-cyan-400/60 mb-2 font-mono">
            &gt; BOOTING_GERBIL_SYSTEM.EXE
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-2 tracking-wider text-white" style={{
            textShadow: '0 0 30px rgba(6, 182, 212, 0.8), 0 0 60px rgba(168, 85, 247, 0.6)',
            background: 'linear-gradient(45deg, #00ffff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            LEMMI.RUN
          </h1>
          <h2 className="text-lg font-bold text-green-400 mb-2 tracking-widest animate-pulse">
            GERBIL_EDITION_v2.1
          </h2>
          <div className="text-xs text-cyan-300/60 font-mono">
            CARDANO // NEURAL_INTERFACE // GERBIL_PROTOCOL
          </div>
        </motion.div>
        
        {/* Immersive Gerbil Character Display */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8 relative"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGerbil}
              initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-purple-500 to-cyan-400 blur-3xl opacity-30 animate-spin" style={{ animationDuration: '8s' }} />
              
              {/* Character Container */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/60 border-4 border-cyan-400/50 backdrop-blur-md overflow-hidden" style={{
                  clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)'
                }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                  
                  {/* Animated Gerbil */}
                  <motion.img
                    src={gerbilCharacters[currentGerbil].image}
                    alt={gerbilCharacters[currentGerbil].name}
                    className="w-full h-full object-contain p-4"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 2, 0, -2, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Scan lines */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0, 255, 255, 0.3) 4px, rgba(0, 255, 255, 0.3) 8px)'
                  }} />
                </div>
                
                {/* Corner Brackets */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-cyan-400" />
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-cyan-400" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-cyan-400" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-cyan-400" />
              </div>
              
              {/* Character Info */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                <div className="text-cyan-400 font-mono font-bold text-lg">
                  {gerbilCharacters[currentGerbil].name}
                </div>
                <div className="text-gray-400 font-mono text-sm">
                  {gerbilCharacters[currentGerbil].description}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Progress Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="w-full max-w-md"
        >
          {/* Loading Message */}
          <div className="mb-4 text-center">
            <div className="text-cyan-400 font-mono text-sm animate-pulse">
              {loadingMessage}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative bg-black border-2 border-cyan-400/50 backdrop-blur-md overflow-hidden" style={{
            clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)'
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
            
            <motion.div
              className="h-6 bg-gradient-to-r from-cyan-500 to-purple-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </motion.div>
            
            {/* Progress Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-cyan-300 font-mono font-bold text-sm">
                {Math.floor(progress)}%
              </span>
            </div>
          </div>
          
          {/* Loading Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
    </div>
  );
}