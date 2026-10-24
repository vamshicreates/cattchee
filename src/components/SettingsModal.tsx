import React from 'react';
import { X, Volume2, VolumeX, Music, Smartphone, HelpCircle, BookOpen, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  musicEnabled: boolean;
  setMusicEnabled: (val: boolean) => void;
  hapticsEnabled: boolean;
  setHapticsEnabled: (val: boolean) => void;
  onOpenStory: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
  setSoundEnabled,
  musicEnabled,
  setMusicEnabled,
  hapticsEnabled,
  setHapticsEnabled,
  onOpenStory,
  onResetData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <h3 className="font-baba-title font-black text-lg">Settings & About</h3>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Settings List */}
        <div className="p-4 space-y-3">
          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">Sound Effects</div>
                <div className="text-[11px] text-gray-400">Pops, chimes, and buzzes</div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                sound.setMuted(!next);
                if (next) sound.playClick();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Music Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">Arcade Music</div>
                <div className="text-[11px] text-gray-400">Upbeat hypercasual soundtrack</div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = !musicEnabled;
                setMusicEnabled(next);
                if (next) sound.startBgm();
                else sound.stopBgm();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                musicEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics / Vibration Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">Haptic Vibration</div>
                <div className="text-[11px] text-gray-400">Mobile tactile clicks & buzzes</div>
              </div>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setHapticsEnabled(!hapticsEnabled);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                hapticsEnabled ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Story & Concept button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenStory();
            }}
            className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100/70 rounded-2xl border border-orange-200 transition-all text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 text-white rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-black text-orange-950 font-baba-title">
                  The Story of Cattchee
                </div>
                <div className="text-[11px] text-orange-800/80">
                  Read the original concept & marketing story
                </div>
              </div>
            </div>
            <HelpCircle className="w-4 h-4 text-orange-600" />
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              if (window.confirm('Reset your Cattchee high score and stats?')) {
                sound.playClick();
                onResetData();
              }
            }}
            className="w-full py-2.5 text-xs text-red-500 hover:text-red-700 font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset High Score & Progress
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[11px] text-gray-400 font-semibold">
            Cattchee v1.0.0 by T-SHIRTbaba • Made for Mobile
          </p>
        </div>
      </div>
    </div>
  );
};
