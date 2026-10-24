import React, { useState, useEffect } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { StoreModal } from './components/StoreModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { AchievementsModal } from './components/AchievementsModal';
import { SettingsModal } from './components/SettingsModal';
import { StoryModal } from './components/StoryModal';
import { sound } from './utils/audio';
import { Maximize2, Minimize2 } from 'lucide-react';

export const App: React.FC = () => {
  // Screen state
  const [gameState, setGameState] = useState<'home' | 'playing'>('home');
  const [gameMode, setGameMode] = useState<'classic' | 'blitz' | 'weekly'>('classic');
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Persistent stats
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('cattchee_high_score') || '0', 10);
  });
  const [totalCatches, setTotalCatches] = useState<number>(() => {
    return parseInt(localStorage.getItem('cattchee_total_catches') || '0', 10);
  });

  // Sound settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cattchee_sound') !== 'false';
  });
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cattchee_music') !== 'false';
  });
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Modals
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  // Desktop view mode (phone frame vs full screen)
  const [forceFullScreen, setForceFullScreen] = useState<boolean>(false);

  // Sync sound settings with audio engine
  useEffect(() => {
    sound.setMuted(!soundEnabled);
    localStorage.setItem('cattchee_sound', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('cattchee_music', musicEnabled.toString());
  }, [musicEnabled]);

  // Start game handler
  const handleStartGame = (mode: 'classic' | 'blitz' | 'weekly') => {
    setGameMode(mode);
    setGameState('playing');
    setIsGameOverOpen(false);
  };

  // Game over handler
  const handleGameOver = (finalScore: number) => {
    setCurrentScore(finalScore);
    setIsGameOverOpen(true);

    // Update high score
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('cattchee_high_score', finalScore.toString());
    }

    // Update total catches
    const updatedTotal = totalCatches + finalScore;
    setTotalCatches(updatedTotal);
    localStorage.setItem('cattchee_total_catches', updatedTotal.toString());
  };

  // Play again handler
  const handlePlayAgain = () => {
    setIsGameOverOpen(false);
    setGameState('playing');
  };

  // Reset progress handler
  const handleResetData = () => {
    localStorage.removeItem('cattchee_high_score');
    localStorage.removeItem('cattchee_total_catches');
    setHighScore(0);
    setTotalCatches(0);
    setIsSettingsOpen(false);
  };

  return (
    <div className="w-screen h-[100dvh] bg-gradient-to-br from-amber-600 via-orange-500 to-orange-600 flex items-center justify-center overflow-hidden p-0 sm:p-4 select-none">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap justify-around items-center overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="text-6xl m-4 transform rotate-12">
            👕
          </div>
        ))}
      </div>

      {/* Desktop Header Bar (hidden on mobile) */}
      <div className="hidden sm:flex absolute top-4 left-6 right-6 items-center justify-between text-white z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg">
            👕
          </div>
          <div>
            <div className="font-baba-title font-black text-sm tracking-wide">Cattchee ~ Catch The Tee</div>
            <div className="text-[10px] text-orange-200">The hypercasual marketing game by T-SHIRTbaba</div>
          </div>
        </div>

        <button
          onClick={() => setForceFullScreen(!forceFullScreen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 hover:bg-black/30 rounded-xl text-xs font-bold transition-all border border-white/10"
        >
          {forceFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          <span>{forceFullScreen ? 'Phone Frame' : 'Expand View'}</span>
        </button>
      </div>

      {/* Main Game Container / Smartphone Frame */}
      <main
        className={`relative w-full h-full ${
          forceFullScreen ? 'max-w-none max-h-none rounded-none' : 'sm:max-w-[420px] sm:max-h-[860px] sm:rounded-[44px]'
        } bg-white shadow-2xl overflow-hidden flex flex-col z-10 border-0 sm:border-[8px] sm:border-gray-900`}
      >
        {/* Smartphone Speaker / Notch (on desktop phone frame) */}
        {!forceFullScreen && (
          <div className="hidden sm:flex absolute top-2 inset-x-0 justify-center z-30 pointer-events-none">
            <div className="w-24 h-4 bg-gray-900 rounded-full" />
          </div>
        )}

        {/* Screens Switcher */}
        {gameState === 'home' ? (
          <HomeScreen
            onStartGame={handleStartGame}
            onOpenStore={() => setIsStoreOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenStory={() => setIsStoryOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            highScore={highScore}
          />
        ) : (
          <GameCanvas
            mode={gameMode}
            onGameOver={handleGameOver}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onBackToHome={() => setGameState('home')}
          />
        )}

        {/* Modals */}
        <GameOverModal
          isOpen={isGameOverOpen}
          score={currentScore}
          highScore={highScore}
          mode={gameMode}
          onPlayAgain={handlePlayAgain}
          onOpenStore={() => {
            setIsGameOverOpen(false);
            setIsStoreOpen(true);
          }}
        />

        <StoreModal
          isOpen={isStoreOpen}
          onClose={() => setIsStoreOpen(false)}
          earnedDiscount={Math.max(currentScore, highScore)}
        />

        <LeaderboardModal
          isOpen={isLeaderboardOpen}
          onClose={() => setIsLeaderboardOpen(false)}
          playerHighScore={highScore}
        />

        <AchievementsModal
          isOpen={isAchievementsOpen}
          onClose={() => setIsAchievementsOpen(false)}
          playerHighScore={highScore}
          totalCatches={totalCatches}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          musicEnabled={musicEnabled}
          setMusicEnabled={setMusicEnabled}
          hapticsEnabled={hapticsEnabled}
          setHapticsEnabled={setHapticsEnabled}
          onOpenStory={() => {
            setIsSettingsOpen(false);
            setIsStoryOpen(true);
          }}
          onResetData={handleResetData}
        />

        <StoryModal
          isOpen={isStoryOpen}
          onClose={() => setIsStoryOpen(false)}
        />
      </main>
    </div>
  );
};

export default App;
