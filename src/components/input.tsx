import { cls } from '#/libs/client/utils'

interface InputProps {
  type: 'text' | 'number' | 'email' | 'textarea' | 'radio'
  name: string
  placeholder?: string
  onChange?:
    | ((e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void)
    | ((e: React.SyntheticEvent<HTMLInputElement>) => void)
  value?: string | undefined
  radioId?: string
  rows?: number
  css?: string
  labelCss?: string
  labelName?: string
  radioDisabled?: boolean
  [key: string]: unknown
}

export default function Input({
  type,
  name,
  placeholder,
  onChange,
  value,
  radioId,
  rows,
  css,
  labelCss,
  labelName,
  radioDisabled,
  ...rest
}: InputProps) {
  return (
    <>
      {type === 'text' ? (
        <input
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          type="text"
          spellCheck="false"
          className={cls(
            css ? css : '',
            'w-full border border-[#606060] bg-[#101010] placeholder:pl-1 placeholder:text-[#bababa] focus:ring-0',
          )}
          value={value ? value : ''}
          {...rest}
        />
      ) : null}
      {type === 'number' ? (
        <input
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          type="text"
          spellCheck="false"
          className={cls(
            css ? css : '',
            'w-full border border-[#606060] bg-[#101010] placeholder:text-[#bababa] focus:ring-0',
          )}
          value={value ? value : ''}
          {...rest}
        />
      ) : null}
      {type === 'email' ? (
        <input
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          type="text"
          spellCheck="false"
          className={cls(
            css ? css : '',
            'w-full border border-[#606060] bg-[#101010] placeholder:text-[#bababa] focus:ring-0',
          )}
          value={value ? value : ''}
          {...rest}
        />
      ) : null}
      {type === 'radio' ? (
        <label className="block h-full cursor-pointer">
          <input
            onChange={onChange}
            type="radio"
            id={radioId}
            name={name}
            value={value}
            disabled={radioDisabled}
            className={cls(css ? css : '', 'peer hidden')}
            {...rest}
          />
          <div
            className={cls(
              labelCss ? labelCss : '',
              'peer-checked:bg-palettered flex h-full items-center justify-center text-[#bababa]',
            )}
          >
            {labelName}
          </div>
        </label>
      ) : null}
      {type === 'textarea' ? (
        <textarea
          onChange={
            onChange as (e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void
          }
          name={name}
          value={value}
          placeholder={placeholder}
          rows={rows}
          spellCheck="false"
          className={cls(
            css ? css : '',
            'block w-full resize-none border border-[#606060] bg-[#101010] placeholder:text-[#bababa] focus:ring-0',
          )}
          {...rest}
        />
      ) : null}
    </>
  )
}
