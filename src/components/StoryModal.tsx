import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'The Origin of Cattchee',
      subtitle: 'We developed a game, but never launched!',
      img: '/poster-launch.jpg',
      content: (
        <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
          <p>
            Meet <strong className="text-orange-600 font-extrabold">Cattchee</strong> — derived from{' '}
            <em>"Catch The Tee"</em>!
          </p>
          <p>
            Created for <strong className="text-orange-600 font-bold">T-SHIRTbaba</strong>, this game was built to merge
            hypercasual mobile gaming with an innovative e-commerce discount mechanic.
          </p>
          <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200">
            <span className="font-baba-title font-black text-orange-700 block text-sm">
              ✨ Original Vision
            </span>
            Players tap rolling t-shirts on mobile and get real discounts on apparel!
          </div>
        </div>
      ),
    },
    {
      title: 'Game Concept & Mechanics',
      subtitle: '1 Point = ₹1 Off Your T-Shirt!',
      img: '/poster-concept.jpg',
      content: (
        <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
          <p>
            T-shirts roll down the screen in conveyor lanes, and you must pick the right one based on prompts like:
          </p>
          <div className="p-2.5 bg-gray-100 rounded-xl font-mono text-center font-bold text-gray-800">
            "Catch the red tee! 🔴"
          </div>
          <p>
            Every point you score directly deducts <strong className="text-green-600">₹ 1 from your t-shirt price</strong>.
            Score 15 points? That is <strong className="text-green-600 font-black">₹ 15 OFF</strong> on your checkout!
          </p>
        </div>
      ),
    },
    {
      title: 'The Marketing Philosophy',
      subtitle: '"If not now, then someday for sure."',
      img: '/poster-marketing.jpg',
      content: (
        <div className="space-y-3 text-xs text-gray-700 leading-relaxed">
          <p>
            Hypercasual games captivated millions. T-SHIRTbaba envisioned using fun, addictive gameplay to promote the brand effectively.
          </p>
          <blockquote className="border-l-4 border-orange-500 pl-3 italic text-gray-600 text-xs">
            "While we couldn't release the game back then, the journey of bringing ideas to life was incredibly fulfilling. If not now, then someday for sure. That's the mindset I carry forward with optimism and determination!"
          </blockquote>
          <div className="flex items-center gap-1.5 text-xs text-orange-600 font-bold justify-center pt-2">
            <Heart className="w-4 h-4 fill-orange-500 text-orange-500" />
            And today, that idea is finally ALIVE and playable!
          </div>
        </div>
      ),
    },
  ];

  const current = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-orange-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <h3 className="font-baba-title font-black text-lg">The Cattchee Story</h3>
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

        {/* Poster / Slide Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {/* Poster image preview */}
          <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-orange-200 aspect-[4/5] flex items-center justify-center shadow-inner">
            <img
              src={current.img}
              alt={current.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // If local image fails, fallback gracefully
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white">
              <span className="text-[10px] uppercase font-bold tracking-wider text-orange-400">
                Slide {activeSlide + 1} of {slides.length}
              </span>
              <h4 className="font-baba-title font-black text-sm">{current.subtitle}</h4>
            </div>
          </div>

          <div>{current.content}</div>
        </div>

        {/* Carousel Navigation */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            disabled={activeSlide === 0}
            onClick={() => {
              sound.playClick();
              setActiveSlide((p) => Math.max(p - 1, 0));
            }}
            className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all ${
              activeSlide === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 bg-white border shadow-sm'
            }`}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {/* Dots */}
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === activeSlide ? 'w-5 bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            disabled={activeSlide === slides.length - 1}
            onClick={() => {
              sound.playClick();
              setActiveSlide((p) => Math.min(p + 1, slides.length - 1));
            }}
            className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition-all ${
              activeSlide === slides.length - 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-700 bg-white border shadow-sm'
            }`}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
