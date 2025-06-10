'use client'

import { handleForm } from '#/app/(auth)/actions'
import FormButton from '#/components/form/formButton'
import FormInput from '#/components/form/formInput'
import SNSAuth from '#/components/SNSAuth'
import { useFormState } from 'react-dom'

export default function SignUp() {
  const [state, action] = useFormState(handleForm, null)
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
      </section>
    </div>
  )
}
