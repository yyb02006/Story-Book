import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'
import { ImageNode } from '#/lexical/nodes/ImageNode'
import { useEffect, useState } from 'react'
import { supabase } from '#/libs/client/supabase'

export default function SubmitPlugin() {
  const [editor] = useLexicalComposerContext()
  const [TempImageNames, setTempImageNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const handleSubmit = async () => {
    if (loading) return
    editor.read(async () => {
      const htmlString = $generateHtmlFromNodes(editor, null)
      const title = (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || ''

      const postData = {
        title,
        content: htmlString,
      }

      try {
        setLoading(true)
        await moveFileToPermanent()

        localStorage.setItem('post', JSON.stringify(postData))
        console.log(htmlString)
        alert('게시글이 성공적으로 저장되었습니다.')
        setLoading(false)
      } catch (error) {
        console.error('게시글 등록 중 오류 발생:', error)
        alert('게시글 등록 중 오류가 발생했습니다.')
      }
    })
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

  const moveFileToPermanent = async () => {
    const promises = TempImageNames.map((name) =>
      supabase.storage
        .from('temp-images')
        .move(`public/${name}`, `public/${name}`, { destinationBucket: 'permanent-images' }),
    )

    const results = await Promise.all(promises)

    if (results.filter((result) => result.error).length > 0) {
      setLoading(false)
      console.log(results.filter((result) => result.error))
      throw new Error('파일 업로드 시 문제가 발생했습니다.')
    }
  }

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
