import React, { useState } from 'react';
import { Play, Settings, Trophy, Award, ShoppingBag, Volume2, VolumeX, Gift, Sparkles, BookOpen } from 'lucide-react';
import { BabaLogo } from './BabaLogo';
import { sound } from '../utils/audio';

interface HomeScreenProps {
  onStartGame: (mode: 'classic' | 'blitz' | 'weekly') => void;
  onOpenStore: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenSettings: () => void;
  onOpenStory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  highScore: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenStore,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenSettings,
  onOpenStory,
  soundEnabled,
  onToggleSound,
  highScore,
}) => {
  const [selectedMode, setSelectedMode] = useState<'classic' | 'blitz' | 'weekly'>('classic');

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-white select-none">
      {/* Top Bar with High Score & Quick Sound Toggle */}
      <div className="z-10 px-5 pt-4 flex items-center justify-between">
        {/* Story pill */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenStory();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <BookOpen className="w-3.5 h-3.5 text-orange-600" />
          <span>Our Story</span>
        </button>

        {/* Sound toggle & High Score */}
        <div className="flex items-center gap-2">
          {highScore > 0 && (
            <div className="flex items-center gap-1 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-black text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Best: ₹{highScore} OFF
            </div>
          )}

          <button
            onClick={() => {
              sound.unlock();
              sound.playClick();
              onToggleSound();
            }}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all active:scale-90"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-orange-600" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Main Branding Section (Matching Poster 1 exactly!) */}
      <div className="z-10 flex flex-col items-center justify-center pt-2 px-4 text-center">
        {/* T-SHIRTbaba Mascot */}
        <BabaLogo size="lg" showText={true} />

        {/* Cattchee Title */}
        <h1 className="font-baba-title font-black text-4xl sm:text-5xl text-gray-900 tracking-tight mt-2">
          Cattchee
        </h1>

        {/* Catch the tee in Signature Cursive Handwritten font */}
        <p className="font-baba-script text-2xl text-gray-600 font-semibold -mt-1 tracking-wide">
          Catch the tee
        </p>

        {/* Concept Value Proposition Tag */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-black px-3.5 py-1 rounded-full shadow-md shadow-orange-500/20">
          <span>1 POINT = ₹1 OFF T-SHIRTS 💸</span>
        </div>
      </div>

      {/* Center Giant Play Button */}
      <div className="z-10 flex flex-col items-center justify-center my-auto">
        <button
          onClick={() => {
            sound.unlock();
            sound.playClick();
            onStartGame(selectedMode);
          }}
          className="group relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 p-1 shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300 active:scale-90 flex items-center justify-center animate-pulse-glow"
        >
          {/* Subtle Outer Ripple Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-orange-400/40 animate-ping pointer-events-none" />

          {/* Inner Circle */}
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-inner border-2 border-orange-300/60">
            <Play className="w-14 h-14 text-white fill-white translate-x-1 filter drop-shadow-md group-hover:scale-110 transition-transform" />
          </div>
        </button>

        {/* Mode Selector Chips */}
        <div className="mt-4 flex gap-1.5 p-1 bg-gray-100 rounded-2xl border border-gray-200">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('classic');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedMode === 'classic'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Classic 3-Lives
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedMode('blitz');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedMode === 'blitz'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            60s Blitz ⚡
          </button>
        </div>
      </div>

      {/* Curved Dark Brown Hill Bottom (Matching Image 1 Mockup!) */}
      <div className="relative w-full z-10">
        {/* Curving brown mound */}
        <div className="bg-[#5C1D0D] rounded-t-[50px] pt-4 pb-6 px-4 shadow-2xl flex flex-col items-center">
          {/* Weekly Challenge Gift Box Button */}
          <button
            onClick={() => {
              sound.unlock();
              sound.playClick();
              onStartGame('weekly');
            }}
            className="group -translate-y-9 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 rounded-2xl font-baba-title font-black text-xs shadow-lg shadow-black/30 flex items-center gap-2 border-2 border-amber-200 transition-all active:scale-95"
          >
            <div className="p-1 bg-amber-950/15 rounded-lg">
              <Gift className="w-4 h-4 text-amber-950" />
            </div>
            <span>Weekly Challenge</span>
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase">HOT</span>
          </button>

          {/* Bottom Navigation 4 Icons (Settings, Leaderboard, Trophy, Shop) */}
          <div className="w-full max-w-xs flex items-center justify-around -mt-4 text-white/80">
            {/* Settings */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="p-3 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 flex flex-col items-center gap-1"
              title="Settings"
            >
              <Settings className="w-6 h-6 stroke-[2]" />
              <span className="text-[10px] font-bold">Settings</span>
            </button>

            {/* Leaderboard (1-2-3 podium) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenLeaderboard();
              }}
              className="p-3 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 flex flex-col items-center gap-1"
              title="Leaderboard"
            >
              <Trophy className="w-6 h-6 stroke-[2] text-amber-400" />
              <span className="text-[10px] font-bold">Ranks</span>
            </button>

            {/* Achievements */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAchievements();
              }}
              className="p-3 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 flex flex-col items-center gap-1"
              title="Trophies"
            >
              <Award className="w-6 h-6 stroke-[2]" />
              <span className="text-[10px] font-bold">Badges</span>
            </button>

            {/* Storefront / Shop */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenStore();
              }}
              className="p-3 hover:text-white hover:bg-white/10 rounded-2xl transition-all active:scale-90 flex flex-col items-center gap-1"
              title="T-SHIRTbaba Store"
            >
              <ShoppingBag className="w-6 h-6 stroke-[2] text-orange-400" />
              <span className="text-[10px] font-bold">Store</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
