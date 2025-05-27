import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

interface InputProps {
  name: string
  className?: string
  accept?: string
  label?: string
  onChange?: (files: FileList | null) => void
}

const FileInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, className, accept, label, onChange },
  ref,
): JSX.Element => {
  return (
    <div className="Input__wrapper">
      {label && <label className="Input__label">{label}</label>}
      <BaseInput
        ref={ref}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange?.(e.target.files)}
        name={name}
        inputType="file"
        className={className}
        accept={accept}
      />
    </div>
  )
}

const FileInput = forwardRef<HTMLInputElement, InputProps>(FileInputCallback)

export default FileInput
