'use server'

import { supabase } from '#/libs/client/supabase'
import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { Prisma } from '@prisma/client'

const moveFileToPermanent = async (tempImageNames: string[]) => {
  const promises = tempImageNames.map((name) =>
    supabase.storage
      .from('temp-images')
      .move(`public/${name}`, `public/${name}`, { destinationBucket: 'permanent-images' }),
  )

  const results = await Promise.all(promises)

  if (results.filter((result) => result.error).length > 0) {
    console.log(results.filter((result) => result.error))
    throw new Error('파일 업로드 시 문제가 발생했습니다.')
  }
}

export default async function CreatePost({
  data,
  tempImageNames,
}: {
  data: {
    editorState: Prisma.InputJsonValue
    title: string
    htmlContent: string
    previewImageUrl?: string
    previewText?: string
  }
  tempImageNames: string[]
}) {
  console.log(data.previewImageUrl, data.previewText)

  const session = await getSession()
  if (!session) throw new Error('no user session')
  try {
    await moveFileToPermanent(tempImageNames)
    // 이미지 url은 별도의 field에 저장할 필요가 있음
    await prisma.post.create({
      data: {
        ...data,
        userId: session.id,
      },
    })
    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}
