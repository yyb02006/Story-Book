'use client'

import { cls } from '#/libs/client/utils'
import { useFormStatus } from 'react-dom'

interface FormButtonProps {
  title: string
  className?: string
}

export default function FormButton({ title, className = '' }: FormButtonProps) {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className={cls(
        pending ? 'bg-midnight-gray' : 'bg-bright-blue',
        'font-S-CoreDream-500',
        className,
      )}
    >
      {pending ? 'wait...' : title}
    </button>
  )
}
