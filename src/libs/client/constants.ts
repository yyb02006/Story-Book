export const globalNavWaves = {
  colors: ['rgba(81, 106, 252, 0.8)', 'rgba(118, 170, 223, 0.3)', 'rgba(236, 240, 241, 0.3)'],
  width: 20,
  pointCountEachWave: 60,
  speed: 0.05,
} as const

export const themeColorStyles = {
  dark: {
    border: 'border-midnight-gray',
    bgColor: 'bg-dark-gray',
    placeHolder: 'placeholder:text-light-gray',
    placeHolderText: 'text-light-gray',
    text: 'text-smooth-white',
  },
  white: {
    border: 'border-white-gray',
    bgColor: 'bg-[#bababa]',
    placeHolder: 'placeholder:text-midnight-gray',
    placeHolderText: 'text-midnight-gray',
    text: 'text-smooth-black',
  },
} as const
