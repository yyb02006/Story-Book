'use client'

import { handleSignupForm } from '#/app/(auth)/signup/actions'
import FormButton from '#/components/form/formButton'
import FormInput from '#/components/form/formInput'
import SNSAuth from '#/components/SNSAuth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function SignUp() {
  const [state, action] = useFormState(handleSignupForm, null)
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <section className="flex h-full w-[400px] flex-col justify-center">
        <h1 className="font-patrick mb-5 flex justify-center text-4xl font-bold">MEMOISM</h1>
        <SNSAuth buttonText="회원가입" />
        <div className="flex w-full items-center space-x-4">
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
          <div className="font-S-CoreDream-400 text-light-gray text-xs break-keep">또는</div>
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
        </div>
        <form action={action} className="flex w-full flex-col space-y-4">
          <FormInput
            type="email"
            id="id"
            name="id"
            placeholder="abc@gmail.com"
            className="bg-dark-gray h-12 rounded-lg px-3"
          />
          <FormButton title="이메일 확인" className="h-10 w-full rounded-lg px-3" />
        </form>
        <div className="font-S-CoreDream-200 text-white-gray mt-2 flex w-full items-center justify-center space-x-2 px-4 text-xs">
          <span>이미 가입하셨나요?</span>
          <button className="text-bright-blue">
            <Link href={'/login'}>로그인</Link>
          </button>
        </div>
      </section>
    </div>
  )
}
