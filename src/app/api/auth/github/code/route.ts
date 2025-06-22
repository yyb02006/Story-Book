import { getSNSAuthURL } from '#/libs/server/utils'
import { redirect } from 'next/navigation'

const githubAuthURL = getSNSAuthURL('https://github.com/login/oauth/authorize', {
  client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
  scope: 'read:user,user:email',
})

export async function GET() {
  redirect(githubAuthURL)
}
