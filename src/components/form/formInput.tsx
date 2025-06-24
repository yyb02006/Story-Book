'use client'

import { ValidationResult } from '#/app/(auth)/signup/actions'
import BaseInput from '#/components/Inputs/baseInput'
import { cls, removeSpaces } from '#/libs/client/utils'
import {
  ChangeEvent,
  Dispatch,
  InputHTMLAttributes,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from 'react'

interface FormInputProps {
  name: string
  errorMessages?: string[]
  trim?: boolean
  initialValue?: string
  checkAvailability?: {
    buttonName: { active: string; inActive: string }
    check: (value: string) => Promise<ValidationResult<string, 'flattenError'>>
    state: boolean
    setState: Dispatch<SetStateAction<boolean>>
  }
  className?: string
}

const AVAILABILITY_ACTION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  RESET: 'reset',
} as const

type AvailabilityState = { messages: string[]; isAvailable: boolean }

// Discriminated Unions 타입
type AvailabilityAction =
  | { type: typeof AVAILABILITY_ACTION_TYPES.SUCCESS }
  | { type: typeof AVAILABILITY_ACTION_TYPES.ERROR; messages: string[] }
  | { type: typeof AVAILABILITY_ACTION_TYPES.RESET }

const availabilityReducer = (
  state: AvailabilityState,
  action: AvailabilityAction,
): AvailabilityState => {
  switch (action.type) {
    case AVAILABILITY_ACTION_TYPES.SUCCESS:
      return { messages: ['사용가능한 아이디입니다.'], isAvailable: true }
    case AVAILABILITY_ACTION_TYPES.ERROR:
      return { messages: action.messages, isAvailable: false }
    case AVAILABILITY_ACTION_TYPES.RESET:
      return { messages: [], isAvailable: false }
    default:
      throw new Error('Unknown action type')
  }
}

const initialAvailabilityState = {
  messages: [],
  isAvailable: false,
}

export default function FormInput({
  name,
  errorMessages,
  trim = false,
  initialValue = '',
  checkAvailability,
  className = '',
  ...rest
}: FormInputProps & InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState(initialValue)
  const [{ isAvailable, messages }, dispatch] = useReducer(
    availabilityReducer,
    initialAvailabilityState,
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (rest.readOnly) return
    let formattedValue = trim ? removeSpaces(event.target.value) : event.target.value
    if (rest.type === 'email') {
      formattedValue = formattedValue.toLowerCase()
    }
    if (checkAvailability && checkAvailability.state) {
      checkAvailability.setState(false)
    }
    dispatch({ type: AVAILABILITY_ACTION_TYPES.RESET })
    setValue(formattedValue)
  }

  const handleAvailabilityClick = async () => {
    if (!checkAvailability) return
    const result = await checkAvailability.check(value)
    checkAvailability.setState(result.success)
    if (result.success) {
      dispatch({ type: AVAILABILITY_ACTION_TYPES.SUCCESS })
    } else {
      if (!result.error?.formErrors) return
      dispatch({ type: AVAILABILITY_ACTION_TYPES.ERROR, messages: result.error.formErrors })
    }
  }

  useEffect(() => {
    if (errorMessages) {
      dispatch({ type: AVAILABILITY_ACTION_TYPES.ERROR, messages: errorMessages })
    }
  }, [errorMessages])

  return (
    <div className="w-full">
      <div className="flex space-x-3">
        <BaseInput
          name={name}
          value={value}
          onChange={handleChange}
          className={cls(
            rest.readOnly ? '' : 'focus:ring-bright-blue! focus:ring-2!',
            'bg-dark-gray autofill:bg-dark-gray! h-12 rounded-lg px-3 placeholder:text-sm',
            className,
          )}
          {...rest}
        />
        {checkAvailability && (
          <button
            type="button"
            onClick={handleAvailabilityClick}
            disabled={checkAvailability.state}
            className={cls(
              checkAvailability.state ? 'bg-amber-500' : 'bg-bright-blue',
              'font-S-CoreDream-400 top-0 rounded-lg px-3 text-sm text-nowrap',
            )}
          >
            {checkAvailability.state
              ? checkAvailability.buttonName.inActive
              : checkAvailability.buttonName.active}
          </button>
        )}
      </div>
      {messages.length > 0 && (
        <div
          className={cls(
            isAvailable ? 'text-bright-blue' : 'text-amber-400',
            'mt-1 space-y-1 text-xs',
          )}
        >
          {messages.map((message, idx) => (
            <div key={idx}>{message}</div>
          ))}
        </div>
      )}
    </div>
  )
}
