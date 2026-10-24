import React from 'react';
import { X, Trophy, Award, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerHighScore: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  discount: number;
  badge?: string;
  isPlayer?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  playerHighScore,
}) => {
  if (!isOpen) return null;

  const defaultLeaders: LeaderboardEntry[] = [
    { rank: 1, name: 'Vamshi C. 🚀', score: 68, discount: 68, badge: 'Tee Master' },
    { rank: 2, name: 'Rahul Sharma', score: 54, discount: 54, badge: 'Combo King' },
    { rank: 3, name: 'Priya Patel', score: 47, discount: 47, badge: 'Speedster' },
    { rank: 4, name: 'Arjun Dev', score: 39, discount: 39 },
    { rank: 5, name: 'Sneha Reddy', score: 34, discount: 34 },
    { rank: 6, name: 'Karthik R.', score: 28, discount: 28 },
    { rank: 7, name: 'Ananya S.', score: 22, discount: 22 },
  ];

  // Insert player ranking dynamically
  let playerRank = 8;
  const entries = [...defaultLeaders];
  if (playerHighScore > 0) {
    const higherIndex = entries.findIndex((e) => playerHighScore >= e.score);
    if (higherIndex !== -1) {
      entries.splice(higherIndex, 0, {
        rank: higherIndex + 1,
        name: 'You (Champion) ⭐',
        score: playerHighScore,
        discount: playerHighScore,
        badge: 'You!',
        isPlayer: true,
      });
      // Re-number ranks
      entries.forEach((e, idx) => (e.rank = idx + 1));
      playerRank = higherIndex + 1;
    } else {
      entries.push({
        rank: entries.length + 1,
        name: 'You ⭐',
        score: playerHighScore,
        discount: playerHighScore,
        badge: 'You!',
        isPlayer: true,
      });
      playerRank = entries.length;
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Trophy className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-baba-title font-black text-lg">Top Cattcheers</h3>
              <p className="text-xs text-orange-100">Global Weekly Leaderboard</p>
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

        {/* Player Stats Banner */}
        <div className="bg-orange-50 p-3.5 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Your High Score</div>
              <div className="text-lg font-black text-orange-600 font-baba-title">
                {playerHighScore} pts <span className="text-xs text-green-600 font-bold">(₹{playerHighScore} OFF)</span>
              </div>
            </div>
          </div>
          <div className="bg-white border border-orange-200 px-3 py-1 rounded-xl text-center shadow-sm">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Rank</div>
            <div className="text-sm font-black text-gray-800">#{playerHighScore > 0 ? playerRank : '-'}</div>
          </div>
        </div>

        {/* Podium / Ranks List */}
        <div className="overflow-y-auto p-3 space-y-2 flex-1">
          {entries.slice(0, 10).map((entry) => {
            const isTop3 = entry.rank <= 3;
            const rankIcon =
              entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`;

            return (
              <div
                key={entry.rank + entry.name}
                className={`p-2.5 rounded-2xl flex items-center justify-between transition-all ${
                  entry.isPlayer
                    ? 'bg-orange-100/90 border-2 border-orange-500 shadow-sm'
                    : isTop3
                    ? 'bg-amber-50/60 border border-amber-200'
                    : 'bg-gray-50 border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 text-center font-black text-base">
                    {rankIcon}
                  </span>
                  <div>
                    <div className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      {entry.name}
                      {entry.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-orange-200 text-orange-800 rounded-md font-bold">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-500 inline" />
                      ₹{entry.discount} discount unlocked
                    </div>
                  </div>
                </div>

                <div className="font-baba-title font-black text-sm text-gray-900">
                  {entry.score} <span className="text-[10px] text-gray-500 font-semibold">pts</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-[10px] text-gray-400">
            Leaderboard updates live every week • Top ranker wins a free T-SHIRTbaba tee!
          </p>
        </div>
      </div>
    </div>
  );
};
