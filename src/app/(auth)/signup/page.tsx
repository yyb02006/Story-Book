'use client'

import { ACCOUNT_LENGTH } from '#/libs/client/constants'
import {
  checkUserIdAvailability,
  handleEmailValidationForm,
  handleUserCredentialForm,
} from '#/app/(auth)/signup/actions'
import FormButton from '#/components/form/formButton'
import FormInput from '#/components/form/formInput'
import SNSAuth from '#/components/SNSAuth'
import Link from 'next/link'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { useFormState } from 'react-dom'
import { typeToFlattenedError } from 'zod'

const { id, password } = ACCOUNT_LENGTH

const EmailValidationForm = ({
  setConfirmState,
}: {
  setConfirmState: Dispatch<
    SetStateAction<{
      isEmailValidated: boolean
      email: string
    }>
  >
}) => {
  const [state, action] = useFormState(handleEmailValidationForm, null)
  useEffect(() => {
    if (!state?.success || !state.data) return
    setConfirmState({ isEmailValidated: true, email: state.data })
  }, [state, setConfirmState])

  return (
    <>
      <SNSAuth buttonText="회원가입" />
      <div className="flex w-full items-center space-x-4">
        <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
        <div className="font-S-CoreDream-400 text-light-gray text-xs break-keep">또는</div>
        <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
      </div>
      <form action={action} className="flex w-full flex-col space-y-4">
        <FormInput
          type="email"
          id="email"
          name="email"
          placeholder="abc@gmail.com"
          trim={true}
          errorMessages={state?.error?.formErrors}
        />
        <FormButton title="이메일 확인" className="h-10 w-full rounded-lg px-3" />
      </form>
      <div className="font-S-CoreDream-200 text-white-gray mt-2 flex w-full items-center justify-center space-x-2 px-4 text-xs">
        <span>이미 가입하셨나요?</span>
        <button className="text-bright-blue">
          <Link href={'/login'}>로그인</Link>
        </button>
      </div>
    </>
  )
}

const UserCredentialForm = ({ email }: { email: string }) => {
  const [isIdAvaliable, setIsIdAvaliable] = useState(false)
  const validateUserCredential = (
    prevState:
      | typeToFlattenedError<
          {
            user_id: string
            password: string
            confirm_password: string
          },
          string
        >
      | null
      | undefined,
    formData: FormData,
  ) => {
    return handleUserCredentialForm(prevState, formData, isIdAvaliable)
  }
  const [state, action] = useFormState(validateUserCredential, null)

  const checkId = useMemo(
    () => ({
      buttonName: { active: '중복체크', inActive: '체크완료' },
      check: checkUserIdAvailability,
      state: isIdAvaliable,
      setState: setIsIdAvaliable,
    }),
    [isIdAvaliable],
  )
  return (
    <>
      <form action={action} className="flex w-full flex-col space-y-4">
        <FormInput
          type="email"
          id="email"
          name="email"
          trim={true}
          placeholder="abc@gmail.com"
          initialValue={email}
          readOnly
        />
        <FormInput
          type="text"
          id="user_id"
          name="user_id"
          trim={true}
          placeholder="아이디 (6~20자의 영문 소문자, 숫자)"
          minLength={id.minLength}
          maxLength={id.maxLength}
          errorMessages={state?.fieldErrors.user_id}
          checkAvailability={checkId}
          required
        />
        <FormInput
          type="password"
          id="password"
          name="password"
          trim={true}
          placeholder="비밀번호"
          minLength={password.minLength}
          maxLength={password.maxLength}
          errorMessages={state?.fieldErrors.password}
          required
        />
        <FormInput
          type="password"
          id="confirm_password"
          name="confirm_password"
          trim={true}
          placeholder="비밀번호 확인"
          errorMessages={state?.fieldErrors.confirm_password}
          required
        />
        <FormButton title="가입 하기" className="h-10 w-full rounded-lg px-3" />
      </form>
      <div className="font-S-CoreDream-200 text-white-gray mt-2 flex w-full items-center justify-center space-x-2 px-4 text-xs">
        <span>이미 가입하셨나요?</span>
        <button className="text-bright-blue">
          <Link href={'/login'}>로그인</Link>
        </button>
      </div>
    </>
  )
}

export default function SignUp() {
  const [isEmailValidated, setIsEmailValidated] = useState({
    isEmailValidated: false,
    email: '',
  })
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <section className="flex h-full w-[400px] flex-col justify-center">
        <h1 className="font-patrick mb-5 flex justify-center text-4xl font-bold">MEMOISM</h1>
        {!isEmailValidated.isEmailValidated ? (
          <EmailValidationForm setConfirmState={setIsEmailValidated} />
        ) : (
          <UserCredentialForm email={isEmailValidated.email} />
        )}
      </section>
    </div>
  )
}
