import { cls } from '#/libs/client/utils'
import { ChangeEvent, TextareaHTMLAttributes } from 'react'

interface InputProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  name: string
  placeholder?: string
  onChange?: (value: string, event: ChangeEvent<HTMLTextAreaElement>) => void
  value?: string | undefined
  rows?: number
  className?: string
}

export default function TextArea({
  name,
  placeholder = '내용을 입력해주세요',
  onChange,
  value,
  rows,
  className = '',
  ...rest
}: InputProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event.target.value, event)
  }
  return (
    <textarea
      onChange={handleChange}
      name={name}
      value={value}
      placeholder={placeholder}
      rows={rows}
      spellCheck="false"
      className={cls(
        className,
        'block w-full resize-none border border-[#606060] bg-[#101010] placeholder:text-[#bababa] focus:ring-0',
      )}
      {...rest}
    />
  )
}
