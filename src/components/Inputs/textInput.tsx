'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface InputProps {
  name: string
  value?: string
  className?: string
  placeholder?: string
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  [key: string]: unknown
}

const TextInput = ({
  name,
  placeholder = '텍스트를 입력해주세요',
  onChange,
  value,
  className = '',
  ...rest
}: InputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value, event)
  }

  return (
    <BaseInput
      onChange={handleChange}
      name={name}
      placeholder={placeholder}
      type="text"
      className={className}
      value={value}
      {...rest}
    />
  )
}

export default TextInput
