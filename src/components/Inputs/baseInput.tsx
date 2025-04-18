import { cls } from '#/libs/client/utils'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction } from 'react'

type InputValueType = string | number

interface InputProps {
  name: string
  inputType: 'text' | 'number'
  className?: string
  value?: InputValueType
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const BaseInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, placeholder, onChange, value, inputType, className = '', ...rest }: InputProps,
  ref,
) => {
  const baseInputClasses =
    'w-full border border-[#606060] bg-[#101010] placeholder:pl-1 placeholder:text-[#bababa] focus:ring-0 font-bold text-smooth-white placeholder:pl-1'

  return (
    <input
      ref={ref}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      type={inputType}
      spellCheck={false}
      className={cls(className, baseInputClasses)}
      value={value}
      // size={20} default
      {...rest}
    />
  )
}

const BaseInput = forwardRef<HTMLInputElement, InputProps>(BaseInputCallback)

export default BaseInput
