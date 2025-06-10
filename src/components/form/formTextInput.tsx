'use client'

import { TextInput } from '#/components/Inputs'
import { useState } from 'react'

interface FormTextInputProps {
  id: string
  name: string
  placeholder?: string
  className?: string
}

export default function FormTextInput({ id, name, placeholder, className }: FormTextInputProps) {
  const [value, setValue] = useState('')
  return (
    <TextInput
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(value) => {
        setValue(value)
      }}
      className={className}
    />
  )
}
