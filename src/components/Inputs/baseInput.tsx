'use client'

import { cls } from '#/libs/client/utils'
import { ChangeEvent } from 'react'

type InputType = 'text' | 'number' | 'file' | 'email'

type InputValueType<T> = T extends 'number' ? number : string

interface InputProps<T extends InputType> {
  name: string
  inputType: T
  className?: string
  value?: InputValueType<T>
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  [key: string]: unknown
}

const BaseInput = <T extends InputType>({
  name,
  placeholder,
  onChange,
  value,
  inputType,
  className = '',
  ...rest
}: InputProps<T>) => {
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
