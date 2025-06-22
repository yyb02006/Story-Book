import { createUniqueUser, getCookieAndRedirect } from '#/app/api/auth/github/route'
import prisma from '#/libs/server/prisma'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'

interface TokenData {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
  id_token: string
}

interface TokenError {
  error: string
  error_description: string
}

type Token = TokenData | TokenError

type GoogleUserData = {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}

const getGoogleAccessToken = async (code: string) => {
  const tokenData: Token = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        // URLSearchParams객체같은 URL 데이터를 body에 담아서 보낼 때는 x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: 'http://localhost:3000/api/google/token',
        grant_type: 'authorization_code',
      }),
    })
  ).json()

  return tokenData
}

const getGoogleUserData = async (access_token: string) => {
  const userData: GoogleUserData = await (
    await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: 'no-cache',
    })
  ).json()
  return userData
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return notFound()

  const tokenData = await getGoogleAccessToken(code)

  if ('error' in tokenData)
    return new Response('Failed to exchange code for tokens', { status: 400 })

  const { access_token } = tokenData

  const { name, picture, sub } = await getGoogleUserData(access_token)

  const existUser = await prisma.user.findUnique({
    where: { google_id: sub },
    select: { id: true },
  })

  if (existUser) return await getCookieAndRedirect(existUser.id)

  await createUniqueUser({
    initialUsername: name,
    additionalData: { avatar: picture, google_id: sub },
  })
}
