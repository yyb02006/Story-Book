'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { InputHTMLAttributes, useState } from 'react'

interface FormInputProps {
  name: string
  errorMessages?: string[]
}

export default function FormInput({
  name,
  errorMessages,
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState('')
  return (
    <div>
      <BaseInput
        name={name}
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
        }}
        {...rest}
      />
      {errorMessages && (
        <div className="mt-1 space-y-1 text-xs">
          {errorMessages.map((message, idx) => (
            <div className="text-amber-400" key={idx}>
              {message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
