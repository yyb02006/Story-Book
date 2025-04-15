import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

interface InputProps {
  name: string
  value: string | undefined
  className?: string
  placeholder?: string
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
}

const TextInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    name,
    placeholder = '텍스트를 입력해주세요',
    onChange,
    value,
    className = '',
    ...rest
  }: InputProps,
  ref,
) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value, event)
  }

  return (
    <BaseInput
      ref={ref}
      onChange={handleChange}
      name={name}
      placeholder={placeholder}
      inputType="text"
      className={className}
      value={value}
      {...rest}
    />
  )
}

const TextInput = forwardRef<HTMLInputElement, InputProps>(TextInputCallback)

export default TextInput
