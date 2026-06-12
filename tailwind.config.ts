import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      colors: {
        gold: {
          50:  '#FEFAED',
          100: '#FCF0C4',
          200: '#F8DC84',
          300: '#F2C33A',
          400: '#C8920E',  // Rich antique gold
          500: '#A67500',
          600: '#8A6000',
          700: '#6D4C00',
          800: '#503800',
          900: '#342400',
        },
        navy: {
          50:  '#EDF2FA',
          100: '#C9D5F0',
          200: '#93ABE1',
          300: '#5D80D2',
          400: '#2756C3',
          500: '#163DA0',
          600: '#0F2D7E',
          700: '#081E5B',
          800: '#071228',  // Deep luxury navy
          900: '#040B18',  // Near-black
        },
        cream: {
          50:  '#FDFAF5',
          100: '#FAF4E8',
          200: '#F5E9CD',
          300: '#EDD8AA',
          400: '#E2C47E',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #A07500 0%, #E8C040 35%, #C8920E 65%, #E8C040 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #C8920E 0%, #A07500 100%)',
        'navy-gradient': 'linear-gradient(135deg, #040B18 0%, #071228 50%, #040B18 100%)',
      },
      boxShadow: {
        'gold-sm': '0 2px 8px -2px rgba(200,146,14,0.35)',
        'gold':    '0 8px 25px -5px rgba(200,146,14,0.45)',
        'gold-lg': '0 20px 50px -10px rgba(200,146,14,0.55)',
        'luxury':  '0 20px 60px -15px rgba(4,11,24,0.6)',
      },
      animation: {
        'shimmer':    'shimmer 4s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'fade-in':    'fadeIn 0.6s ease-out',
        'slide-up':   'slideUp 0.5s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px 0 rgba(200,146,14,0.3)' },
          '50%':      { boxShadow: '0 0 40px 8px rgba(200,146,14,0.55)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
