'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { parseInputValue } from '#/libs/client/utils'
import { ChangeEvent } from 'react'

interface NumberInputProps {
  name: string
  value: number | undefined
  className?: string
  placeholder?: string
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void
}

const NumberInput = ({
  name,
  placeholder = '숫자를 입력해주세요',
  onChange,
  value,
  className = '',
  ...rest
}: NumberInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseInputValue<number | undefined>(event.target.value, value), event)
  }
  return (
    <BaseInput
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

export default NumberInput
