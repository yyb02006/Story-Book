'use server'

import { supabase } from '#/libs/client/supabase'
import prisma from '#/libs/server/prisma'
import getSession from '#/libs/server/session'
import { Prisma } from '@prisma/client'

class SupabaseMoveError extends Error {
  constructor(public failures: unknown[]) {
    super('파일 이동 실패')
    this.name = 'SupabaseMoveError'
  }
}

const moveFileToPermanent = async (imageNames: string[]) => {
  if (imageNames.length === 0) return
  const promises = imageNames
    .map((name) => {
      const moveContentPromise = supabase.storage
        .from('temp-images')
        .move(`content/${name}`, `content/${name}`, { destinationBucket: 'permanent-images' })
      const moveThumbnailPromise = supabase.storage
        .from('temp-images')
        .move(`thumbnail/${name}`, `thumbnail/${name}`, { destinationBucket: 'permanent-images' })
      return [moveContentPromise, moveThumbnailPromise]
    })
    .flat()

  const results = await Promise.all(promises)

  if (results.some((result) => result.error)) {
    throw new SupabaseMoveError(
      results.filter((result) => result.error).map((result) => result.error),
    )
  }
}

export default async function CreatePost({
  data,
  imageNames,
}: {
  data: {
    editorState: Prisma.InputJsonValue
    title: string
    htmlContent: string
    previewImageUrl?: string
    previewText?: string
  }
  imageNames: string[]
}): Promise<{ success: true } | { success: false; error: unknown }> {
  console.log(data.previewImageUrl, data.previewText)

  const session = await getSession()
  if (!session) return { success: false, error: '로그인 필요' }
  try {
    await moveFileToPermanent(imageNames)
    await prisma.post.create({
      data: {
        ...data,
        userId: session.id,
      },
    })
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false, error }
  }
}
