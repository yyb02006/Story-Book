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
      className="fixed h-screen w-screen bg-black/40"
      onClick={() => {
        if (closeOnClickOutside) {
          onCloseClick()
        }
      }}
    >
      <div>
        <span>{title}</span>
        <button onClick={onCloseClick}>Close</button>
      </div>
      {children}
    </div>
  )
}
