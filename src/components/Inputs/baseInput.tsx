'use client'

import { cls } from '#/libs/client/utils'
import { ChangeEvent } from 'react'

type InputValueType = string | number

interface InputProps {
  name: string
  inputType: 'text' | 'number' | 'file'
  className?: string
  value?: InputValueType
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  [key: string]: unknown
}

const BaseInput = ({
  name,
  placeholder,
  onChange,
  value,
  inputType,
  className = '',
  ...rest
}: InputProps) => {
  const baseInputStyles = 'w-full placeholder:pl-1 focus:ring-0 font-S-CoreDream-400'

  return (
    <input
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      type={inputType}
      spellCheck={false}
      className={cls(baseInputStyles, className)}
      value={value}
      // size={20} default
      {...rest}
    />
  )
}

export default BaseInput
