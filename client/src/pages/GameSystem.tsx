import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { CharacterSelection } from '@/components/CharacterSelection';
import { GameRunner } from '@/components/GameRunner';

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

export default function GameSystem() {
  const [gameState, setGameState] = useState<'loading' | 'character-select' | 'game' | 'main'>('loading');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  const handleLoadingComplete = () => {
    setGameState('character-select');
  };

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
    setGameState('game');
  };

  const handleGameEnd = (score: number) => {
    console.log('Game ended with score:', score);
    setGameState('character-select');
  };

  const handleBackToCharacterSelect = () => {
    setGameState('character-select');
    setSelectedCharacter(null);
  };

  const handleBackToMain = () => {
    setGameState('main');
    setSelectedCharacter(null);
    // Navigate back to neural interface
    window.location.href = '/';
  };

  // Render different screens based on game state
  if (gameState === 'loading') {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (gameState === 'character-select') {
    return <CharacterSelection onCharacterSelect={handleCharacterSelect} onBack={handleBackToMain} />;
  }

  if (gameState === 'game' && selectedCharacter) {
    return <GameRunner character={selectedCharacter} onGameEnd={handleGameEnd} onBack={handleBackToCharacterSelect} />;
  }

  // This shouldn't happen, but redirect to character select as fallback
  return <CharacterSelection onCharacterSelect={handleCharacterSelect} onBack={handleBackToMain} />;
}