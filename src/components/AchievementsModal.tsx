import React from 'react';
import { X, Award, CheckCircle, Lock } from 'lucide-react';
import { sound } from '../utils/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerHighScore: number;
  totalCatches: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  reward: string;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  playerHighScore,
  totalCatches,
}) => {
  if (!isOpen) return null;

  const achievements: Achievement[] = [
    {
      id: 'first_catch',
      title: 'First Catch!',
      description: 'Catch your very first t-shirt in Cattchee.',
      icon: '👕',
      unlocked: totalCatches >= 1,
      reward: '₹5 Starter Bonus',
    },
    {
      id: 'baba_disciple',
      title: 'Baba Disciple',
      description: 'Score 15 points in a single run (₹15 OFF).',
      icon: '🧘',
      unlocked: playerHighScore >= 15,
      reward: '₹15 Off Coupon',
    },
    {
      id: 'half_century',
      title: 'Wardrobe Guru',
      description: 'Catch 50 t-shirts in total lifetime plays.',
      icon: '⚡',
      unlocked: totalCatches >= 50,
      reward: 'Golden Baba Badge',
    },
    {
      id: 'tee_tycoon',
      title: 'Tee Tycoon',
      description: 'Achieve a score of 35 or higher in one game.',
      icon: '👑',
      unlocked: playerHighScore >= 35,
      reward: '₹35 Super Discount',
    },
    {
      id: 'rainbow_catcher',
      title: 'Hypercasual Legend',
      description: 'Reach 50+ points in one legendary run.',
      icon: '🌈',
      unlocked: playerHighScore >= 50,
      reward: 'VIP Baba Club Access',
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-baba-title font-black text-lg">Trophies & Badges</h3>
              <p className="text-xs text-orange-100">{unlockedCount} / {achievements.length} Unlocked</p>
            </div>
          </div>
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

        {/* List */}
        <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                item.unlocked
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-gray-50/60 border-gray-200 opacity-60'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-orange-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                {item.icon}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-baba-title font-extrabold text-sm text-gray-900">
                    {item.title}
                  </h4>
                  {item.unlocked ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                  {item.description}
                </p>
                <div className="mt-1 text-[10px] font-bold text-orange-600">
                  🎁 Reward: {item.reward}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400 font-medium">
            Unlock achievements to receive bonus coupon boosters!
          </p>
        </div>
      </div>
    </div>
  );
};
