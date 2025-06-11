'use client'

import { cls } from '#/libs/client/utils'
import { InputHTMLAttributes } from 'react'

interface RadioInputProps {
  name: string
  className?: string
  peerClassName?: string
  labelName?: string
}

export default function RadioInput({
  name,
  className = '',
  peerClassName = '',
  labelName,
  ...rest
}: RadioInputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block h-full cursor-pointer">
      <input type="radio" name={name} className={cls(className, 'peer hidden')} {...rest} />
      <div
        className={cls(
          peerClassName,
          'peer-checked:bg-palettered flex h-full items-center justify-center text-[#bababa]',
        )}
      >
        {labelName}
      </div>
    </label>
  )
}
