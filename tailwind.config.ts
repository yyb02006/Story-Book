import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const designTokens = {
  gnb: { Width: 80, waveWidth: 20 },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'patrick-hand': ['var(--font-patrick-hand)'],
        pretendard: ['Pretendard-Regular', 'sans-serif'],
        'S-CoreDream-200': ['S-CoreDream-200', 'sans-serif'],
        'S-CoreDream-400': ['S-CoreDream-400', 'sans-serif'],
        'S-CoreDream-500': ['S-CoreDream-500', 'sans-serif'],
        'S-CoreDream-700': ['S-CoreDream-700', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      width: {
        gnb: `${designTokens.gnb.Width}px`,
      },
      padding: {
        'gnb-left': `${designTokens.gnb.Width + designTokens.gnb.waveWidth}px`,
      },
      colors: {
        'smooth-white': '#eaeaea',
        'smooth-black': '#101010',
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.universe-box-shadow': {
          boxShadow:
            '1000px 2000px white, 1500px 3000px white, 2500px 1000px white, 3500px 1500px white, 2000px 2500px white, 4500px 3500px white',
        },
      }
      addUtilities(newUtilities)
    }),
  ],
}
export default config
