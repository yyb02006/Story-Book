'use client'

import BaseInput from '#/components/Inputs/baseInput'
import { useState } from 'react'

type AllowedInputType = 'text' | 'email'

interface FormInputProps {
  id: string
  name: string
  type: AllowedInputType
  placeholder?: string
  className?: string
}

export default function FormInput({ id, name, placeholder, className, type }: FormInputProps) {
  const [value, setValue] = useState('')
  return (
    <BaseInput
      inputType={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(event) => {
        setValue(event.target.value)
      }}
      className={className}
    />
  )
}
