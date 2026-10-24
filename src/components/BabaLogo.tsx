import React, { useState } from 'react';

interface BabaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BabaLogo: React.FC<BabaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeDims = {
    sm: { img: 'w-10 h-10', text: 'text-sm' },
    md: { img: 'w-16 h-16', text: 'text-xl' },
    lg: { img: 'w-24 h-24', text: 'text-2xl' },
    xl: { img: 'w-32 h-32', text: 'text-3xl' },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Yogi Baba Character */}
      <div className={`relative ${sizeDims.img} flex items-center justify-center transition-transform hover:scale-105`}>
        {!imgError ? (
          <img
            src="/tshirt-baba-logo.png"
            alt="T-SHIRTbaba Mascot"
            className="w-full h-full object-contain filter drop-shadow-md"
            onError={() => setImgError(true)}
          />
        ) : (
          /* High quality Vector Yogi Mascot Fallback */
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Aura */}
            <circle cx="50" cy="50" r="44" fill="#FFEDD5" stroke="#F97316" strokeWidth="2" strokeDasharray="3 3" />
            
            {/* Turban / Pagri */}
            <path d="M30 38 C30 20, 70 20, 70 38 C75 32, 75 22, 60 16 C40 16, 25 24, 30 38 Z" fill="#EA580C" />
            <ellipse cx="50" cy="30" rx="18" ry="10" fill="#F97316" />
            <circle cx="50" cy="24" r="4" fill="#FEF08A" />

            {/* Face */}
            <ellipse cx="50" cy="45" rx="14" ry="13" fill="#FDBA74" />
            <circle cx="44" cy="42" r="1.8" fill="#1E293B" />
            <circle cx="56" cy="42" r="1.8" fill="#1E293B" />
            <path d="M47 48 Q50 51 53 48" stroke="#7C2D12" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="38" r="2" fill="#DC2626" /> {/* Tilak */}

            {/* White/Grey Beard */}
            <path d="M38 48 C36 64, 46 72, 50 72 C54 72, 64 64, 62 48 Z" fill="#F8FAFC" stroke="#E2E8F0" />
            <path d="M43 49 C47 54, 53 54, 57 49" stroke="#E2E8F0" strokeWidth="1.5" fill="none" />

            {/* Meditating Body / Robe */}
            <path d="M26 84 C26 70, 36 64, 50 64 C64 64, 74 70, 74 84 C70 88, 30 88, 26 84 Z" fill="#EA580C" />
            
            {/* Lotus Legs */}
            <ellipse cx="50" cy="84" rx="28" ry="7" fill="#C2410C" />

            {/* Hands in blessing / catch pose */}
            <ellipse cx="28" cy="62" rx="4" ry="5" fill="#FDBA74" />
            <ellipse cx="72" cy="62" rx="4" ry="5" fill="#FDBA74" />
          </svg>
        )}
      </div>

      {/* Brand Name Typography: T-SHIRTbaba */}
      {showText && (
        <div className="flex flex-col items-center mt-1">
          <div className="flex items-center tracking-tight">
            <span className="font-baba-title font-black text-[#5C1D0D] tracking-wider text-xl uppercase">
              T-SHIRT
            </span>
            <span className="font-baba-title font-bold text-[#EA580C] text-xl lowercase ml-0.5">
              baba
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
