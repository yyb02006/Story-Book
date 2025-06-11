'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { parseInputValue } from '#/libs/client/utils'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface NumberInputProps {
  name: string
  value: number | undefined
  onChange?: (value: number | undefined, event: ChangeEvent<HTMLInputElement>) => void
}

const NumberInput = ({
  name,
  onChange,
  value,
  ...rest
}: NumberInputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseInputValue<number | undefined>(event.target.value, value), event)
  }
  return <BaseInput onChange={handleChange} name={name} value={value} type="number" {...rest} />
}

export default NumberInput
