import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  name: string
  className?: string
  value: number | undefined
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void
}

const NumberInputCallback: ForwardRefRenderFunction<HTMLInputElement, NumberInputProps> = (
  {
    name,
    placeholder = '숫자를 입력해주세요',
    onChange,
    value,
    className = '',
    ...rest
  }: NumberInputProps,
  ref,
) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return
    const newValue = parseFloat(event.target.value)
    if (isNaN(newValue)) {
      onChange(value, event)
    } else {
      onChange(newValue, event)
    }
  }
  return (
    <BaseInput
      ref={ref}
      onChange={handleChange}
      name={name}
      placeholder={placeholder}
      inputType="number"
      className={className}
      value={value}
      {...rest}
    />
  )
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(NumberInputCallback)

export default NumberInput
