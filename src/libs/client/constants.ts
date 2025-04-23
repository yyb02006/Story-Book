export const globalNavWaves = {
  colors: ['rgba(81, 106, 252, 0.8)', 'rgba(118, 170, 223, 0.3)', 'rgba(236, 240, 241, 0.3)'],
  width: 20,
  pointCountEachWave: 60,
  speed: 0.05,
} as const

export const themeColorStyles = {
  border: {
    dark: 'border-midnight-gray bg-dark-gray',
    white: 'border-white-gray bg-[#bababa]',
    default: '',
  },
  placeHolder: {
    dark: 'placeholder:text-light-gray',
    white: 'placeholder:text-midnight-gray',
    default: '',
  },
  placeHolderText: {
    dark: 'text-light-gray',
    white: 'text-midnight-gray',
    default: '',
  },
  text: {
    dark: ' text-smooth-white',
    white: ' text-smooth-black',
    default: '',
  },
} as const
