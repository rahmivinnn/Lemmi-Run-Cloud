import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, SkipForward } from 'lucide-react';

// Import character icons - All Gerbil Army Characters
import deathIcon from '@assets/684454fcbe07a0afb75ea3d6_1754585543317.webp';
import cowboyIcon from '@assets/684c0005df53811557867294_1754585543349.webp';
import gentlemanIcon from '@assets/684eb083e4a202c865cdf17c_1754585543350.webp';
import vikingIcon from '@assets/68515ddf952acc6fb103bb7a_1754585543350.webp';
import hunterIcon from '@assets/685298e107b04350232f659a_1754585543350.webp';
import barbarianIcon from '@assets/68553e66ded7b33867483f05_1754585543351.webp';
import ashinaIcon from '@assets/ashina_1754579357036.webp';
import bomoIcon from '@assets/bomo_1754579357038.webp';
import cowboyClassicIcon from '@assets/cowboy_1754579357037.webp';
import grimReaperIcon from '@assets/grim reaper_1754579357037.webp';
import icoIcon from '@assets/ico_1754579357038.webp';
import jeffIcon from '@assets/jeff_1754579357023.webp';
import mumrikIcon from '@assets/mumrik_1754579357038.webp';
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
    character: "King Lemmi",
    characterIcon: jeffIcon,
    text: "In the mystical realm of Cardano, King Lemmi ruled over a legendary army of brave gerbil warriors...",
    subtitle: "The golden age begins"
  },
  {
    id: 2,
    character: "The Grim Reaper",
    characterIcon: deathIcon,
    text: "When darkness threatened the kingdom, the Death Walker emerged from the shadows.",
    subtitle: "Guardian of the underworld"
  },
  {
    id: 3,
    character: "Ashina the Ninja",
    characterIcon: ashinaIcon,
    text: "Swift as lightning, Ashina mastered the ancient arts of stealth and precision.",
    subtitle: "Master of shadows"
  },
  {
    id: 4,
    character: "Bomo the Berserker",
    characterIcon: bomoIcon,
    text: "With unstoppable fury, Bomo charged through every battlefield with wild courage.",
    subtitle: "Unstoppable force"
  },
  {
    id: 5,
    character: "The Cowboy",
    characterIcon: cowboyIcon,
    text: "From the western badlands, the lone gunslinger brought justice to lawless lands.",
    subtitle: "Quick draw champion"
  },
  {
    id: 6,
    character: "The Gentleman",
    characterIcon: gentlemanIcon,
    text: "With refined manners and deadly precision, the Gentleman was both scholar and warrior.",
    subtitle: "Elegance in battle"
  },
  {
    id: 7,
    character: "The Viking",
    characterIcon: vikingIcon,
    text: "From the frozen northlands, the Viking warrior brought ancient strength and honor.",
    subtitle: "Valhalla awaits"
  },
  {
    id: 8,
    character: "Ico the Mystic",
    characterIcon: icoIcon,
    text: "Master of arcane arts, Ico wielded magical powers beyond mortal comprehension.",
    subtitle: "Keeper of ancient secrets"
  },
  {
    id: 9,
    character: "Mumrik the Wild",
    characterIcon: mumrikIcon,
    text: "Living in harmony with nature, Mumrik commanded the powers of earth and forest.",
    subtitle: "Child of the wilderness"
  },
  {
    id: 10,
    character: "Snow the Arctic Warrior",
    characterIcon: snowIcon,
    text: "From the eternal winter lands, Snow brought the chill of absolute determination.",
    subtitle: "Heart of ice, soul of fire"
  },
  {
    id: 11,
    character: "The Undead Champion",
    characterIcon: undeadIcon,
    text: "Rising from ancient battlefields, the Undead Champion fights with immortal fury.",
    subtitle: "Death is not the end"
  },
  {
    id: 12,
    character: "The Forest Hunter",
    characterIcon: hunterIcon,
    text: "Now these legendary warriors must unite for the ultimate challenge - the Lemmi Run!",
    subtitle: "Choose your champion"
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
      }, 2500); // Faster auto-advance since there are 12 slides
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
              <p>SPACE/ENTER to advance • ESC to skip • Click to disable auto-advance</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}