import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

interface SessionContent {
  id: number
}

export default async function getSession() {
  return await getIronSession<SessionContent>(cookies(), {
    cookieName: 'memoism',
    password: process.env.IRON_SESSION_PASSWORD!,
  })
}
