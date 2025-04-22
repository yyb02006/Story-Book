import BaseInput from '#/components/Inputs/baseInput'
import { parseInputValue } from '#/libs/client/utils'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

interface NumberInputProps {
  name: string
  value: number | undefined
  themeMode: ThemeMode
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
    themeMode,
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
      themeMode={themeMode}
      {...rest}
    />
  )
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(NumberInputCallback)

export default NumberInput
