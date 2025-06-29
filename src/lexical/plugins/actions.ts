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
  data: { editorState, htmlContent, title },
  tempImageNames,
}: {
  data: { editorState: Prisma.InputJsonValue; title: string; htmlContent: string }
  tempImageNames: string[]
}) {
  const session = await getSession()
  if (!session) throw new Error('no user session')
  try {
    await moveFileToPermanent(tempImageNames)
    // 실제 게시글 아이디로 수정 필요, 근데 첫 글에 id가 어딨지? 이거 upsert로 처리하는 게 맞나?
    await prisma.post.create({
      data: { editorState, title, htmlContent: htmlContent, userId: session.id },
    })
    return { success: true }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}
