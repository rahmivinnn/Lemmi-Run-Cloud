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
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="h-20 bg-black border-b-2 border-orange-400 relative flex items-center justify-between px-8">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400"></div>
        
        <button
          onClick={onBack}
          className="bg-black border border-red-400 px-6 py-2 text-red-400 font-orbitron font-bold tracking-wider hover:bg-red-900/20 relative"
        >
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-red-400"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-400"></div>
          BACK
        </button>

        <h1 className="text-3xl font-orbitron font-black text-orange-400 tracking-widest">
          CHARACTER SELECTION
        </h1>

        <div className="w-24"></div>
      </div>

      {/* Character Grid */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {characters.map((character) => (
            <div
              key={character.id}
              onClick={() => setSelectedCharacter(character)}
              className={`bg-black border-2 cursor-pointer transition-all duration-200 relative ${
                selectedCharacter?.id === character.id
                  ? 'border-orange-400 bg-orange-900/20'
                  : 'border-gray-600 hover:border-orange-400'
              }`}
            >
              {selectedCharacter?.id === character.id && (
                <>
                  <div className="absolute -top-1 -left-1 w-3 h-3 bg-orange-400"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-orange-400"></div>
                </>
              )}
              
              <div className="p-4">
                <div className="w-full h-48 mb-4 bg-gray-900 border border-gray-700 flex items-center justify-center relative">
                  {character.image ? (
                    <img 
                      src={character.image} 
                      alt={character.name} 
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextSibling) {
                          (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className="absolute inset-0 flex items-center justify-center text-orange-400 font-orbitron font-bold text-2xl"
                    style={{ display: character.image ? 'none' : 'flex' }}
                  >
                    {character.id === 'ashina' && '👑'}
                    {character.id === 'cowboy' && '🤠'}
                    {character.id === 'snow' && '❄️'}
                    {character.id === 'grim' && '💀'}
                  </div>
                </div>
                
                <h3 className="font-orbitron font-bold text-orange-400 text-center mb-2 tracking-wider">
                  {character.name}
                </h3>
                
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-blue-400">SPEED:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${i < character.stats.speed ? 'bg-blue-400' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-400">JUMP:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${i < character.stats.jump ? 'bg-green-400' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-400">SPECIAL:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 ${i < character.stats.special ? 'bg-purple-400' : 'bg-gray-700'}`}
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
                className="bg-black border border-green-400 px-8 py-4 text-green-400 font-orbitron font-bold tracking-wider hover:bg-green-900/20 relative text-xl"
              >
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-green-400"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400"></div>
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-green-400"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400"></div>
                START GAME
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}