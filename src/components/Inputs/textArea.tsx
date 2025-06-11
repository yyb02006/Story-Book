'use client'

import { cls } from '#/libs/client/utils'
import { TextareaHTMLAttributes } from 'react'

interface TextAreaProps {
  name: string
  className?: string
}

export default function TextArea({
  name,
  className = '',
  ...rest
}: TextAreaProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      name={name}
      spellCheck="false"
      className={cls(
        className,
        'block w-full resize-none border border-[#606060] bg-[#101010] placeholder:text-[#bababa] focus:ring-0',
      )}
      {...rest}
    />
  )
}
