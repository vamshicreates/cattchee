import React from 'react';

export type TShirtColor =
  | 'red'
  | 'blue'
  | 'green'
  | 'pink'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'cyan'
  | 'black'
  | 'white'
  | 'golden'
  | 'rainbow';

export interface TShirtData {
  id: string;
  color: TShirtColor;
  isSpecial?: 'golden' | 'rainbow' | 'danger';
  points: number;
  lane: number; // 0, 1, 2
  y: number; // percentage down the screen (0 to 100)
  speed: number;
  scale?: number;
  popped?: boolean;
}

export const COLOR_CONFIG: Record<
  TShirtColor,
  { label: string; hex: string; darkHex: string; accent: string; emoji: string }
> = {
  red: { label: 'RED', hex: '#EF4444', darkHex: '#DC2626', accent: '#F87171', emoji: '🔴' },
  blue: { label: 'BLUE', hex: '#2563EB', darkHex: '#1D4ED8', accent: '#60A5FA', emoji: '🔵' },
  green: { label: 'GREEN', hex: '#10B981', darkHex: '#059669', accent: '#34D399', emoji: '🟢' },
  pink: { label: 'PINK', hex: '#EC4899', darkHex: '#DB2777', accent: '#F472B6', emoji: '🌸' },
  yellow: { label: 'YELLOW', hex: '#FACC15', darkHex: '#EAB308', accent: '#FEF08A', emoji: '🟡' },
  orange: { label: 'ORANGE', hex: '#F97316', darkHex: '#EA580C', accent: '#FB923C', emoji: '🟠' },
  purple: { label: 'PURPLE', hex: '#8B5CF6', darkHex: '#7C3AED', accent: '#A78BFA', emoji: '🟣' },
  cyan: { label: 'CYAN', hex: '#06B6D4', darkHex: '#0891B2', accent: '#22D3EE', emoji: '🩵' },
  black: { label: 'BLACK', hex: '#1E293B', darkHex: '#0F172A', accent: '#334155', emoji: '⚫' },
  white: { label: 'WHITE', hex: '#F8FAFC', darkHex: '#E2E8F0', accent: '#FFFFFF', emoji: '⚪' },
  golden: { label: 'GOLDEN BABA', hex: '#F59E0B', darkHex: '#D97706', accent: '#FDE047', emoji: '👑' },
  rainbow: { label: 'RAINBOW', hex: '#A855F7', darkHex: '#7E22CE', accent: '#F43F5E', emoji: '🌈' },
};

interface TShirtProps {
  color: TShirtColor;
  isSpecial?: 'golden' | 'rainbow' | 'danger';
  size?: number;
  className?: string;
  onClick?: () => void;
}

export const TShirtSVG: React.FC<TShirtProps> = ({
  color,
  isSpecial,
  size = 80,
  className = '',
  onClick,
}) => {
  const conf = COLOR_CONFIG[color] || COLOR_CONFIG.blue;
  const isRainbow = isSpecial === 'rainbow' || color === 'rainbow';
  const isGold = isSpecial === 'golden' || color === 'golden';
  const isDanger = isSpecial === 'danger';

  // SVG gradient ID uniqueness
  const gradId = `tee-grad-${color}-${Math.random().toString(36).substr(2, 5)}`;

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size * 1.05 }}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-transform select-none ${className}`}
    >
      <svg
        viewBox="0 0 100 95"
        className="w-full h-full drop-shadow-md hover:drop-shadow-xl transition-all"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {isRainbow ? (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="75%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          ) : isGold ? (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF176" />
              <stop offset="50%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#FFA000" />
            </linearGradient>
          ) : (
            <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={conf.accent} />
              <stop offset="60%" stopColor={conf.hex} />
              <stop offset="100%" stopColor={conf.darkHex} />
            </linearGradient>
          )}

          {/* Shading overlay */}
          <linearGradient id={`shadow-${gradId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
            <stop offset="15%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="85%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
          </linearGradient>
        </defs>

        {/* T-Shirt Body & Sleeves (Realistic Vector) */}
        <path
          d="M33 13 C38 18, 62 18, 67 13 L86 26 C90 28, 91 35, 87 39 L78 51 C75 54, 70 53, 68 49 L66 45 L67 85 C67 89, 64 91, 60 91 L40 91 C36 91, 33 89, 33 85 L34 45 L32 49 C30 53, 25 54, 22 51 L13 39 C9 35, 10 28, 14 26 Z"
          fill={`url(#${gradId})`}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Body Shading & highlights */}
        <path
          d="M33 13 C38 18, 62 18, 67 13 L86 26 C90 28, 91 35, 87 39 L78 51 C75 54, 70 53, 68 49 L66 45 L67 85 C67 89, 64 91, 60 91 L40 91 C36 91, 33 89, 33 85 L34 45 L32 49 C30 53, 25 54, 22 51 L13 39 C9 35, 10 28, 14 26 Z"
          fill={`url(#shadow-${gradId})`}
        />

        {/* Collar Ribbing */}
        <path
          d="M34 13 C39 22, 61 22, 66 13 C61 17, 39 17, 34 13 Z"
          fill={conf.darkHex}
          stroke="rgba(0,0,0,0.2)"
          strokeWidth="0.8"
        />

        {/* Sleeve Hem lines */}
        <path d="M16 36 L24 47" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M84 36 L76 47" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Bottom Hem line */}
        <path d="M34 87 L66 87" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" strokeLinecap="round" />

        {/* Special Chest Badge */}
        {isGold && (
          <g transform="translate(42, 34) scale(0.7)">
            <path
              d="M1 18 L4 5 L11 12 L17 2 L23 12 L30 5 L33 18 Z"
              fill="#FFFFFF"
              stroke="#B45309"
              strokeWidth="1.5"
            />
            <circle cx="17" cy="23" r="2.5" fill="#FFFFFF" />
          </g>
        )}

        {isRainbow && (
          <g transform="translate(41, 36) scale(0.65)">
            <circle cx="14" cy="14" r="12" fill="rgba(255,255,255,0.85)" />
            <path
              d="M7 17 C7 10, 21 10, 21 17"
              stroke="#EC4899"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M9 17 C9 12, 19 12, 19 17"
              stroke="#EAB308"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M11 17 C11 14, 17 14, 17 17"
              stroke="#06B6D4"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        )}

        {isDanger && (
          <g transform="translate(40, 36) scale(0.7)">
            <path
              d="M12 2 L2 22 L22 22 Z"
              fill="#EF4444"
              stroke="#991B1B"
              strokeWidth="2"
            />
            <text x="12" y="19" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">
              !
            </text>
          </g>
        )}

        {/* Subtle cute print for regular tees */}
        {!isGold && !isRainbow && !isDanger && (
          <g opacity="0.35" transform="translate(45, 42)">
            <circle cx="5" cy="5" r="4" fill="#FFFFFF" />
            <path d="M2 13 C2 10, 8 10, 8 13" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
