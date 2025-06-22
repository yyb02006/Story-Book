import { getSNSAuthURL } from '#/libs/server/utils'
import { redirect } from 'next/navigation'

const googleAuthURL = getSNSAuthURL(`https://accounts.google.com/o/oauth2/v2/auth`, {
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  response_type: 'code',
  scope: encodeURIComponent('profile email'),
  redirect_uri: 'http://localhost:3000/api/google/token',
})

export async function GET() {
  redirect(googleAuthURL)
}
