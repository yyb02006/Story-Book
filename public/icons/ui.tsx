import { SVGProps } from 'react'

interface IconSvgProps extends SVGProps<SVGSVGElement> {
  icon_origin_id: string
}

const getCustomIcons: IconSvgProps = ({ icon_origin_id, ...props }) => (
  <svg
    data-icon-name="search-alt"
    data-style="line"
    data-icon_origin_id="20597"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    id="search-alt"
    class="icon line"
    width="48"
    height="48"
  >
    <path
      style={{ fill: 'none', stroke: 'rgb(0, 0, 0)' }}
      d="M18,10.5A7.5,7.5,0,1,1,10.5,3,7.5,7.5,0,0,1,18,10.5ZM21,21l-5.2-5.2"
      id="primary"
    ></path>
  </svg>
)
