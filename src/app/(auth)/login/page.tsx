'use client'

import { handleForm } from '#/app/(auth)/login/actions'
import FormButton from '#/components/form/formButton'
import FormTextInput from '#/components/form/formTextInput'
import Link from 'next/link'
import { useFormState } from 'react-dom'

export default function Login() {
  const [state, action] = useFormState(handleForm, null)
  return (
    <div className="flex h-screen w-screen flex-col items-center">
      <section className="flex h-full w-[400px] flex-col justify-center">
        <h1 className="font-patrick mb-5 flex justify-center text-4xl font-bold">MEMOISM</h1>
        <div className="flex flex-col space-y-4">
          <button className="bg-smooth-white text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 rounded-lg text-sm">
            <svg className="size-6">
              <use href={`/icons/brandIcons.svg#google`} />
            </svg>
            <span>구글 로그인</span>
          </button>
          <button className="bg-smooth-white text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 rounded-lg text-sm">
            <svg className="size-6">
              <use href={`/icons/brandIcons.svg#github`} />
            </svg>
            <span>깃헙 로그인</span>
          </button>
          <button className="text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-2 rounded-lg bg-[#FEE500] text-sm">
            <svg className="size-4">
              <use href={`/icons/brandIcons.svg#kakao`} />
            </svg>
            <span>카카오 로그인</span>
          </button>
        </div>
        <div className="flex w-full items-center space-x-4">
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
          <div className="font-S-CoreDream-400 text-light-gray text-xs break-keep">또는</div>
          <div className="bg-charcoal-gray my-6 h-[1px] w-full rounded-full"></div>
        </div>
        <form action={action} className="flex w-full flex-col space-y-4">
          <FormTextInput
            id="id"
            name="id"
            placeholder="아이디"
            className="bg-dark-gray h-12 rounded-lg px-3"
          />
          {state?.id?.toString()}
          <FormTextInput
            id="password"
            name="password"
            placeholder="패스워드"
            className="bg-dark-gray h-12 rounded-lg px-3"
          />
          <FormButton title="로그인" className="h-10 w-full rounded-lg px-3" />
        </form>
        <div className="font-S-CoreDream-200 text-white-gray mt-2 flex w-full items-center justify-evenly px-4 text-xs">
          <button className="hover:text-bright-blue">
            <Link href={'/login'}>회원가입</Link>
          </button>
          <div className="bg-white-gray h-4/5 w-[1px]" />
          <button className="hover:text-bright-blue">
            <Link href={'/find/id'}>아이디 찾기</Link>
          </button>
          <div className="bg-white-gray h-4/5 w-[1px]" />
          <button className="hover:text-bright-blue">
            <Link href={'/login'}>비밀번호 찾기</Link>
          </button>
        </div>
      </section>
    </div>
  )
}
