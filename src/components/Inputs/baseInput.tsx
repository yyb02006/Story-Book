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
  const themeStyles = {
    dark: 'border-midnight-gray bg-dark-gray',
    white: 'border-light-white bg-white',
    default: '',
  }

  const baseInputStyles =
    'w-full border placeholder:pl-1 placeholder:text-[#bababa] focus:ring-0 font-bold text-smooth-white'

  return (
    <input
      ref={ref}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      type={inputType}
      spellCheck={false}
      className={cls(className, baseInputStyles, themeStyles[themeMode])}
      value={value}
      // size={20} default
      {...rest}
    />
  )
}

const BaseInput = forwardRef<HTMLInputElement, InputProps>(BaseInputCallback)

export default BaseInput
