/* eslint-disable tailwindcss/no-custom-classname */

import { CSSProperties } from 'react'

type StrokeColor = `#${string}`
type StrokeWidth = number

const getStyleObject = (
  strokeColor?: StrokeColor,
  strokeWidth?: StrokeWidth,
): CSSProperties | undefined => ({
  fill: 'none',
  stroke: strokeColor,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: strokeWidth,
})

const createIconSVG = ({
  drawing,
  height,
  id,
  name,
  width,
}: {
  drawing: JSX.Element
  id: string
  name: string
  width: number
  height: number
}) => {
  return (
    <svg
      data-icon-name={name}
      data-style="line"
      data-icon_origin_id={id}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      id={name}
      className="icon line"
      width={width}
      height={height}
    >
      {drawing}
    </svg>
  )
}

interface IconProps {
  width: number
  height: number
  strokeColor?: StrokeColor
  strokeWidth?: StrokeWidth
}

export const Search = ({ width, height, strokeColor, strokeWidth }: IconProps) => {
  const styleObject = getStyleObject(strokeColor, strokeWidth)
  return createIconSVG({
    drawing: (
      <path
        style={styleObject}
        d="M18,10.5A7.5,7.5,0,1,1,10.5,3,7.5,7.5,0,0,1,18,10.5ZM21,21l-5.2-5.2"
        id="primary"
      ></path>
    ),
    id: '20597',
    name: 'search-alt',
    width,
    height,
  })
}

export const BookMark = ({ width, height, strokeColor, strokeWidth }: IconProps) => {
  const styleObject = getStyleObject(strokeColor, strokeWidth)
  return createIconSVG({
    drawing: (
      <path
        style={styleObject}
        d="M12,17,5,21V4A1,1,0,0,1,6,3H18a1,1,0,0,1,1,1V21Z"
        id="primary"
      ></path>
    ),
    id: '20376',
    name: 'bookmark',
    width,
    height,
  })
}

export const CreateMemo = ({ width, height, strokeColor, strokeWidth }: IconProps) => {
  const styleObject = getStyleObject(strokeColor, strokeWidth)
  return createIconSVG({
    drawing: (
      <>
        <path
          style={styleObject}
          d="M12,3H4A1,1,0,0,0,3,4V20a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V12"
          id="primary"
        ></path>
        <path
          style={styleObject}
          d="M19.44,8.22C17.53,10.41,14,10,14,10s-.39-4,1.53-6.18a3.49,3.49,0,0,1,.56-.53L18,4l.47-1.82A8.19,8.19,0,0,1,21,2S21.36,6,19.44,8.22ZM14,10l-2,2"
          data-name="primary"
          id="primary-2"
        ></path>
      </>
    ),
    id: '20395',
    name: 'create-note-alt',
    width,
    height,
  })
}

export const Calendar = ({ width, height, strokeColor, strokeWidth }: IconProps) => {
  const styleObject = getStyleObject(strokeColor, strokeWidth)
  return createIconSVG({
    drawing: (
      <>
        <polyline style={styleObject} points="12 13 12 15 15 15" id="primary"></polyline>
        <path
          style={styleObject}
          d="M20,21H4a1,1,0,0,1-1-1V9H21V20A1,1,0,0,1,20,21ZM21,5a1,1,0,0,0-1-1H4A1,1,0,0,0,3,5V9H21ZM16,3V6M8,3V6M9,17V13m6,0v4"
          data-name="primary"
          id="primary-2"
        ></path>
      </>
    ),
    id: '20420',
    name: 'date-calendar',
    width,
    height,
  })
}

export const Chat = ({ width, height, strokeColor, strokeWidth }: IconProps) => {
  const styleObject = getStyleObject(strokeColor, strokeWidth)
  return createIconSVG({
    drawing: (
      <>
        <path style={styleObject} d="M21,8V19a1,1,0,0,1-1,1H17" id="primary"></path>
        <path
          style={styleObject}
          d="M3,5V15a1,1,0,0,0,1,1H8l5,3V16h3a1,1,0,0,0,1-1V5a1,1,0,0,0-1-1H4A1,1,0,0,0,3,5ZM7,8h6M7,12h6"
          data-name="primary"
          id="primary-2"
        ></path>
      </>
    ),
    id: '16026',
    name: 'chat-left-4',
    width,
    height,
  })
}
