import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { cls } from '#/libs/client/utils'

interface ModalProps {
  onClose: () => void
  title: string
  closeOnClickOutside: boolean
  children: JSX.Element
}

export default function Modal({ onClose, title, closeOnClickOutside, children }: ModalProps) {
  const onCloseClick = () => {
    onClose()
  }
  return (
    <div
      className={cls(
        closeOnClickOutside ? 'cursor-pointer' : '',
        'font-S-CoreDream-500 fixed top-0 left-0 z-[1000] flex h-screen w-screen flex-col items-center justify-center bg-black/40 pb-10',
      )}
      onClick={() => {
        if (closeOnClickOutside) {
          onCloseClick()
        }
      }}
    >
      {title.length > 0 ? (
        <div
          className="bg-midnight-gray cursor-default space-y-4 rounded-md p-3"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          <div className="flex min-w-full items-center justify-between gap-x-6">
            <span>{title}</span>
            <button onClick={onCloseClick} className="">
              <ToolbarIcon
                size="size-[24px]"
                svgId="cancel"
                className="dark:text-dark-disabled-icon text-light-disabled-icon hover:text-bright-blue"
              />
            </button>
          </div>
          <div>{children}</div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md">{children}</div>
      )}
    </div>
  )
}
