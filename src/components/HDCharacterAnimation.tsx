import { useEffect, useRef, useState } from 'react';
import AshinaTexture from '@assets/ashina_1754580592322.webp';

interface HDCharacterAnimationProps {
  variant: 'loading' | 'menu';
  onAnimationComplete?: () => void;
}

export function HDCharacterAnimation({ variant, onAnimationComplete }: HDCharacterAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI for HD rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setIsLoaded(true);
      startAnimation();
    };

    img.src = AshinaTexture;

    const startAnimation = () => {
      let frame = 0;
      const maxFrames = variant === 'loading' ? 180 : 120; // 3 seconds at 60fps for loading, 2 seconds for menu
      
      const animate = () => {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, rect.width, rect.height);
        
        if (variant === 'loading') {
          // Loading animation - Character materializing with glitch effects
          renderLoadingAnimation(ctx, img, frame, rect.width, rect.height);
        } else {
          // Menu animation - Character idle with breathing and particle effects
          renderMenuAnimation(ctx, img, frame, rect.width, rect.height);
        }

        frame++;
        setAnimationFrame(frame);
        
        if (frame < maxFrames) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          if (variant === 'loading') {
            onAnimationComplete?.();
          }
          // Menu animation loops
          if (variant === 'menu') {
            frame = 0;
            animationRef.current = requestAnimationFrame(animate);
          }
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, onAnimationComplete]);

  const renderLoadingAnimation = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    frame: number, 
    width: number, 
    height: number
  ) => {
    const progress = frame / 180;
    const centerX = width / 2;
    const centerY = height / 2;

    // Character materialization effect
    ctx.save();
    
    // Glitch effect - random displacement
    if (progress < 0.7) {
      const glitchIntensity = (0.7 - progress) * 20;
      const offsetX = (Math.random() - 0.5) * glitchIntensity;
      const offsetY = (Math.random() - 0.5) * glitchIntensity;
      ctx.translate(offsetX, offsetY);
    }

    // Character scale animation
    const scale = Math.min(1, progress * 1.2);
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);

    // Character opacity with pixelation effect
    const alpha = Math.min(1, progress * 1.5);
    ctx.globalAlpha = alpha;

    // Draw character with pixelation during materialization
    if (progress < 0.5) {
      // Pixelated appearance during materialization
      ctx.imageSmoothingEnabled = false;
      const pixelSize = Math.max(1, (0.5 - progress) * 8);
      ctx.scale(pixelSize, pixelSize);
      ctx.drawImage(img, -img.width/(2*pixelSize), -img.height/(2*pixelSize), img.width/pixelSize, img.height/pixelSize);
    } else {
      // Smooth high-resolution character
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const charWidth = 200;
      const charHeight = (img.height / img.width) * charWidth;
      ctx.drawImage(img, -charWidth/2, -charHeight/2, charWidth, charHeight);
    }

    ctx.restore();

    // Neural scan lines effect
    if (progress < 0.8) {
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.8 - progress})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        const y = (frame * 3 + i * 40) % height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // Particle effects
    for (let i = 0; i < 20; i++) {
      const particleX = centerX + Math.cos(frame * 0.1 + i) * (50 + i * 5);
      const particleY = centerY + Math.sin(frame * 0.1 + i) * (50 + i * 5);
      const particleAlpha = Math.max(0, progress - 0.3) * (1 - i / 20);
      
      ctx.fillStyle = `rgba(0, 255, 255, ${particleAlpha})`;
      ctx.fillRect(particleX, particleY, 2, 2);
    }
  };

  const renderMenuAnimation = (
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    frame: number, 
    width: number, 
    height: number
  ) => {
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);

    // Breathing animation
    const breathScale = 1 + Math.sin(frame * 0.05) * 0.02;
    ctx.scale(breathScale, breathScale);

    // Subtle floating animation
    const floatY = Math.sin(frame * 0.03) * 3;
    ctx.translate(0, floatY);

    // High-resolution character rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    const charWidth = 180;
    const charHeight = (img.height / img.width) * charWidth;
    
    // Add subtle glow effect
    ctx.shadowColor = 'rgba(0, 255, 255, 0.3)';
    ctx.shadowBlur = 10;
    
    ctx.drawImage(img, -charWidth/2, -charHeight/2, charWidth, charHeight);
    
    ctx.restore();

    // Ambient particle field
    for (let i = 0; i < 15; i++) {
      const angle = (frame * 0.01 + i * 0.4);
      const radius = 80 + Math.sin(frame * 0.02 + i) * 20;
      const particleX = centerX + Math.cos(angle) * radius;
      const particleY = centerY + Math.sin(angle) * radius;
      const alpha = 0.3 + Math.sin(frame * 0.03 + i) * 0.2;
      
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Neural interface overlay
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 100 + Math.sin(frame * 0.02) * 5, 0, Math.PI * 2);
    ctx.stroke();
  };

  return (
    <div className={`relative ${variant === 'loading' ? 'w-full h-full' : 'w-64 h-64'}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          imageRendering: 'pixelated',
        }}
      />
      
      {variant === 'loading' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-cyan-400 font-mono text-sm mb-2">
            MATERIALIZING NEURAL AVATAR...
          </div>
          <div className="w-64 h-1 bg-gray-800 relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-100"
              style={{ width: `${(animationFrame / 180) * 100}%` }}
            />
          </div>
          <div className="text-cyan-300/60 font-mono text-xs mt-2">
            {Math.round((animationFrame / 180) * 100)}% COMPLETE
          </div>
        </div>
      )}

      {variant === 'menu' && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-cyan-400 font-mono text-sm animate-pulse">
            LOADING CHARACTER...
          </div>
        </div>
      )}
    </div>
  );
}