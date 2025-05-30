import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'

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
      className="font-S-CoreDream-500 fixed top-0 left-0 flex h-screen w-screen flex-col items-center justify-center bg-black/40 pb-10"
      onClick={() => {
        if (closeOnClickOutside) {
          onCloseClick()
        }
      }}
    >
      <div className="bg-midnight-gray space-y-4 rounded-md p-3">
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
    </div>
  )
}
