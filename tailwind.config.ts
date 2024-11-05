import plugin from 'tailwindcss/plugin'
import type { Config } from 'tailwindcss'

const designTokens = {
  gnb: { Width: '100px' },
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { 'patrick-hand': ['var(--font-patrick-hand)'] },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      width: {
        gnb: designTokens.gnb.Width,
      },
      padding: {
        'gnb-left': designTokens.gnb.Width,
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
