'use client'

import Link from 'next/link'

interface SNSAuthProps {
  buttonText: string
}

const getSNSAuthURL = (baseURL: string, params?: { [key: string]: string }) => {
  const formattedParams = new URLSearchParams(params).toString()
  return `${baseURL}?${formattedParams}`
}

export default function SNSAuth({ buttonText }: SNSAuthProps) {
  const githubAuthURL = getSNSAuthURL('https://github.com/login/oauth/authorize', {
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    scope: 'read:user,user:email',
  })
  const googleAuthUTL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${'http://localhost:3000/api/google/token'}&response_type=code&scope=${encodeURIComponent('profile email')}&access_type=offline`
  return (
    <div className="flex flex-col space-y-4">
      <Link
        href={googleAuthUTL}
        className="bg-smooth-white hover:ring-bright-blue text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 overflow-hidden rounded-lg text-sm hover:ring-2"
      >
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#google`} />
        </svg>
        <span>구글 {buttonText}</span>
      </Link>

      <Link
        href={githubAuthURL}
        className="bg-smooth-white hover:ring-bright-blue text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 overflow-hidden rounded-lg text-sm hover:ring-2"
      >
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#github`} />
        </svg>
        <span>깃헙 {buttonText}</span>
      </Link>

      <button className="text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-2 rounded-lg bg-[#FEE500] text-sm">
        <svg className="size-4">
          <use href={`/icons/brandIcons.svg#kakao`} />
        </svg>
        <span>카카오 {buttonText}</span>
      </button>
    </div>
  )
}
