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

          {/* Main Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            
            {/* Unity-style HUD Progress */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-4 bg-black/60 border-2 border-cyan-400/50 rounded-none px-6 py-3 backdrop-blur-md" style={{
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)'
              }}>
                <div className="text-cyan-400 font-mono text-sm font-bold tracking-wider">
                  MISSION {currentSlide + 1} / {storySlides.length}
                </div>
                <div className="flex space-x-1">
                  {storySlides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 border transition-all duration-500 ${
                        index <= currentSlide 
                          ? 'bg-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/50' 
                          : 'border-gray-600 bg-transparent'
                      }`}
                      style={{ transform: 'rotate(45deg)' }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Unity-style Skip Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              onClick={handleSkip}
              className="absolute top-6 right-6 flex items-center space-x-3 px-5 py-3 bg-black/80 border-2 border-red-500/60 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-300 backdrop-blur-md group font-mono font-bold tracking-wider"
              style={{
                clipPath: 'polygon(0% 0%, calc(100% - 15px) 0%, 100% 50%, calc(100% - 15px) 100%, 0% 100%)'
              }}
            >
              <SkipForward className="w-5 h-5 group-hover:text-red-300" />
              <span className="text-sm group-hover:text-red-300">SKIP INTRO</span>
            </motion.button>

            {/* Story Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center max-w-4xl mx-auto text-center"
              >
                {/* Unity-style Character Portrait */}
                <motion.div
                  initial={{ scale: 0, rotateY: 90, z: -100 }}
                  animate={{ scale: 1, rotateY: 0, z: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                    delay: 0.3
                  }}
                  className="mb-10"
                >
                  <div className="relative">
                    {/* Holographic Effect */}
                    <div className="absolute inset-0 bg-gradient-conic from-cyan-400 via-purple-500 to-cyan-400 rounded-none blur-xl opacity-60 animate-spin" style={{ animationDuration: '10s' }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-purple-500/30 blur-lg animate-pulse" />
                    
                    {/* Character Frame */}
                    <div className="relative w-40 h-40 bg-black/90 border-4 border-cyan-400 overflow-hidden backdrop-blur-md" style={{
                      clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)'
                    }}>
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
                      <img
                        src={currentStory.characterIcon}
                        alt={currentStory.character}
                        className="w-full h-full object-cover"
                      />
                      {/* Scan lines */}
                      <div className="absolute inset-0 opacity-30" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0, 255, 255, 0.2) 3px, rgba(0, 255, 255, 0.2) 6px)'
                      }} />
                    </div>
                    
                    {/* Corner Brackets */}
                    <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-cyan-400" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-cyan-400" />
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-cyan-400" />
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-cyan-400" />
                  </div>
                </motion.div>

                {/* Unity-style Character Name */}
                <motion.div
                  initial={{ opacity: 0, y: 30, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 120 }}
                  className="mb-6"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 blur-md opacity-50" />
                    <h2 className="relative text-3xl md:text-4xl font-black text-white mb-2 font-mono tracking-[0.2em] uppercase" style={{
                      textShadow: '0 0 30px rgba(6, 182, 212, 1), 0 0 60px rgba(168, 85, 247, 0.8)',
                      background: 'linear-gradient(45deg, #00ffff, #8b5cf6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.8))'
                    }}>
                      {currentStory.character}
                    </h2>
                  </div>
                </motion.div>

                {/* Unity-style Story Text Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                  className="mb-8 max-w-4xl"
                >
                  {/* Text Panel */}
                  <div className="relative bg-black/70 border-2 border-cyan-400/50 backdrop-blur-md p-6" style={{
                    clipPath: 'polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%)'
                  }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5" />
                    
                    {/* Subtitle Badge */}
                    {currentStory.subtitle && (
                      <div className="absolute -top-4 left-6 bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-1 font-mono text-sm font-bold tracking-wider" style={{
                        clipPath: 'polygon(0% 0%, calc(100% - 10px) 0%, 100% 100%, 10px 100%)'
                      }}>
                        {currentStory.subtitle}
                      </div>
                    )}
                    
                    {/* Story Text */}
                    <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-mono text-center" style={{
                      textShadow: '0 0 15px rgba(255, 255, 255, 0.4)'
                    }}>
                      {currentStory.text}
                    </p>
                    
                    {/* Corner Details */}
                    <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
                  </div>
                </motion.div>

                {/* Auto-advance indicator or Next button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center"
                >
                  {autoAdvance && currentSlide < storySlides.length - 1 ? (
                    <div className="flex items-center space-x-3 text-cyan-400/70">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                      <span className="text-sm font-mono">Auto-advancing...</span>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-500" />
                    </div>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="group relative flex items-center space-x-4 px-8 py-4 bg-black/80 border-3 border-cyan-400 text-cyan-400 font-mono font-black tracking-[0.15em] hover:bg-cyan-400/10 hover:border-cyan-300 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110 uppercase text-lg"
                      style={{
                        clipPath: 'polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)',
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(6, 182, 212, 0.1)'
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <span className="relative z-10">
                        {currentSlide === storySlides.length - 1 ? '>>> START MISSION <<<' : '>> CONTINUE >>'}
                      </span>
                      <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      
                      {/* Corner Brackets */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300" />
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Unity-style Bottom HUD */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="bg-black/60 border-2 border-cyan-400/30 backdrop-blur-md px-6 py-2" style={{
              clipPath: 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)'
            }}>
              <div className="text-center text-cyan-400/80 font-mono text-xs font-bold tracking-widest uppercase">
                [SPACE] ADVANCE • [ESC] SKIP INTRO • [CLICK] MANUAL CONTROL
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}