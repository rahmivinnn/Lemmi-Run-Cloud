import { useState } from 'react';

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  stats: {
    speed: number;
    jump: number;
    special: number;
  };
}

interface CharacterSelectionProps {
  onCharacterSelect: (character: Character) => void;
  onBack: () => void;
}

export function CharacterSelection({ onCharacterSelect, onBack }: CharacterSelectionProps) {
  const characters: Character[] = [
    {
      id: 'ashina',
      name: 'KING LEMMI',
      image: '/king-lemmi.png',
      description: 'Royal warrior with balanced abilities',
      stats: { speed: 8, jump: 7, special: 9 }
    },
    {
      id: 'cowboy',
      name: 'COWBOY GERBIL',
      image: '/cowboy-gerbil.png',
      description: 'Quick draw specialist',
      stats: { speed: 9, jump: 6, special: 7 }
    },
    {
      id: 'snow',
      name: 'SNOW GERBIL',
      image: '/snow-gerbil.png',
      description: 'Ice powers and agility',
      stats: { speed: 7, jump: 9, special: 8 }
    },
    {
      id: 'grim',
      name: 'GRIM REAPER',
      image: '/grim-reaper.png',
      description: 'Dark magic wielder',
      stats: { speed: 6, jump: 8, special: 10 }
    }
  ];

  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex flex-col relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full animate-ping opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`glow-${i}`}
            className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="h-20 bg-black border-b-2 border-orange-400 relative flex items-center justify-between px-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>
        
        <button
          onClick={onBack}
          className="bg-black border border-red-400 px-6 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-400/50 group overflow-hidden"
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400 animate-pulse"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <span className="relative z-10 transition-all duration-300 group-hover:text-yellow-100">BACK</span>
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <h1 className="text-3xl font-orbitron font-black text-orange-400 tracking-widest animate-pulse hover:animate-none transition-all duration-500 hover:text-yellow-300 hover:scale-105 hover:drop-shadow-lg cursor-default">
          CHARACTER SELECTION
        </h1>

        <div className="w-24"></div>
      </div>

      {/* Character Grid */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {characters.map((character, index) => (
            <div
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              className={`bg-black border-2 cursor-pointer transition-all duration-500 relative transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-400/50 group animate-fade-in ${
                selectedCharacter?.id === character.id
                  ? 'border-orange-400 bg-orange-900/20 scale-105 shadow-xl shadow-orange-400/30'
                  : 'border-gray-600 hover:border-orange-400'
              }`}
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              {selectedCharacter?.id === character.id && (
                <>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400 animate-pulse"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-orange-400/10 animate-pulse"></div>
                </>
              )}
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/0 via-orange-400/5 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="p-4">
                  <div className="w-full h-48 mb-4 bg-gray-900 border border-gray-700 flex items-center justify-center relative overflow-hidden group/image">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 via-transparent to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {character.image ? (
                      <img 
                        src={character.image} 
                        alt={character.name} 
                        className="max-w-full max-h-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:drop-shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextSibling) {
                            (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-orange-400 font-orbitron font-bold text-2xl transition-all duration-500 group-hover:scale-125 group-hover:text-yellow-300"
                      style={{ display: character.image ? 'none' : 'flex' }}
                    >
                      {character.id === 'ashina' && '👑'}
                      {character.id === 'cowboy' && '🤠'}
                      {character.id === 'snow' && '❄️'}
                      {character.id === 'grim' && '💀'}
                    </div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                      <div className="absolute top-2 left-2 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-4 right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute bottom-3 left-6 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-6 right-2 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                    </div>
                  </div>
                  
                  <h3 className="font-orbitron font-bold text-orange-400 text-center mb-2 tracking-wider transition-all duration-300 group-hover:text-yellow-300 group-hover:scale-105 group-hover:tracking-widest">
                    {character.name}
                  </h3>
                
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between group/stat">
                    <span className="text-blue-400 transition-all duration-300 group-hover/stat:text-cyan-300 group-hover/stat:font-bold">SPEED:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 transition-all duration-300 transform group-hover:scale-125 ${
                            i < character.stats.speed 
                              ? 'bg-blue-400 group-hover:bg-cyan-300 group-hover:shadow-sm group-hover:shadow-cyan-300' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          }`}
                          style={{animationDelay: `${i * 50}ms`}}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between group/stat">
                    <span className="text-green-400 transition-all duration-300 group-hover/stat:text-lime-300 group-hover/stat:font-bold">JUMP:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 transition-all duration-300 transform group-hover:scale-125 ${
                            i < character.stats.jump 
                              ? 'bg-green-400 group-hover:bg-lime-300 group-hover:shadow-sm group-hover:shadow-lime-300' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          }`}
                          style={{animationDelay: `${i * 50}ms`}}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between group/stat">
                    <span className="text-purple-400 transition-all duration-300 group-hover/stat:text-pink-300 group-hover/stat:font-bold">SPECIAL:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 transition-all duration-300 transform group-hover:scale-125 ${
                            i < character.stats.special 
                              ? 'bg-purple-400 group-hover:bg-pink-300 group-hover:shadow-sm group-hover:shadow-pink-300' 
                              : 'bg-gray-700 group-hover:bg-gray-600'
                          }`}
                          style={{animationDelay: `${i * 50}ms`}}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Character Details */}
        {selectedCharacter && (
          <div className="bg-black border-2 border-orange-400 p-6 relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-orbitron font-black text-orange-400 mb-2 tracking-wider">
                  {selectedCharacter.name}
                </h2>
                <p className="text-orange-300/80 font-mono">{selectedCharacter.description}</p>
              </div>
              
              <button
                onClick={() => onCharacterSelect(selectedCharacter)}
                className="bg-black border border-green-400 px-8 py-4 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-400/50 animate-pulse hover:animate-none overflow-hidden group"
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400 animate-pulse"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                <span className="relative z-10 transition-all duration-300 group-hover:text-yellow-100 group-hover:tracking-widest">START GAME</span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}