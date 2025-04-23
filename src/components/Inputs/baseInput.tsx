import { themeColorStyles } from '#/libs/client/constants'
import { cls } from '#/libs/client/utils'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

type InputValueType = string | number

interface InputProps {
  name: string
  inputType: 'text' | 'number'
  themeMode: ThemeMode
  className?: string
  value?: InputValueType
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const BaseInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, placeholder, onChange, value, inputType, className = '', themeMode, ...rest }: InputProps,
  ref,
) => {
  const { border, placeHolder, text } = themeColorStyles
  const baseInputStyles = cls(
    'w-full border placeholder:pl-1 focus:ring-0 font-S-CoreDream-400',
    border[themeMode],
    placeHolder[themeMode],
    text[themeMode],
  )

  return (
    <input
      ref={ref}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      type={inputType}
      spellCheck={false}
      className={cls(className, baseInputStyles)}
      value={value}
      // size={20} default
      {...rest}
    />
  )
}

const BaseInput = forwardRef<HTMLInputElement, InputProps>(BaseInputCallback)

export default BaseInput
