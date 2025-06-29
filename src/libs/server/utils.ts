import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { User } from '@prisma/client'
import { randomBytes } from 'crypto'
import { redirect } from 'next/navigation'

type UserIdByAuthProvider =
  | {
      github_id: string
      google_id?: undefined
      kakao_id?: undefined
    }
  | {
      google_id: string
      github_id?: undefined
      kakao_id?: undefined
    }
  | {
      kakao_id: string
      github_id?: undefined
      google_id?: undefined
    }

interface CreateUniqueUserProps {
  initialUsername: string
  additionalData: Partial<Pick<User, 'user_id' | 'email' | 'password' | 'avatar'>> &
    UserIdByAuthProvider
}

/**
 * 주어진 기본 URL과 선택적 쿼리 파라미터를 사용하여 SNS 인증 URL을 생성.
 *
 * @param {string} baseURL - SNS 인증의 기본 URL.
 * @param {Object} [params] - URL에 추가할 쿼리 파라미터 객체. 각 키는 파라미터 이름이고, 각 값은 파라미터 값.
 * @returns {string} - 생성된 SNS 인증 URL.
 */
export const getSNSAuthURL = (baseURL: string, params?: { [key: string]: string }) => {
  const formattedParams = new URLSearchParams(params).toString()
  return `${baseURL}?${formattedParams}`
}

const createUniqueUsername = async (baseUsername: string) => {
  const randomString = randomBytes(4).toString('hex')
  const uniqueUsername = `${baseUsername}_${randomString}`

  return uniqueUsername
}

export const getCookieAndRedirect = async (idForSession: number) => {
  const session = await getSession()
  session.id = idForSession
  await session.save()
  return redirect('/')
}

export const createUniqueUserAndRedirect = async ({
  initialUsername,
  additionalData,
}: CreateUniqueUserProps) => {
  let uniqueUsername = initialUsername
  while (true) {
    const existNamedUser = await prisma.user.findUnique({
      where: { username: uniqueUsername },
      select: { id: true },
    })
    if (!existNamedUser) {
      const newUser = await prisma.user.create({
        data: { username: uniqueUsername, ...additionalData },
      })
      const session = await getSession()
      session.id = newUser.id
      await session.save()
      return redirect('/')
    }
    uniqueUsername = await createUniqueUsername(initialUsername)
  }
}
