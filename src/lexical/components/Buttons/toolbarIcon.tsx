import { cls } from '#/libs/client/utils'

interface ToolbarIcon<T> {
  svgId: T
  className: string
  size: `size-[${number}px]`
}

export default function ToolbarIcon<T>({ svgId, className, size }: ToolbarIcon<T>) {
  return (
    <svg className={cls(size, className)}>
      <use href={`/icons/toolbarButtons.svg#${svgId}`} />
    </svg>
  )
}
