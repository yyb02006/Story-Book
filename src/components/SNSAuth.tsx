'use client'

import Link from 'next/link'

interface SNSAuthProps {
  buttonText: string
}

export default function SNSAuth({ buttonText }: SNSAuthProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Link
        href="/api/auth/google/code"
        className="bg-smooth-white hover:ring-bright-blue text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 overflow-hidden rounded-lg text-sm hover:ring-2"
      >
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#google`} />
        </svg>
        <span>구글 {buttonText}</span>
      </Link>

      <Link
        href="/api/auth/github/code"
        className="bg-smooth-white hover:ring-bright-blue text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 overflow-hidden rounded-lg text-sm hover:ring-2"
      >
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#github`} />
        </svg>
        <span>깃헙 {buttonText}</span>
      </Link>

      <Link
        href="/api/auth/kakao/code"
        className="hover:ring-bright-blue text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 overflow-hidden rounded-lg bg-[#FEE500] text-sm hover:ring-2"
      >
        <svg className="size-4">
          <use href={`/icons/brandIcons.svg#kakao`} />
        </svg>
        <span>카카오 {buttonText}</span>
      </Link>
    </div>
  )
}
