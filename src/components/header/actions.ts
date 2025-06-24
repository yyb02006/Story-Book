'use server'

import getSession from '#/libs/server/session'
import { redirect } from 'next/navigation'

export const LogOut = async () => {
  const session = await getSession()
  if (!session.id) redirect('/')
  await session.destroy()
  redirect('/')
}
