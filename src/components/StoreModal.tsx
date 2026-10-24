import React, { useState } from 'react';
import { X, ShoppingBag, Check, Share2, Tag, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface StoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnedDiscount: number;
}

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  color: string;
  tag: string;
  imageColor: string;
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'tee-1',
    name: 'The Meditating Baba Graphic Tee',
    originalPrice: 499,
    color: 'Orange / White',
    tag: 'Bestseller',
    imageColor: '#F97316',
    description: '100% Super-combed cotton with the signature meditating Yogi Baba print.',
  },
  {
    id: 'tee-2',
    name: 'Cattchee "Catch The Tee" Edition',
    originalPrice: 549,
    color: 'Royal Blue',
    tag: 'Game Edition',
    imageColor: '#2563EB',
    description: 'Special tribute t-shirt honoring the unreleased hypercasual game idea!',
  },
  {
    id: 'tee-3',
    name: 'Code, Chai & Hustle Oversized Tee',
    originalPrice: 649,
    color: 'Jet Black',
    tag: 'Trending',
    imageColor: '#1E293B',
    description: 'Heavyweight 240 GSM French terry cotton with relaxed streetwear drop-shoulder fit.',
  },
  {
    id: 'tee-4',
    name: 'Minimalist Sunshine Pocket Tee',
    originalPrice: 449,
    color: 'Sunny Yellow',
    tag: 'Summer Classic',
    imageColor: '#EAB308',
    description: 'Ultra-soft breathable organic cotton for everyday effortless comfort.',
  },
  {
    id: 'tee-5',
    name: 'Neon Cyberpunk Baba Tee',
    originalPrice: 699,
    color: 'Neon Pink / Purple',
    tag: 'Limited Drop',
    imageColor: '#EC4899',
    description: 'Glow-in-the-dark silkscreen typography designed for creators and gamers.',
  },
];

export const StoreModal: React.FC<StoreModalProps> = ({ isOpen, onClose, earnedDiscount }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const discountToApply = Math.max(earnedDiscount, 15); // Guaranteed at least ₹15 starter discount!
  const finalPrice = Math.max(selectedProduct.originalPrice - discountToApply, 99);
  const couponCode = `BABA-SAVE-${discountToApply}`;

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleWhatsAppOrder = () => {
    sound.playClick();
    const msg = encodeURIComponent(
      `👋 Namaste T-SHIRTbaba! I just played the Cattchee game and earned ₹${discountToApply} OFF! 👕\n\n` +
      `I want to order:\n` +
      `• Item: ${selectedProduct.name} (${selectedSize})\n` +
      `• Original Price: ₹${selectedProduct.originalPrice}\n` +
      `• Game Discount: -₹${discountToApply} (Code: ${couponCode})\n` +
      `• Final Price: ₹${finalPrice}\n\n` +
      `Please confirm my order!`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-orange-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-500 p-4 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-baba-title font-black text-lg tracking-wide flex items-center gap-1.5">
                T-SHIRTbaba Store
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </h3>
              <p className="text-xs text-orange-100 font-medium">Redeem your Cattchee game discount</p>
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

        {/* Discount Voucher Banner */}
        <div className="bg-amber-50 p-3.5 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-xs font-semibold text-gray-600">Your Active Discount:</div>
              <div className="text-base font-black text-orange-600 font-baba-title">
                ₹{discountToApply} OFF Every T-Shirt!
              </div>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5" /> : null}
            {copiedCode ? 'COPIED!' : couponCode}
          </button>
        </div>

        {/* Scrollable Catalog */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Selected Product Preview Card */}
          <div className="bg-gradient-to-br from-orange-50/50 to-white p-4 rounded-2xl border-2 border-orange-200/80 shadow-sm">
            <div className="flex gap-4 items-center">
              {/* Tee Color Box */}
              <div
                style={{ backgroundColor: selectedProduct.imageColor }}
                className="w-20 h-24 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden"
              >
                <div className="text-3xl filter drop-shadow">👕</div>
                <span className="absolute top-1 left-1 bg-black/40 text-[9px] text-white px-1.5 py-0.5 rounded font-bold">
                  {selectedProduct.tag}
                </span>
              </div>

              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                  {selectedProduct.color}
                </span>
                <h4 className="font-baba-title font-extrabold text-gray-900 text-sm leading-tight mt-0.5">
                  {selectedProduct.name}
                </h4>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                  {selectedProduct.description}
                </p>

                {/* Price Breakdown */}
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-gray-400 line-through text-xs font-medium">
                    ₹{selectedProduct.originalPrice}
                  </span>
                  <span className="text-xl font-black text-green-600 font-baba-title">
                    ₹{finalPrice}
                  </span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    Save ₹{discountToApply}!
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="mt-3 pt-3 border-t border-orange-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">Select Size:</span>
              <div className="flex gap-1.5">
                {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSize(sz);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition-all ${
                      selectedSize === sz
                        ? 'bg-orange-500 text-white shadow-sm scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collection Grid */}
          <div>
            <h5 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
              Explore T-SHIRTbaba Styles:
            </h5>
            <div className="grid grid-cols-1 gap-2">
              {PRODUCTS.map((prod) => {
                const isSelected = selectedProduct.id === prod.id;
                const pFinal = Math.max(prod.originalPrice - discountToApply, 99);

                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedProduct(prod);
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: prod.imageColor }}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm"
                      >
                        👕
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-800 line-clamp-1">
                          {prod.name}
                        </div>
                        <div className="text-[10px] text-gray-500">{prod.color}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-gray-900 font-baba-title">
                        ₹{pFinal}
                      </div>
                      <div className="text-[10px] text-gray-400 line-through">
                        ₹{prod.originalPrice}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-2">
          <button
            onClick={handleWhatsAppOrder}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl font-baba-title font-black text-base shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Claim & Order on WhatsApp (₹{finalPrice})
          </button>
          <p className="text-[10px] text-center text-gray-400 font-medium">
            T-SHIRTbaba Hypercasual Loyalty Program • 1 Point = ₹1 Off
          </p>
        </div>
      </div>
    </div>
  );
};
