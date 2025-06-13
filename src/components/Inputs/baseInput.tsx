'use client'

import { cls } from '#/libs/client/utils'
import { InputHTMLAttributes } from 'react'

interface InputProps {
  name: string
  className?: string
}

const BaseInput = ({
  name,
  className = '',
  ...rest
}: InputProps & InputHTMLAttributes<HTMLInputElement>) => {
  const baseInputStyles = 'w-full placeholder:pl-1 text-smooth-white font-S-CoreDream-400'

  return (
    <input
      name={name}
      spellCheck={false}
      className={cls(className, baseInputStyles)}
      // size={20} default
      {...rest}
    />
  )
}

export default BaseInput
