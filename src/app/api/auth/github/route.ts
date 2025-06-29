import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { createUniqueUserAndRedirect, getCookieAndRedirect } from '#/libs/server/utils'
import { User } from '@prisma/client'
import { randomBytes } from 'crypto'
import { notFound, redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

interface AccessTokenData {
  error: string
  access_token: string
}

type githubResponseData = { id: number; avatar_url: string; login: string }

const getGithubAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString()
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
  const tokenData: AccessTokenData = await (
    await fetch(accessTokenURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json()
  return tokenData
}

const getGithubUserData = async (path: string, access_token: string) => {
  const { id, avatar_url, login }: githubResponseData = await (
    await fetch(path, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: 'no-cache',
    })
  ).json()
  const github_id = id.toString()
  return { github_id, avatar_url, login }
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) return notFound()

  const { error, access_token } = await getGithubAccessToken(code)

  if (error) return new Response(error, { status: 400 })

  const { avatar_url, github_id, login } = await getGithubUserData(
    'https://api.github.com/user',
    access_token,
  )

  const existUser = await prisma.user.findUnique({
    where: { github_id },
    select: { id: true },
  })

  if (existUser) return await getCookieAndRedirect(existUser.id)

  await createUniqueUserAndRedirect({
    initialUsername: login,
    additionalData: { avatar: avatar_url, github_id },
  })
}
