import { getHsvWithoutAlpha, tinycolor } from '#/lexical/plugins/utils'

export const basicColorGroups = [
  [
    { utilityClass: 'bg-[#eaeaea]', colorHex: '#eaeaea' },
    { utilityClass: 'bg-[#bbbbbb]', colorHex: '#bbbbbb' },
  ],
  [
    { utilityClass: 'bg-[#E53935]', colorHex: '#E53935' },
    { utilityClass: 'bg-[#FF6F61]', colorHex: '#FF6F61' },
    { utilityClass: 'bg-[#FB8C00]', colorHex: '#FB8C00' },
    { utilityClass: 'bg-[#FDD835]', colorHex: '#FDD835' },
  ],
  [
    { utilityClass: 'bg-[#2543f0]', colorHex: '#2543f0' },
    { utilityClass: 'bg-[#3F51B5]', colorHex: '#3F51B5' },
    { utilityClass: 'bg-[#1E88E5]', colorHex: '#1E88E5' },
    { utilityClass: 'bg-[#81D4FA]', colorHex: '#81D4FA' },
  ],
  [
    { utilityClass: 'bg-[#555555]', colorHex: '#555555' },
    { utilityClass: 'bg-[#101010]', colorHex: '#101010' },
  ],
  [
    { utilityClass: 'bg-[#1fc027]', colorHex: '#1fc027' },
    { utilityClass: 'bg-[#288f00]', colorHex: '#288f00' },
    { utilityClass: 'bg-[#7ceb82]', colorHex: '#7ceb82' },
    { utilityClass: 'bg-[#42dfb0]', colorHex: '#42dfb0' },
  ],
  [
    { utilityClass: 'bg-[#7e5548]', colorHex: '#7e5548' },
    { utilityClass: 'bg-[#8E24AA]', colorHex: '#8E24AA' },
    { utilityClass: 'bg-[#9e1442]', colorHex: '#9e1442' },
    { utilityClass: 'bg-[#6919ff]', colorHex: '#6919ff' },
  ],
]

export const initialFontColor = {
  dark: {
    text: { hex: '#ffffff', hsv: { h: 0, s: 0, v: 1 } },
    quote: { hex: '#909090', hsv: getHsvWithoutAlpha(tinycolor('#909090').toHsv()) },
  },
  light: {
    text: { hex: '#000000', hsv: { h: 0, s: 0, v: 0 } },
    quote: { hex: '#505050', hsv: getHsvWithoutAlpha(tinycolor('#505050').toHsv()) },
  },
}
