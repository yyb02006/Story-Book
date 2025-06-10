'use client'

interface SNSAuthProps {
  buttonText: string
}

export default function SNSAuth({ buttonText }: SNSAuthProps) {
  return (
    <div className="flex flex-col space-y-4">
      <button className="bg-smooth-white text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 rounded-lg text-sm">
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#google`} />
        </svg>
        <span>구글 {buttonText}</span>
      </button>
      <button className="bg-smooth-white text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-1 rounded-lg text-sm">
        <svg className="size-6">
          <use href={`/icons/brandIcons.svg#github`} />
        </svg>
        <span>깃헙 {buttonText}</span>
      </button>
      <button className="text-smooth-black font-S-CoreDream-400 flex h-10 items-center justify-center space-x-2 rounded-lg bg-[#FEE500] text-sm">
        <svg className="size-4">
          <use href={`/icons/brandIcons.svg#kakao`} />
        </svg>
        <span>카카오 {buttonText}</span>
      </button>
    </div>
  )
}
