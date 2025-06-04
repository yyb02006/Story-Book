import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $generateHtmlFromNodes } from '@lexical/html'

export default function SubmitPlugin() {
  const [editor] = useLexicalComposerContext()
  const handleSubmit = () => {
    editor.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null)
      const title = (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || ''

      const postData = {
        title,
        content: htmlString,
      }

      try {
        localStorage.setItem('post', JSON.stringify(postData))
        console.log(htmlString)
        alert('게시글이 성공적으로 저장되었습니다.')
      } catch (error) {
        console.error('게시글 등록 중 오류 발생:', error)
        alert('게시글 등록 중 오류가 발생했습니다.')
      }
    })
  }
  return (
    <button
      className="bg-bright-blue font-S-CoreDream-400 float-right h-10 w-20 rounded-md"
      onClick={handleSubmit}
    >
      등록
    </button>
  )
}
