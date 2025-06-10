'use client'

import { handleLoginForm } from '#/app/(auth)/login/actions'
import FormButton from '#/components/form/formButton'
import FormInput from '#/components/form/formInput'
import SNSAuth from '#/components/SNSAuth'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function Login() {
  const [state, action] = useFormState(handleLoginForm, null)
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <section className="flex h-full w-[400px] flex-col justify-center">
        <h1 className="font-patrick mb-5 flex justify-center text-4xl font-bold">MEMOISM</h1>
        <SNSAuth buttonText="로그인" />
        <div className="flex w-full items-center space-x-4">
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
          <div className="font-S-CoreDream-400 text-light-gray text-xs break-keep">또는</div>
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
        </div>
        <form action={action} className="flex w-full flex-col space-y-4">
          <FormInput
            type="text"
            id="id"
            name="id"
            placeholder="아이디"
            className="bg-dark-gray h-12 rounded-lg px-3"
          />
          <FormInput
            type="text"
            id="password"
            name="password"
            placeholder="패스워드"
            className="bg-dark-gray h-12 rounded-lg px-3"
          />
          <FormButton title="로그인" className="h-10 w-full rounded-lg px-3" />
        </form>
        <div className="font-S-CoreDream-200 text-white-gray mt-2 flex w-full items-center justify-evenly px-4 text-xs">
          <button className="hover:text-bright-blue">
            <Link href={'/signup'}>회원가입</Link>
          </button>
          <div className="bg-white-gray h-4/5 w-[1px]" />
          <button className="hover:text-bright-blue">
            <Link href={'/find/id'}>아이디 찾기</Link>
          </button>
          <div className="bg-white-gray h-4/5 w-[1px]" />
          <button className="hover:text-bright-blue">
            <Link href={'/find/password'}>비밀번호 찾기</Link>
          </button>
        </div>
      </section>
    </div>
  )
}
