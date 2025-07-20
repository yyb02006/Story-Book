import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Prisma } from '@prisma/client'
import CreatePost from '#/lexical/plugins/actions'
import { $getRoot } from 'lexical'
import { useRouter } from 'next/navigation'
import { z } from 'zod/v4'
import { SubmitStatus } from '#/lexical/editor'
import { cls } from '#/libs/client/utils'
import { forEachImageNodes } from '#/lexical/plugins/utils'

const getPreviewText = (str: string, maxLength: number = 50) => {
  const modifiedText = str
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()

  if (modifiedText.length > maxLength) {
    return modifiedText.substring(0, maxLength)
  }
  return modifiedText
}

export default function SubmitPlugin({
  title,
  setSubmitStatus,
  submitStatus,
}: {
  title: string
  setSubmitStatus: Dispatch<SetStateAction<SubmitStatus>>
  submitStatus: SubmitStatus
}) {
  const [editor] = useLexicalComposerContext()
  const router = useRouter()

  const disable = submitStatus.status === 'pending' || submitStatus.status === 'success'

  const fail = useCallback(
    (msg: string) => {
      setSubmitStatus({
        error: { title: [], editor: msg },
        status: 'failed',
      })
    },
    [setSubmitStatus],
  )

  const handleSubmit = async () => {
    // 한 번 누르면 아무 반응도 없는 현상
    let htmlContent: string | undefined
    let editorState: Prisma.InputJsonValue | undefined
    let previewText: string | undefined
    let previewImageUrl: string | undefined
    let firstImageUrl = ''
    const imageNames: string[] = []

    setSubmitStatus((p) => ({ ...p, status: 'pending' }))

    const { success, error, data } = z
      .string()
      .trim()
      .refine((value) => value.length !== 0, { error: '제목을 입력해주세요' })
      .refine((value) => value.length <= 200, { error: '제목은 200자 이하여야 합니다' })
      .safeParse(title)

    if (!success) {
      const newError = z.flattenError(error).formErrors
      return setSubmitStatus((p) => ({ error: { ...p.error, title: newError }, status: 'failed' }))
    }

    const validTitle = data

    forEachImageNodes(editor, (node) => {
      node.setSrcByStorageUrl()
    })

    editor.read(() => {
      forEachImageNodes(editor, (node, index) => {
        const src = node.getSrc()
        const matches = src.match(/\/temp-images\/content\/(.+)$/)
        if (matches?.[1]) imageNames.push(matches[1])

        const newSrc = src.replace('temp-images', 'permanent-images')

        if (index === 0) {
          firstImageUrl = newSrc.replace('content', 'thumbnail')
        }
        if (node.getIsThumbnail()) {
          previewImageUrl = newSrc.replace('content', 'thumbnail')
        }
      })
      const root = $getRoot()

      previewText = getPreviewText(root.getTextContent())
      htmlContent = $generateHtmlFromNodes(editor, null)
      editorState = editor.getEditorState().toJSON() as unknown as Prisma.InputJsonValue
    })

    if (!previewImageUrl && firstImageUrl) {
      previewImageUrl = firstImageUrl
    }

    if (htmlContent && editorState) {
      try {
        // 여기에서 사진을 따로 꺼내서 저장할 수 있도록 해야함 게시글 목록 같은 곳에서 확인할 수 있도록
        const result = await CreatePost({
          data: { htmlContent, editorState, title: validTitle, previewImageUrl, previewText },
          imageNames,
        })
        if (!result.success) {
          return fail('게시글 등록 실패: 서버 처리 중 문제가 발생했습니다.')
        }
        router.push('/')
      } catch (error) {
        console.error(error)
        fail('게시글 등록 실패: 네트워크 또는 서버 오류')
      }
    } else {
      fail('게시글 등록 실패 : 유효하지 않은 컨텐츠입니다.')
      alert('게시글 등록에 실패했습니다.\n게시글의 내용을 확인하거나 새로고침 후 다시 작성해주세요')
    }
    setSubmitStatus({ error: { title: [], editor: '' }, status: 'success' })
  }

  return (
    <button
      className={cls(
        disable ? 'bg-charcoal-gray' : 'bg-bright-blue',
        'font-S-CoreDream-400 float-right h-10 min-w-20 rounded-md px-3',
      )}
      onClick={handleSubmit}
      disabled={disable}
    >
      {disable ? '등록 중...' : '등록'}
    </button>
  )
}
