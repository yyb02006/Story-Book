import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  name: string
  className?: string
  value: string | undefined
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
