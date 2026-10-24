import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Pause, Play, Volume2, VolumeX, Flame, Zap } from 'lucide-react';
import { TShirtSVG, TShirtColor, COLOR_CONFIG } from './TShirt';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  mode: 'classic' | 'blitz' | 'weekly';
  onGameOver: (finalScore: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBackToHome: () => void;
}

interface ActiveTee {
  id: string;
  color: TShirtColor;
  isSpecial?: 'golden' | 'rainbow' | 'danger';
  lane: number; // 0, 1, 2
  y: number; // 0 (top) to 110 (bottom)
  speed: number;
  rotation: number;
}

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const REGULAR_COLORS: TShirtColor[] = ['red', 'blue', 'green', 'pink', 'yellow', 'orange'];

export const GameCanvas: React.FC<GameCanvasProps> = ({
  mode,
  onGameOver,
  soundEnabled,
  onToggleSound,
  onBackToHome,
}) => {
  // Game states
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [combo, setCombo] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [currentTargetColor, setCurrentTargetColor] = useState<TShirtColor>('red');
  const [targetCountNeeded, setTargetCountNeeded] = useState<number>(3);
  const [targetCaughtSoFar, setTargetCaughtSoFar] = useState<number>(0);
  const [promptAnimation, setPromptAnimation] = useState<boolean>(false);

  // Floating text popups
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Active t-shirts in motion
  const [tees, setTees] = useState<ActiveTee[]>([]);

  // Refs for animation frame loop
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const isGameOverRef = useRef<boolean>(false);

  // Pick a fresh new prompt target color
  const pickNewTarget = useCallback((currentColor?: TShirtColor) => {
    const candidates = REGULAR_COLORS.filter((c) => c !== currentColor);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentTargetColor(chosen);
    setTargetCountNeeded(Math.floor(Math.random() * 3) + 2); // 2 to 4 targets needed
    setTargetCaughtSoFar(0);

    // Audio and visual prompt flash
    setPromptAnimation(true);
    sound.playCombo();
    setTimeout(() => setPromptAnimation(false), 500);
  }, []);

  // Initialize first target
  useEffect(() => {
    pickNewTarget();
    sound.startBgm();

    return () => {
      sound.stopBgm();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [pickNewTarget]);

  // Blitz countdown timer
  useEffect(() => {
    if (mode !== 'blitz' || isPaused || isGameOverRef.current) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused]);

  // Trigger game over handler
  const triggerGameOver = useCallback(() => {
    if (isGameOverRef.current) return;
    isGameOverRef.current = true;
    sound.stopBgm();
    onGameOver(score);
  }, [score, onGameOver]);

  // Spawn new t-shirt
  const spawnTee = useCallback(() => {
    // Determine which color to spawn: 40% chance of target color, 50% random other color, 10% special
    let color: TShirtColor;
    let isSpecial: 'golden' | 'rainbow' | 'danger' | undefined = undefined;

    const roll = Math.random();
    if (roll < 0.1) {
      // Special tee
      const specRoll = Math.random();
      if (specRoll < 0.45) {
        color = 'golden';
        isSpecial = 'golden';
      } else if (specRoll < 0.8) {
        color = 'rainbow';
        isSpecial = 'rainbow';
      } else {
        color = 'black';
        isSpecial = 'danger';
      }
    } else if (roll < 0.5) {
      color = currentTargetColor;
    } else {
      const others = REGULAR_COLORS.filter((c) => c !== currentTargetColor);
      color = others[Math.floor(Math.random() * others.length)];
    }

    // Pick lane (0, 1, or 2)
    const lane = Math.floor(Math.random() * 3);

    // Speed scales slightly with score
    const baseSpeed = mode === 'weekly' ? 0.42 : 0.32;
    const speedBoost = Math.min(score * 0.005, 0.25);

    const newTee: ActiveTee = {
      id: `tee-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      color,
      isSpecial,
      lane,
      y: -20, // start just above the view
      speed: baseSpeed + speedBoost + (Math.random() * 0.08 - 0.04),
      rotation: (Math.random() - 0.5) * 12,
    };

    setTees((prev) => [...prev, newTee]);
  }, [currentTargetColor, score, mode]);

  // Main 60FPS Game Loop
  useEffect(() => {
    if (isPaused || isGameOverRef.current) return;

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Spawn timer (spawns tee every 550ms - 900ms)
      spawnTimerRef.current += delta;
      const spawnInterval = Math.max(550, 850 - Math.min(score * 8, 300));
      if (spawnTimerRef.current > spawnInterval) {
        spawnTee();
        spawnTimerRef.current = 0;
      }

      // Update positions of tees
      setTees((prevTees) => {
        const nextTees: ActiveTee[] = [];

        for (const t of prevTees) {
          const nextY = t.y + t.speed * (delta / 16);

          // If reached bottom without being tapped
          if (nextY > 108) {
            // If the player let a TARGET tee slip by in classic mode
            if (t.color === currentTargetColor && mode === 'classic' && !isGameOverRef.current) {
              setLives((l) => {
                const nextLives = l - 1;
                sound.playError();
                sound.triggerHaptic('error');
                setScreenShake(true);
                setTimeout(() => setScreenShake(false), 300);

                if (nextLives <= 0) {
                  triggerGameOver();
                }
                return Math.max(nextLives, 0);
              });
              setCombo(0);
            }
          } else {
            nextTees.push({ ...t, y: nextY });
          }
        }
        return nextTees;
      });

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPaused, spawnTee, currentTargetColor, mode, score, triggerGameOver]);

  // Add floating text animation
  const addFloatingText = (text: string, x: number, y: number, color: string) => {
    const id = `float-${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 700);
  };

  // Handle player tapping a t-shirt
  const handleTeeTap = (tee: ActiveTee, e: React.MouseEvent | React.TouchEvent) => {
    sound.unlock();
    if (isPaused || isGameOverRef.current) return;

    // Get tap coordinate for floating popup
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if ('touches' in e && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    // Remove tapped tee from screen
    setTees((prev) => prev.filter((t) => t.id !== tee.id));

    // Case 1: Danger Tee
    if (tee.isSpecial === 'danger') {
      sound.playError();
      sound.triggerHaptic('error');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 350);
      setCombo(0);
      addFloatingText('⚠️ OUCH! -1 LIFE', clientX, clientY, '#EF4444');

      if (mode === 'classic') {
        setLives((l) => {
          const nextL = l - 1;
          if (nextL <= 0) triggerGameOver();
          return Math.max(nextL, 0);
        });
      } else {
        setTimeLeft((t) => Math.max(t - 3, 0));
      }
      return;
    }

    // Case 2: Golden Baba Tee (+10 pts bonus!)
    if (tee.isSpecial === 'golden') {
      sound.playBonus();
      sound.triggerHaptic('success');
      const bonusPts = 10;
      setScore((s) => s + bonusPts);
      addFloatingText('+₹10 GOLDEN BABA! 👑', clientX, clientY, '#F59E0B');
      return;
    }

    // Case 3: Rainbow Tee (Wildcard match +3 pts!)
    if (tee.isSpecial === 'rainbow') {
      sound.playBonus();
      sound.triggerHaptic('success');
      setScore((s) => s + 3);
      setCombo((c) => c + 1);
      addFloatingText('+₹3 RAINBOW! 🌈', clientX, clientY, '#EC4899');
      return;
    }

    // Case 4: Correct Target Match!
    if (tee.color === currentTargetColor) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      sound.playCatch(nextCombo);
      sound.triggerHaptic('light');

      // Combo bonus: Every 5 combo adds +1 bonus discount point
      const comboBonus = nextCombo >= 5 ? 2 : 1;
      setScore((s) => s + comboBonus);

      const bonusLabel = comboBonus > 1 ? `+₹${comboBonus} (${nextCombo}x 🔥)` : `+₹1`;
      addFloatingText(bonusLabel, clientX, clientY, '#10B981');

      // Check objective progress
      const nextCount = targetCaughtSoFar + 1;
      setTargetCaughtSoFar(nextCount);

      if (nextCount >= targetCountNeeded) {
        pickNewTarget(currentTargetColor);
      }
    } else {
      // Case 5: Wrong Tee tapped!
      sound.playError();
      sound.triggerHaptic('error');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 350);
      setCombo(0);
      addFloatingText('WRONG TEE! ❌', clientX, clientY, '#EF4444');

      if (mode === 'classic') {
        setLives((l) => {
          const nextL = l - 1;
          if (nextL <= 0) triggerGameOver();
          return Math.max(nextL, 0);
        });
      } else {
        setTimeLeft((t) => Math.max(t - 2, 0));
      }
    }
  };

  const currentConf = COLOR_CONFIG[currentTargetColor];

  return (
    <div
      className={`relative w-full h-full flex flex-col overflow-hidden bg-amber-500 select-none ${
        screenShake ? 'animate-shake' : ''
      }`}
    >
      {/* Top Header / HUD */}
      <div className="z-20 bg-gradient-to-b from-[#2E0F07]/90 to-[#2E0F07]/75 backdrop-blur-md px-4 pt-3 pb-2 text-white border-b border-orange-500/30 flex items-center justify-between">
        {/* Score & Discount Meter */}
        <div className="flex items-center space-x-3">
          <div className="bg-orange-500/30 border border-orange-400/40 rounded-2xl px-3 py-1 flex items-baseline gap-1.5 shadow-sm">
            <span className="text-xs uppercase font-extrabold text-orange-200">Score</span>
            <span className="font-baba-title font-black text-2xl text-white tracking-tight">{score}</span>
            <span className="text-[11px] font-black text-green-400 bg-green-950/60 px-1.5 py-0.5 rounded-md">
              ₹{score} OFF
            </span>
          </div>

          {/* Combo Streak indicator */}
          {combo >= 2 && (
            <div className="hidden xs:flex items-center gap-1 bg-amber-500/30 border border-amber-400/40 px-2 py-1 rounded-xl text-xs font-black text-amber-300 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {combo}x STREAK
            </div>
          )}
        </div>

        {/* Lives or Timer */}
        <div className="flex items-center space-x-3">
          {mode === 'classic' ? (
            <div className="flex items-center space-x-1 bg-black/30 px-2.5 py-1.5 rounded-2xl border border-white/10">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-4 h-4 transition-all ${
                    heart <= lives
                      ? 'fill-red-500 text-red-500 scale-100'
                      : 'fill-gray-600 text-gray-600 opacity-40 scale-90'
                  }`}
                />
              ))}
            </div>
          ) : (
            <div className="bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-400 animate-bounce-short" />
              <span className={`font-mono font-black text-base ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Pause Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsPaused(!isPaused);
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
            title="Pause game"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Target Prompt Banner (The Iconic "Catch the red tee") */}
      <div className="z-10 bg-white/95 backdrop-blur-md px-4 py-2 shadow-md flex items-center justify-between border-b-2 border-orange-200">
        <div className="flex items-center space-x-2.5">
          <div
            className={`transition-transform duration-300 filter drop-shadow ${
              promptAnimation ? 'scale-125 rotate-12' : 'scale-100'
            }`}
          >
            <TShirtSVG color={currentTargetColor} size={46} />
          </div>

          <div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Target Objective</div>
            <div className="font-baba-title font-black text-sm text-gray-900 flex items-center gap-1">
              Catch the <span style={{ color: currentConf.darkHex }} className="uppercase font-black">{currentConf.label}</span> tee! {currentConf.emoji}
            </div>
          </div>
        </div>

        {/* Catch Goal Progress Dots */}
        <div className="flex items-center space-x-1.5 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-xl">
          {Array.from({ length: targetCountNeeded }).map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx < targetCaughtSoFar ? 'bg-green-500 scale-110 shadow-sm' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3 Conveyor Belt Lanes (Game Play Area) */}
      <div className="relative flex-1 w-full overflow-hidden conveyor-bg touch-none">
        {/* Lane Divider Guides */}
        <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
          <div className="w-1/3 border-r-2 border-dashed border-white" />
          <div className="w-1/3 border-r-2 border-dashed border-white" />
          <div className="w-1/3" />
        </div>

        {/* Rolling T-Shirts (Scaled up for bold mobile touch experience) */}
        {tees.map((tee) => {
          // Lane offsets: 0 -> 16.6%, 1 -> 50%, 2 -> 83.3%
          const leftPercent = tee.lane === 0 ? '16.6%' : tee.lane === 1 ? '50%' : '83.3%';

          return (
            <div
              key={tee.id}
              style={{
                position: 'absolute',
                top: `${tee.y}%`,
                left: leftPercent,
                transform: `translate(-50%, -50%) rotate(${tee.rotation}deg)`,
                zIndex: 5,
              }}
              onPointerDown={(e) => handleTeeTap(tee, e)}
              className="touch-none cursor-pointer filter drop-shadow-lg active:scale-90 transition-transform select-none p-1 flex items-center justify-center min-w-[105px] min-h-[110px]"
            >
              <TShirtSVG color={tee.color} isSpecial={tee.isSpecial} size={105} />
            </div>
          );
        })}

        {/* Floating Text Popups (+₹1, COMBO, etc.) */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            style={{
              position: 'fixed',
              left: ft.x,
              top: ft.y,
              transform: 'translate(-50%, -100%)',
              color: ft.color,
            }}
            className="pointer-events-none font-baba-title font-black text-lg filter drop-shadow-md animate-bounce-short z-40 whitespace-nowrap"
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-500/80 flex items-center justify-center mb-3 shadow-xl">
            <Pause className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-baba-title font-black text-2xl">Game Paused</h3>
          <p className="text-xs text-orange-200 mt-1 max-w-[220px]">
            Catch the <strong className="text-white">{currentConf.label}</strong> t-shirt to earn ₹1 off per point!
          </p>

          <div className="mt-6 flex flex-col gap-2.5 w-full max-w-[200px]">
            <button
              onClick={() => {
                sound.playClick();
                setIsPaused(false);
              }}
              className="py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-baba-title font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" /> Resume Game
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onBackToHome();
              }}
              className="py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-baba-title font-bold text-xs active:scale-95 transition-all"
            >
              Quit to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
