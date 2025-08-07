import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SkipForward } from 'lucide-react';

// Import character icons
import deathIcon from '@assets/684454fcbe07a0afb75ea3d6_1754585543317.webp';
import cowboyIcon from '@assets/684c0005df53811557867294_1754585543349.webp';
import gentlemanIcon from '@assets/684eb083e4a202c865cdf17c_1754585543350.webp';
import vikingIcon from '@assets/68515ddf952acc6fb103bb7a_1754585543350.webp';
import hunterIcon from '@assets/685298e107b04350232f659a_1754585543350.webp';
import barbarianIcon from '@assets/68553e66ded7b33867483f05_1754585543351.webp';

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
    character: "The Grim Reaper",
    characterIcon: deathIcon,
    text: "In the year 2087, the realm between life and death has collapsed...",
    subtitle: "Ancient forces have awakened"
  },
  {
    id: 2,
    character: "The Gunslinger",
    characterIcon: cowboyIcon,
    text: "The last survivors must race through dimensional rifts to escape the chaos.",
    subtitle: "Time is running out"
  },
  {
    id: 3,
    character: "The Gentleman",
    characterIcon: gentlemanIcon,
    text: "Only the fastest and most skilled can navigate the Lemmi Run arena.",
    subtitle: "Where legends are born"
  },
  {
    id: 4,
    character: "The Viking Warrior",
    characterIcon: vikingIcon,
    text: "Ancient warriors from different eras have been summoned to compete.",
    subtitle: "Honor awaits the victor"
  },
  {
    id: 5,
    character: "The Forest Hunter",
    characterIcon: hunterIcon,
    text: "Each runner carries the power of their realm and the hope of their people.",
    subtitle: "Choose your destiny"
  },
  {
    id: 6,
    character: "The Wild Barbarian",
    characterIcon: barbarianIcon,
    text: "The ultimate test begins now. Are you ready to join the Lemmi Run?",
    subtitle: "Your legend starts here"
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
      }, 4000);
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
          className="fixed inset-0 z-50 bg-black"
        >
          {/* CRT Effect Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-purple-900/20" />
          
          {/* Scanlines */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)',
            }}
          />

          {/* Main Content */}
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            
            {/* Progress Bar */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-80 max-w-[80vw]">
              <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex space-x-1">
                  {storySlides.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded transition-colors duration-300 ${
                        index <= currentSlide 
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Skip Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleSkip}
              className="absolute top-8 right-8 flex items-center space-x-2 px-4 py-2 bg-gray-900/70 border border-cyan-500/30 rounded-lg text-cyan-400 hover:bg-gray-800/70 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm group"
            >
              <SkipForward className="w-4 h-4 group-hover:text-cyan-300" />
              <span className="text-sm font-mono group-hover:text-cyan-300">SKIP</span>
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
                {/* Character Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2
                  }}
                  className="mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                    <div className="relative w-32 h-32 bg-gray-900/80 border-4 border-cyan-500 rounded-full overflow-hidden backdrop-blur-sm">
                      <img
                        src={currentStory.characterIcon}
                        alt={currentStory.character}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Character Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4 font-mono tracking-wider"
                  style={{
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.8)',
                    filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'
                  }}
                >
                  {currentStory.character}
                </motion.h2>

                {/* Story Text */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg md:text-xl text-gray-100 mb-4 leading-relaxed font-mono max-w-3xl"
                  style={{
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {currentStory.text}
                </motion.p>

                {/* Subtitle */}
                {currentStory.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-purple-400 text-base md:text-lg font-mono italic mb-8"
                    style={{
                      textShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
                    }}
                  >
                    {currentStory.subtitle}
                  </motion.p>
                )}

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
                      className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-mono tracking-wider hover:from-cyan-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
                      style={{
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                      }}
                    >
                      <span className="text-lg font-bold">
                        {currentSlide === storySlides.length - 1 ? 'BEGIN JOURNEY' : 'CONTINUE'}
                      </span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Ambient Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom UI Elements */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="text-center text-cyan-400/60 font-mono text-sm">
              <p>Press SPACE or click to advance • ESC to skip</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}