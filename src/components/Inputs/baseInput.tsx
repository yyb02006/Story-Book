'use client'

import { cls } from '#/libs/client/utils'
import { ChangeEvent, InputHTMLAttributes } from 'react'

interface InputProps {
  name: string
  className?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const BaseInput = ({
  name,
  className = '',
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const baseInputStyles = 'w-full placeholder:pl-1 focus:ring-0 font-S-CoreDream-400'

  return (
    <input
      name={name}
      spellCheck={false}
      className={cls(baseInputStyles, className)}
      // size={20} default
      {...rest}
    />
  )
}

export default BaseInput
