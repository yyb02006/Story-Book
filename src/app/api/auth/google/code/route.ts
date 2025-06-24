import { cls } from '#/libs/client/utils'
import { getSNSAuthURL } from '#/libs/server/utils'
import { redirect } from 'next/navigation'

const googleAuthURL = getSNSAuthURL(`https://accounts.google.com/o/oauth2/v2/auth`, {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  response_type: 'code',
  scope: cls(
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ),
  redirect_uri: 'http://localhost:3000/api/auth/google',
})

export async function GET() {
  redirect(googleAuthURL)
}
