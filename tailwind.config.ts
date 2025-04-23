import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const designTokens = {
  gnb: { Width: 80, waveWidth: 20 },
  gsb: { height: 88 },
  colors: {
    'smooth-white': '#eaeaea',
    'smooth-black': '#101010',
    'dark-gray': '#202020',
    'charcoal-gray': '#303030',
    'midnight-gray': '#404040',
    gray: '#505050',
    'white-gray': '#909090',
    'light-gray': '#bababa',
    'slate-blue': '#474e79',
    'bright-blue': '#516afc',
    'sky-blue': '#76aadf',
  },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/libs/client/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'patrick-hand': ['var(--font-patrick-hand)'],
        pretendard: ['Pretendard-Regular', 'sans-serif'],
        'S-CoreDream-100': ['S-CoreDream-100', 'sans-serif'],
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
        'gsb-top': `${designTokens.gsb.height}px`,
      },
      colors: designTokens.colors,
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
