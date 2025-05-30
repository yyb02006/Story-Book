import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

interface InputProps {
  name: string
  className?: string
  accept?: string
  label?: { children: JSX.Element; id: string; className?: string }
  onChange?: (files: FileList | null) => void
}

const FileInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, className, accept, label, onChange },
  ref,
): JSX.Element => {
  const labelClassName = label?.className || ''
  return (
    <div className="text-sm">
      {label && (
        <label htmlFor={label.id} className={labelClassName}>
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
