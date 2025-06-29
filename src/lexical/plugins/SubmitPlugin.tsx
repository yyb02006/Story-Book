import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ImageNode } from '#/lexical/nodes/ImageNode'
import { useEffect, useState } from 'react'
import { Prisma } from '@prisma/client'
import CreatePost from '#/lexical/plugins/actions'

export default function SubmitPlugin({ title }: { title: string }) {
  const [editor] = useLexicalComposerContext()
  const [tempImageNames, setTempImageNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    let htmlContent: string | undefined
    let editorState: Prisma.InputJsonValue | undefined

    setLoading(true)
    editor.read(() => {
      htmlContent = $generateHtmlFromNodes(editor, null)
      editorState = editor.getEditorState().toJSON() as unknown as Prisma.InputJsonValue
    })

    if (htmlContent && editorState) {
      try {
        await CreatePost({
          data: { htmlContent, editorState, title },
          tempImageNames,
        })
      } catch (error) {
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
        return editor.getEditorState()._nodeMap
      })
      const imageNodes = Array.from(nodes.values()).filter(
        (node) => node.getType() === 'image',
      ) as ImageNode[]
      setTempImageNames(
        imageNodes
          .filter((name) => name.getSrc().includes('/temp-images/public/'))
          .map((name) => name.getSrc().split('/temp-images/public/')[1]),
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
