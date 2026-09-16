import React, { useEffect, useRef, useState } from 'react';

interface FallingStarsCelebrationProps {
  onClose?: () => void;
  durationMs?: number;
  autoClose?: boolean;
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  angle: number;
  angularVelocity: number;
  points: number;
  opacity: number;
  opacityDirection: number;
  wobbleSpeed: number;
  wobblePhase: number;
  stardustTimer: number;
}

interface StardustSpark {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
}

const STAR_COLORS = [
  '#FBBF24', // Amber Gold
  '#F59E0B', // Warm Gold
  '#06B6D4', // Cyan
  '#22D3EE', // Bright Cyan
  '#10B981', // Emerald
  '#34D399', // Mint
  '#A855F7', // Electric Violet
  '#C084FC', // Lavender Purple
  '#F43F5E', // Rose / Ruby
  '#FB7185', // Coral Pink
  '#3B82F6', // Cobalt Blue
  '#60A5FA', // Sky Blue
  '#FDE047', // Lemon Yellow
];

export const FallingStarsCelebration: React.FC<FallingStarsCelebrationProps> = ({
  onClose,
  durationMs = 2800,
  autoClose = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const starsRef = useRef<StarParticle[]>([]);
  const sparksRef = useRef<StardustSpark[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play subtle celebratory melodic chord chime via Web Audio API
  const playChimeSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pentatonic celebratory frequencies: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const startTime = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime + idx * 0.09);

        // Soft envelope
        gain.gain.setValueAtTime(0.001, startTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.12, startTime + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.09 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime + idx * 0.09);
        osc.stop(startTime + idx * 0.09 + 1.0);
      });
    } catch {
      // Audio autoplay policy fail-safe
    }
  };

  const createStar = (x?: number, y?: number): StarParticle => {
    const width = window.innerWidth;
    const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
    const points = Math.random() > 0.4 ? 5 : 4;
    const size = Math.random() * 9 + 8; // 8px to 17px

    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : -(Math.random() * 100 + 10),
      size,
      color,
      speedX: (Math.random() - 0.5) * 1.8,
      speedY: Math.random() * 3.2 + 2.4,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.09,
      points,
      opacity: Math.random() * 0.4 + 0.6,
      opacityDirection: Math.random() > 0.5 ? 0.02 : -0.02,
      wobbleSpeed: Math.random() * 0.03 + 0.02,
      wobblePhase: Math.random() * Math.PI * 2,
      stardustTimer: 0
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial batch of falling stars across screen width
    const initialStars: StarParticle[] = [];
    const starCount = Math.min(Math.floor(window.innerWidth / 16), 85);
    for (let i = 0; i < starCount; i++) {
      const star = createStar();
      star.y = -(Math.random() * window.innerHeight * 0.8 + 20);
      initialStars.push(star);
    }
    starsRef.current = initialStars;

    // Play pleasant chime
    playChimeSound();

    // Auto-close when duration finishes
    let timerId: NodeJS.Timeout | null = null;
    if (autoClose && onClose) {
      timerId = setTimeout(() => {
        onClose();
      }, durationMs);
    }

    // Draw pointed star
    const drawStarShape = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);

      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
    };

    let lastSpawnTime = Date.now();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Periodically spawn new stars until near end of animation
      const now = Date.now();
      if (now - lastSpawnTime > 90 && starsRef.current.length < 110) {
        starsRef.current.push(createStar());
        lastSpawnTime = now;
      }

      // Update and render stardust sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const spark = sparksRef.current[i];
        spark.life++;
        spark.opacity = 1 - spark.life / spark.maxLife;

        if (spark.life >= spark.maxLife) {
          sparksRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, spark.opacity);
        ctx.fillStyle = spark.color;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Update and render falling stars
      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const star = starsRef.current[i];

        star.y += star.speedY;
        star.x += Math.sin(star.wobblePhase) * 1.2 + star.speedX;
        star.wobblePhase += star.wobbleSpeed;
        star.angle += star.angularVelocity;

        star.opacity += star.opacityDirection;
        if (star.opacity > 0.95) {
          star.opacity = 0.95;
          star.opacityDirection = -0.02;
        } else if (star.opacity < 0.45) {
          star.opacity = 0.45;
          star.opacityDirection = 0.02;
        }

        star.stardustTimer++;
        if (star.stardustTimer % 4 === 0) {
          sparksRef.current.push({
            x: star.x + (Math.random() - 0.5) * 6,
            y: star.y - star.size * 0.4,
            size: Math.random() * 2 + 1,
            color: star.color,
            opacity: 0.8,
            life: 0,
            maxLife: Math.floor(Math.random() * 16 + 10)
          });
        }

        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(star.angle);
        ctx.globalAlpha = Math.max(0, Math.min(1, star.opacity));

        ctx.fillStyle = star.color;
        ctx.shadowColor = star.color;
        ctx.shadowBlur = 10;

        const innerR = star.size * 0.42;
        const outerR = star.size;
        drawStarShape(ctx, 0, 0, star.points, outerR, innerR);
        ctx.fill();

        ctx.restore();

        // Remove if off bottom of screen
        if (star.y > canvas.height + 50) {
          starsRef.current.splice(i, 1);
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [autoClose, durationMs, onClose]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {/* Non-blocking canvas overlay: shows falling stars automatically without any obstructing notifications */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none"
      />
    </div>
  );
};
