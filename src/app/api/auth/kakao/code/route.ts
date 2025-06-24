import { getSNSAuthURL } from '#/libs/server/utils'
import { redirect } from 'next/navigation'

const kakaoAuthURL = getSNSAuthURL(`https://kauth.kakao.com/oauth/authorize`, {
  client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
  response_type: 'code',
  scope: 'profile_nickname,profile_image',
  redirect_uri: 'http://localhost:3000/api/auth/kakao',
})

export async function GET() {
  redirect(kakaoAuthURL)
}
