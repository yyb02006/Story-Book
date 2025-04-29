import BaseInput from '#/components/Inputs/baseInput'
import { parseInputValue } from '#/libs/client/utils'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

interface NumberInputProps {
  name: string
  value: number | undefined
  className?: string
  placeholder?: string
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
    onChange?.(parseInputValue<number | undefined>(event.target.value, value), event)
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
