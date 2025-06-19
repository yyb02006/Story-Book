import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { randomBytes } from 'crypto'
import { notFound, redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

interface AccessTokenData {
  error: string
  access_token: string
}

type githubResponseData = { id: number; avatar_url: string; login: string }

const createUniqueUsername = async (baseUsername: string) => {
  const randomString = randomBytes(4).toString('hex')
  const uniqueUsername = `${baseUsername}_${randomString}`

  return uniqueUsername
}

const getCookieAndRedirect = async (idForSession: number) => {
  const session = await getSession()
  session.id = idForSession
  await session.save()
  return redirect('/')
}

const getAccessToken = async (code: string) => {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString()
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`
  const data: AccessTokenData = await (
    await fetch(accessTokenURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json()
  return data
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

  const { error, access_token } = await getAccessToken(code)

  if (error) return new Response(null, { status: 400 })

  const { avatar_url, github_id, login } = await getGithubUserData(
    'https://api.github.com/user',
    access_token,
  )
  const user = await prisma.user.findUnique({
    where: { github_id },
    select: { id: true },
  })

  if (user) return await getCookieAndRedirect(user.id)

  let uniqueUsername = login
  while (true) {
    const existNamedUser = await prisma.user.findUnique({
      where: { username: uniqueUsername },
      select: { id: true },
    })
    if (!existNamedUser) {
      const newUser = await prisma.user.create({
        data: { username: uniqueUsername, avatar: avatar_url, github_id },
      })
      const session = await getSession()
      session.id = newUser.id
      await session.save()
      return redirect('/')
    }
    uniqueUsername = await createUniqueUsername(login)
  }
}
