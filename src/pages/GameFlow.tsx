import { useState } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { StoryScreen } from '@/components/StoryScreen';
import MainHub from '@/pages/MainHub';

export default function GameFlow() {
  const [gameState, setGameState] = useState<'loading' | 'story' | 'mainhub'>('loading');

  // Handler untuk menyelesaikan loading screen
  const handleLoadingComplete = () => {
    setGameState('story');
  };

  // Handler untuk menyelesaikan story screen
  const handleStoryComplete = () => {
    setGameState('mainhub');
  };

  // Render berdasarkan game state
  if (gameState === 'loading') {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  if (gameState === 'story') {
    return <StoryScreen onComplete={handleStoryComplete} />;
  }

  if (gameState === 'mainhub') {
    return <MainHub />;
  }

  // Fallback
  return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
}