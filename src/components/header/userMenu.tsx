'use client'

import { LogOut } from '#/components/header/actions'
import { cls } from '#/libs/client/utils'
import { User } from '@prisma/client'
import Image from 'next/image'
import { useState } from 'react'

type PickedUser = Pick<User, 'username' | 'avatar'>

export default function UserButton({ avatar, username }: PickedUser) {
  const [isError, setIsError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [onDropdown, setOnDropdown] = useState(false)

  const handleClick = async () => {
    await LogOut()
  }

  return (
    <div className="relative size-10">
      <button
        onClick={() => {
          setOnDropdown((p) => !p)
        }}
        className="size-full overflow-hidden rounded-xl"
      >
        {avatar ? (
          !isError ? (
            <Image
              alt="user_avatar"
              onError={() => {
                setIsError(true)
              }}
              src={avatar}
              onLoad={() => {
                setIsLoaded(true)
              }}
              width={48}
              height={48}
              className={cls(isLoaded ? 'visible' : 'invisible')}
            />
          ) : (
            <div className="bg-bright-blue flex size-12 items-center justify-center rounded-xl text-sm">
              {username}
            </div>
          )
        ) : (
          <div className="bg-bright-blue flex size-12 items-center justify-center rounded-xl text-sm">
            {username}
          </div>
        )}
      </button>
      {onDropdown && (
        <div className="bg-dark-gray font-S-CoreDream-400 dark:border-dark-border border-light-border absolute -right-4 mt-[6px] w-[200px] rounded-md border px-2 py-2 text-[0.8125rem] leading-[0.8125rem] whitespace-nowrap">
          <div className="relative w-full">
            <button onClick={handleClick} className="peer relative z-1 flex w-full px-2 py-2">
              로그아웃
            </button>
            <div className="peer-hover:bg-bright-blue absolute top-[14px] z-0 h-[10px] w-full rounded-xs"></div>
          </div>
        </div>
      )}
    </div>
  )
}
