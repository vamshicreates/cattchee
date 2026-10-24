import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ShoppingBag, Copy, Check, Share2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  mode: string;
  onPlayAgain: () => void;
  onOpenStore: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  mode,
  onPlayAgain,
  onOpenStore,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sound.playGameOver();
      sound.triggerHaptic('success');

      // Trigger colorful festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6E14', '#FFA500', '#2563EB', '#10B981', '#EC4899'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isNewHighScore = score > 0 && score >= highScore;
  const discountAmount = Math.max(score, 10);
  const couponCode = `BABA-OFF-${discountAmount}`;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    sound.playClick();
    const text = encodeURIComponent(
      `🎯 I just scored ${score} in Cattchee by T-SHIRTbaba and won a ₹${discountAmount} discount coupon (${couponCode})! 👕 Can you beat my score? Play Cattchee now!`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-300 flex flex-col text-center">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-b from-orange-500 to-amber-500 p-6 text-white relative">
          {isNewHighScore && (
            <div className="inline-flex items-center gap-1 bg-yellow-400 text-amber-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm animate-bounce-short">
              <Sparkles className="w-3.5 h-3.5" /> New High Score!
            </div>
          )}

          <h2 className="font-baba-title font-black text-2xl tracking-tight">
            {score >= 25 ? 'INSANE CATCHES! 🔥' : score >= 10 ? 'WELL PLAYED! 👏' : 'GOOD EFFORT! 👍'}
          </h2>
          <p className="text-xs text-orange-100 font-semibold mt-0.5">
            {mode === 'blitz' ? '60s Blitz Finished' : 'Game Finished'}
          </p>

          {/* Big Score Bubble */}
          <div className="mt-4 inline-flex flex-col items-center justify-center bg-white text-orange-600 w-24 h-24 rounded-3xl shadow-xl mx-auto border-4 border-orange-200">
            <span className="font-baba-title font-black text-4xl leading-none">{score}</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Points</span>
          </div>
        </div>

        {/* Voucher Award Card */}
        <div className="p-5 space-y-4">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border-2 border-dashed border-orange-300">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Your Cattchee Reward
            </div>
            <div className="text-2xl font-black text-green-600 font-baba-title mt-0.5">
              ₹{discountAmount} OFF
            </div>
            <p className="text-[11px] text-gray-600 mt-1">
              Valid on all T-SHIRTbaba apparel & limited drops!
            </p>

            {/* Copyable Coupon Box */}
            <div className="mt-3 flex items-center justify-between bg-white border border-orange-200 rounded-xl p-2 px-3 shadow-inner">
              <span className="font-mono font-bold text-xs text-orange-700 tracking-wider">
                {couponCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 active:scale-95 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                sound.playClick();
                onOpenStore();
              }}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-baba-title font-black text-base shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              Redeem in Baba's Store
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onPlayAgain();
              }}
              className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-baba-title font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again & Score Higher
            </button>
          </div>

          {/* Social Share */}
          <button
            onClick={handleShare}
            className="w-full py-2.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-green-200"
          >
            <Share2 className="w-4 h-4" />
            Share ₹{discountAmount} Discount on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
