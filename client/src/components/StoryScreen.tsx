import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SkipForward } from 'lucide-react';

// Import character icons - Top 10 Gerbil Army Champions
import deathIcon from '@assets/684454fcbe07a0afb75ea3d6_1754585543317.webp';
import cowboyIcon from '@assets/684c0005df53811557867294_1754585543349.webp';
import gentlemanIcon from '@assets/684eb083e4a202c865cdf17c_1754585543350.webp';
import vikingIcon from '@assets/68515ddf952acc6fb103bb7a_1754585543350.webp';
import hunterIcon from '@assets/685298e107b04350232f659a_1754585543350.webp';
import ashinaIcon from '@assets/ashina_1754579357036.webp';
import cowboyClassicIcon from '@assets/cowboy_1754579357037.webp';
import grimReaperIcon from '@assets/grim reaper_1754579357037.webp';
import icoIcon from '@assets/ico_1754579357038.webp';
import jeffIcon from '@assets/jeff_1754579357023.webp';
import snowIcon from '@assets/snow_1754579357039.webp';
import undeadIcon from '@assets/undead_1754579357037.webp';

// Import Gerbil claim characters
import gerbilK1 from '@assets/k1_1755244404882.png';
import gerbilK2 from '@assets/k2_1755244404884.png';
import gerbilK3 from '@assets/k3_1755244404885.png';
import gerbilK4 from '@assets/k4_1755244404886.png';

interface StoryScreenProps {
  onComplete: () => void;
}

interface StorySlide {
  id: number;
  character: string;
  characterIcon: string;
  text: string;
  subtitle?: string;
}

const storySlides: StorySlide[] = [
  {
    id: 1,
    character: "KING LEMMI",
    characterIcon: jeffIcon,
    text: "In the mystical realm of Cardano, King Lemmi rules over a legendary army of brave gerbil warriors. The blockchain kingdom awaits its greatest challenge...",
    subtitle: "THE LEGEND BEGINS"
  },
  {
    id: 2,
    character: "GRIM REAPER",
    characterIcon: grimReaperIcon,
    text: "From the depths of the shadow realm, the Grim Reaper emerges. Death itself cannot stop this immortal champion of darkness.",
    subtitle: "GUARDIAN OF SOULS"
  },
  {
    id: 3,
    character: "ASHINA",
    characterIcon: ashinaIcon,
    text: "Swift as lightning, deadly as shadow. Ashina strikes from the darkness with precision that legends are made of.",
    subtitle: "MASTER ASSASSIN"
  },
  {
    id: 4,
    character: "THE COWBOY",
    characterIcon: cowboyIcon,
    text: "From the lawless badlands comes the lone gunslinger. His quick draw has never been matched in the western frontier.",
    subtitle: "FASTEST GUN ALIVE"
  },
  {
    id: 5,
    character: "THE GENTLEMAN",
    characterIcon: gentlemanIcon,
    text: "Refined in manner, lethal in combat. The Gentleman brings Victorian elegance to the art of warfare.",
    subtitle: "DEADLY SOPHISTICATION"
  },
  {
    id: 6,
    character: "VIKING WARRIOR",
    characterIcon: vikingIcon,
    text: "From the frozen northlands comes ancient fury. This Norse warrior brings the rage of Valhalla to battle.",
    subtitle: "HONOR AND STEEL"
  },
  {
    id: 7,
    character: "ICO THE MYSTIC",
    characterIcon: icoIcon,
    text: "Master of arcane mysteries and keeper of ancient secrets. Ico's magical powers transcend mortal understanding.",
    subtitle: "ARCANE CHAMPION"
  },
  {
    id: 8,
    character: "SNOW WARRIOR",
    characterIcon: snowIcon,
    text: "From eternal winter lands comes the ice champion. Cold as winter, fierce as blizzard, unstoppable as avalanche.",
    subtitle: "FROZEN FURY"
  },
  {
    id: 9,
    character: "UNDEAD CHAMPION",
    characterIcon: undeadIcon,
    text: "Death could not claim this warrior. Rising from ancient battlefields, the Undead Champion fights with immortal determination.",
    subtitle: "BEYOND DEATH"
  },
  {
    id: 10,
    character: "FOREST HUNTER",
    characterIcon: hunterIcon,
    text: "Now these legendary champions must unite for the ultimate challenge. Choose your warrior and begin the LEMMI RUN!",
    subtitle: "THE BATTLE BEGINS"
  }
];

export function StoryScreen({ onComplete }: StoryScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [showGerbilClaim, setShowGerbilClaim] = useState(false);
  const [claimedGerbils, setClaimedGerbils] = useState<number[]>([]);
  
  const gerbilClaimOptions = [
    { id: 1, name: 'Gentleman Gerbil', image: gerbilK1, rarity: 'RARE' },
    { id: 2, name: 'Happy Gerbil', image: gerbilK2, rarity: 'COMMON' },
    { id: 3, name: 'Wise Gerbil', image: gerbilK3, rarity: 'EPIC' },
    { id: 4, name: 'Leader Gerbil', image: gerbilK4, rarity: 'LEGENDARY' }
  ];

  useEffect(() => {
    if (autoAdvance && currentSlide < storySlides.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSlide(prev => prev + 1);
      }, 3000); // Unity-style pacing for 10 slides
      return () => clearTimeout(timer);
    }
  }, [currentSlide, autoAdvance]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Escape':
          event.preventDefault();
          handleSkip();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  const handleNext = () => {
    setAutoAdvance(false);
    if (currentSlide < storySlides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    setAutoAdvance(false);
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => {
      onComplete();
    }, 500);
  };
  
  const handleGerbilClaim = (gerbilId: number) => {
    if (!claimedGerbils.includes(gerbilId)) {
      setClaimedGerbils([...claimedGerbils, gerbilId]);
    }
  };

  const currentStory = storySlides[currentSlide];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-black overflow-hidden"
        >
          {/* Unity-style Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-radial from-purple-900/30 via-cyan-900/20 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          </div>
          
          {/* Animated Grid Lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
              animation: 'gridMove 20s linear infinite'
            }} />
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Main Content - Immersive Layout */}
          <div className="relative h-full w-full p-4">
            
            {/* Top Left - Mission Progress */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-6 left-6"
            >
              <div className="bg-black/70 border-2 border-cyan-400/50 px-4 py-2 backdrop-blur-md" style={{
                clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 100%, 15px 100%)'
              }}>
                <div className="text-cyan-400 font-mono text-sm font-bold tracking-wider">
                  MISSION {currentSlide + 1}/{storySlides.length}
                </div>
                <div className="flex space-x-1 mt-1">
                  {storySlides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 transition-all duration-500 ${
                        index <= currentSlide 
                          ? 'bg-cyan-400 shadow-lg shadow-cyan-400/50' 
                          : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Top Right - Skip & Gerbil Claim */}
            <div className="absolute top-6 right-6 flex flex-col space-y-3">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                onClick={handleSkip}
                className="flex items-center space-x-2 px-4 py-2 bg-black/80 border border-red-500/60 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-300 backdrop-blur-md group font-mono text-sm"
              >
                <SkipForward className="w-4 h-4" />
                <span>SKIP</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                onClick={() => setShowGerbilClaim(!showGerbilClaim)}
                className="flex items-center space-x-2 px-4 py-2 bg-black/80 border border-purple-500/60 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-md group font-mono text-sm"
              >
                <span>🎁</span>
                <span>CLAIM</span>
              </motion.button>
            </div>

            {/* Central Story Content */}
            <div className="flex items-center justify-center h-full">
              <div className="grid grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-center">
                
                {/* Left Side - Character Portrait */}
                <div className="col-span-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: -100, rotateY: 90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      exit={{ opacity: 0, x: -100, rotateY: -90 }}
                      transition={{ duration: 0.8 }}
                    >
                      <div className="relative">
                        {/* Holographic Effect */}
                        <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-purple-500 to-cyan-400 rounded-none blur-2xl opacity-40 animate-spin" style={{ animationDuration: '12s' }} />
                        
                        {/* Character Frame */}
                        <div className="relative w-80 h-80 bg-black/90 border-4 border-cyan-400 overflow-hidden backdrop-blur-md" style={{
                          clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)'
                        }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                          <img
                            src={storySlides[currentSlide].characterIcon}
                            alt={storySlides[currentSlide].character}
                            className="w-full h-full object-cover"
                          />
                          {/* Scan lines */}
                          <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0, 255, 255, 0.2) 4px, rgba(0, 255, 255, 0.2) 8px)'
                          }} />
                        </div>
                        
                        {/* Corner Brackets */}
                        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-cyan-400" />
                        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-cyan-400" />
                        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-cyan-400" />
                        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-cyan-400" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Side - Story Content */}
                <div className="col-span-7 space-y-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Character Name */}
                      <div className="relative">
                        <h2 className="text-4xl md:text-5xl font-black text-white font-mono tracking-[0.15em] uppercase" style={{
                          textShadow: '0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(168, 85, 247, 0.8)',
                          background: 'linear-gradient(45deg, #00ffff, #8b5cf6)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))'
                        }}>
                          {storySlides[currentSlide].character}
                        </h2>
                        
                        {/* Subtitle Badge */}
                        {storySlides[currentSlide].subtitle && (
                          <div className="mt-2 inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 font-mono text-sm font-bold tracking-wider" style={{
                            clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 100%, 10px 100%)'
                          }}>
                            {storySlides[currentSlide].subtitle}
                          </div>
                        )}
                      </div>

                      {/* Story Text Panel */}
                      <div className="relative bg-black/60 border-2 border-cyan-400/40 backdrop-blur-md p-6" style={{
                        clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)'
                      }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                        
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-mono" style={{
                          textShadow: '0 0 15px rgba(255, 255, 255, 0.4)'
                        }}>
                          {storySlides[currentSlide].text}
                        </p>
                        
                        {/* Corner Details */}
                        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
                        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex items-center justify-center"
              >
                {autoAdvance && currentSlide < storySlides.length - 1 ? (
                  <div className="flex items-center space-x-3 text-cyan-400/70 bg-black/50 px-4 py-2 backdrop-blur-md border border-cyan-400/30">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    <span className="text-sm font-mono">Auto-advancing...</span>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-500" />
                  </div>
                ) : (
                  <button
                    onClick={handleNext}
                    className="group relative flex items-center space-x-4 px-8 py-4 bg-black/80 border-2 border-cyan-400 text-cyan-400 font-mono font-black tracking-[0.1em] hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-300 transition-all duration-300 transform hover:scale-105 uppercase"
                    style={{
                      clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                      boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    <span className="relative z-10">
                      {currentSlide === storySlides.length - 1 ? 'START MISSION' : 'CONTINUE'}
                    </span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                )}
              </motion.div>
            </div>
          </div>

          {/* Gerbil Claim Panel */}
          <AnimatePresence>
            {showGerbilClaim && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute top-20 right-6 w-80"
              >
                <div className="bg-black/90 border-2 border-purple-400/60 backdrop-blur-md p-4" style={{
                  clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)'
                }}>
                  <h3 className="text-purple-400 font-mono font-bold text-lg mb-4 text-center tracking-wider">
                    🎁 DAILY GERBIL CLAIM
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {gerbilClaimOptions.map((gerbil) => (
                      <button
                        key={gerbil.id}
                        onClick={() => handleGerbilClaim(gerbil.id)}
                        className={`group relative p-3 border-2 transition-all duration-300 ${
                          claimedGerbils.includes(gerbil.id)
                            ? 'border-green-400 bg-green-400/20'
                            : 'border-purple-400/50 hover:border-purple-400 hover:bg-purple-400/10'
                        }`}
                        disabled={claimedGerbils.includes(gerbil.id)}
                      >
                        <div className="relative">
                          <img
                            src={gerbil.image}
                            alt={gerbil.name}
                            className="w-full h-16 object-contain"
                          />
                          {claimedGerbils.includes(gerbil.id) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-green-400/20">
                              <span className="text-green-400 font-bold">✓</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs font-mono text-gray-300 truncate">{gerbil.name}</div>
                          <div className={`text-xs font-bold ${
                            gerbil.rarity === 'LEGENDARY' ? 'text-yellow-400' :
                            gerbil.rarity === 'EPIC' ? 'text-purple-400' :
                            gerbil.rarity === 'RARE' ? 'text-blue-400' : 'text-gray-400'
                          }`}>
                            {gerbil.rarity}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-center text-xs font-mono text-gray-400">
                    Claimed: {claimedGerbils.length}/{gerbilClaimOptions.length}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Bottom Controls Info */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="text-center text-cyan-400/60 font-mono text-xs tracking-widest">
              [SPACE] ADVANCE • [ESC] SKIP
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}