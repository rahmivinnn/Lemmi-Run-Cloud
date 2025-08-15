import { useState } from 'react';
import lemmiAvatar from '@assets/k2_1755247198375.png';

interface LemmiAvatarProps {
  variant?: 'small' | 'large';
  className?: string;
}

export function LemmiAvatar({ variant = 'small', className = '' }: LemmiAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const size = variant === 'large' ? 'w-32 h-32' : 'w-full h-full';
  
  return (
    <div 
      className={`relative overflow-hidden ${size} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Image */}
      <img
        src={lemmiAvatar}
        alt="Lemmi Avatar"
        className={`w-full h-full object-cover transition-all duration-300 ${
          isHovered ? 'scale-110 brightness-110' : 'scale-100'
        }`}
      />
      
      {/* Neural scan overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-800/0 via-blue-800/20 to-blue-800/0 animate-pulse" />
      
      {/* Scan lines */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(30, 58, 138, 0.3) 2px, rgba(30, 58, 138, 0.3) 4px)',
          animation: 'scanlines 2s linear infinite'
        }}
      />
      
      {/* Glitch effect on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-red-500/10 animate-pulse duration-150" />
      )}
    </div>
  );
}