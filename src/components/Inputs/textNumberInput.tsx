import { cls } from '#/libs/client/utils'
import { ChangeEvent, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from 'react'

type InputValueType = string | number

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'name'> {
  name: string
  isNumber?: boolean
  className?: string
  value: InputValueType | undefined
  onChange?: (value: InputValueType | undefined, event: ChangeEvent<HTMLInputElement>) => void
}

const TextNumberInputCallback: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  {
    name,
    placeholder = '입력해주세요',
    onChange,
    value,
    className = '',
    isNumber = false,
    ...rest
  }: InputProps,
  ref,
) => {
  const baseInputClasses =
    'w-full border border-[#606060] bg-[#101010] placeholder:pl-1 placeholder:text-[#bababa] focus:ring-0 font-bold text-smooth-white placeholder:pl-1'
  const inputValueType: InputValueType = isNumber ? 'number' : 'text'
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue: InputValueType | undefined = event.target.value
    if (isNumber && newValue !== undefined) {
      newValue = parseFloat(newValue)
      if (isNaN(newValue)) {
        newValue = value
      }
    }
    if (!onChange) return
    onChange(newValue, event)
  }

  return (
    <input
      ref={ref}
      onChange={handleChange}
      name={name}
      placeholder={placeholder}
      type={inputValueType}
      spellCheck={false}
      className={cls(className, baseInputClasses)}
      value={value}
      // size={20} default
      {...rest}
    />
  )
}

const TextNumberInput = forwardRef<HTMLInputElement, InputProps>(TextNumberInputCallback)

export default TextNumberInput
