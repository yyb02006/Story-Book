import BaseInput from '#/components/Inputs/baseInput'
import { cls } from '#/libs/client/utils'
import { ChangeEvent, DragEvent, forwardRef, ForwardRefRenderFunction, useState } from 'react'

interface InputProps {
  name: string
  className?: string
  accept?: string
  label?: { children: JSX.Element; id: string; className?: string }
  onChange?: (files: FileList | null) => void
  onFileDrop: (event: DragEvent<HTMLLabelElement>) => void
}

const FileInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, className, accept, label, onChange, onFileDrop },
  ref,
): JSX.Element => {
  const [isMouseOverWithFile, setIsMouseOverWithFile] = useState(false)
  const labelClassName = label?.className || ''
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const items = Array.from(event.dataTransfer.items)
    const hasImage = items.some((item) => item.kind === 'file' && item.type.startsWith('image/'))

    if (hasImage && !isMouseOverWithFile) {
      setIsMouseOverWithFile(true)
    }
  }
  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    if (isMouseOverWithFile) {
      setIsMouseOverWithFile(false)
    }
  }
  return (
    <div className="text-sm">
      {label && (
        <label
          htmlFor={label.id}
          className={cls(
            'bg-charcoal-gray hover:text-bright-blue flex cursor-pointer items-center justify-center rounded-md py-12 text-sm hover:ring-2',
            isMouseOverWithFile
              ? 'text-bright-blue ring-bright-blue ring-2'
              : 'dark:text-dark-disabled-icon text-light-disabled-icon',
            labelClassName,
          )}
          onDragOver={handleDragOver}
          onDrop={onFileDrop}
          onDragLeave={handleDragLeave}
        >
          {label.children}
        </label>
      )}
      <BaseInput
        id={label?.id}
        ref={ref}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.files)}
        name={name}
        inputType="file"
        className={className}
        accept={accept}
        multiple={true}
      />
    </div>
  )
}

const FileInput = forwardRef<HTMLInputElement, InputProps>(FileInputCallback)

export default FileInput
