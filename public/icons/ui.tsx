/* eslint-disable tailwindcss/no-custom-classname */

type StrokeColor = `#${string}`

export const Search = ({
  width,
  height,
  strokeWidth = 2,
  strokeColor = '#eaeaea',
}: {
  width: `${number}`
  height: `${number}`
  strokeWidth?: number
  strokeColor?: StrokeColor
}) => (
  <svg
    data-icon-name="search-alt"
    data-style="line"
    data-icon_origin_id="20597"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="search-alt"
    className="icon line"
    width={width}
    height={height}
  >
    <path
      style={{
        fill: 'none',
        stroke: strokeColor,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: strokeWidth,
      }}
      d="M18,10.5A7.5,7.5,0,1,1,10.5,3,7.5,7.5,0,0,1,18,10.5ZM21,21l-5.2-5.2"
      id="primary"
    ></path>
  </svg>
)
