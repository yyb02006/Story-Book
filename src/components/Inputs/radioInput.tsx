import { cls } from '#/libs/client/utils'
import { ChangeEvent } from 'react'

interface InputProps {
  name: string
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void
  value?: string | undefined
  radioId?: string
  className?: string
  peerClassName?: string
  labelName?: string
  radioDisabled?: boolean
}

export default function RadioInput({
  name,
  onChange,
  value,
  radioId,
  className = '',
  peerClassName = '',
  labelName,
  radioDisabled,
  ...rest
}: InputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value, event)
  }
  return (
    <label className="block h-full cursor-pointer">
      <input
        onChange={handleChange}
        type="radio"
        id={radioId}
        name={name}
        value={value}
        disabled={radioDisabled}
        className={cls(className, 'peer hidden')}
        {...rest}
      />
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
