import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ImageNode } from '#/lexical/nodes/ImageNode'
import { useEffect, useState } from 'react'
import { Prisma } from '@prisma/client'
import CreatePost from '#/lexical/plugins/actions'
import { $getRoot } from 'lexical'
import { useRouter } from 'next/navigation'

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

export default function SubmitPlugin({ title }: { title: string }) {
  const [editor] = useLexicalComposerContext()
  const [tempImageNames, setTempImageNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async () => {
    let htmlContent: string | undefined
    let editorState: Prisma.InputJsonValue | undefined
    let previewText: string | undefined
    let previewImageUrl: string | undefined

    setLoading(true)

    editor.update(() => {
      // 이미지 노드의 src를 permanent로 변경
      const nodes = editor.getEditorState()._nodeMap
      const imageNodes = Array.from(nodes.values()).filter(
        (node) => node.getType() === 'image',
      ) as ImageNode[]

      imageNodes.forEach((node) => {
        const newSrc = node.getSrc().replace('temp-images', 'permanent-images')

        if (node.getIsThumbnail()) {
          previewImageUrl = newSrc.replace('content', 'thumbnail')
        }
      })

      if (!previewImageUrl && imageNodes.length > 0) {
        previewImageUrl = imageNodes[0]
          .getSrc()
          .replace('temp-images', 'permanent-images')
          .replace('content', 'thumbnail')
      }

      const root = $getRoot()

      previewText = getPreviewText(root.getTextContent())
      htmlContent = $generateHtmlFromNodes(editor, null)
      editorState = editor.getEditorState().toJSON() as unknown as Prisma.InputJsonValue
    })

    if (htmlContent && editorState) {
      try {
        // 여기에서 사진을 따로 꺼내서 저장할 수 있도록 해야함 게시글 목록 같은 곳에서 확인할 수 있도록
        await CreatePost({
          data: { htmlContent, editorState, title, previewImageUrl, previewText },
          tempImageNames,
        })
        router.push('/')
      } catch (error) {
        console.log(error)
        throw new Error('Fail to Submit')
      }
    } else {
      throw new Error('Fail to Submit')
    }
    setLoading(false)
  }

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const nodes = editorState.read(() => {
        return editorState._nodeMap
      })
      const imageNodes = Array.from(nodes.values()).filter(
        (node) => node.getType() === 'image',
      ) as ImageNode[]
      setTempImageNames(
        imageNodes
          .filter((name) => name.getSrc().includes('/temp-images/content/'))
          .map((name) => name.getSrc().split('/temp-images/content/')[1]),
      )
    })
  }, [editor])

  return (
    <button
      className="bg-bright-blue font-S-CoreDream-400 float-right h-10 w-20 rounded-md"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? '등록 중...' : '등록'}
    </button>
  )
}
