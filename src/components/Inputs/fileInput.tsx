import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, DragEvent, forwardRef, ForwardRefRenderFunction } from 'react'

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
  const labelClassName = label?.className || ''
  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
  }
  return (
    <div className="text-sm">
      {label && (
        <label
          htmlFor={label.id}
          className={labelClassName}
          onDragOver={handleDragOver}
          onDrop={onFileDrop}
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
