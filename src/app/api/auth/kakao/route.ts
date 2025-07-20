import { createUniqueUserAndRedirect, getCookieAndRedirect } from '#/libs/server/utils'
import prisma from '#/libs/server/prisma'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'

interface TokenData {
  access_token: string
  token_type: string
  refresh_token: string
  id_token: string
  expires_in: number
  refresh_token_expires_in: number
}

interface TokenError {
  error: string
  error_description: string
  error_code: string
}

type Token = TokenData | TokenError

interface KakaoUserData {
  id: number
  connected_at: string
  properties: {
    nickname: string
    profile_image: string
    thumbnail_image: string
  }
  kakao_account: {
    profile_nickname_needs_agreement: boolean
    profile_image_needs_agreement: boolean
    profile: {
      nickname: string
      thumbnail_image_url: string
      profile_image_url: string
      is_default_image: boolean
      is_default_nickname: boolean
    }
  }
}

interface KakaoUserError {
  msg: string
  code: number
}

type KakaoUser = KakaoUserData | KakaoUserError

const getKaKaoAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    code,
    client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
    client_secret: process.env.KAKAO_CLIENT_SECRET!,
    redirect_uri: 'http://localhost:3000/api/auth/kakao',
    grant_type: 'authorization_code',
  }).toString()
  const accessTokenURL = `https://kauth.kakao.com/oauth/token?${accessTokenParams}`
  const tokenData: Token = await (
    await fetch(accessTokenURL, {
      method: 'POST',
      headers: {
        // URLSearchParams객체같은 URL 데이터를 body에 담아서 보낼 때는 x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  ).json()

  return tokenData
}

const getKaKaoUserData = async (access_token: string) => {
  const userData: KakaoUser = await (
    await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${access_token}`,
      },
      cache: 'no-cache',
    })
  ).json()

  if ('msg' in userData) return userData

  const kakao_id = userData.id.toString()

  return {
    kakao_id,
    avatar: userData.properties.profile_image,
    username: userData.properties.nickname,
  }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return notFound()

  const tokenData = await getKaKaoAccessToken(code)

  if ('error' in tokenData)
    return new Response('Failed to exchange code for tokens', { status: 400 })

  const { access_token } = tokenData

  const kakaoUser = await getKaKaoUserData(access_token)

  if ('msg' in kakaoUser) {
    return new Response(kakaoUser.msg, { status: 400 })
  }

  const { kakao_id, avatar, username } = kakaoUser

  const existUser = await prisma.user.findUnique({
    where: { kakao_id: kakao_id },
    select: { id: true },
  })

  if (existUser) {
    return await getCookieAndRedirect(existUser.id)
  } else {
    return await createUniqueUserAndRedirect({
      initialUsername: username,
      additionalData: { kakao_id, avatar },
    })
  }
}
