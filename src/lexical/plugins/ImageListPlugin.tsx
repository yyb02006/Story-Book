import { $getNodeByKey } from 'lexical'
import { ImageNode } from '#/lexical/nodes/ImageNode'
import { EditorImageData } from '#/lexical/plugins/ImagesPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'

type OmitedImageData = Omit<EditorImageData, 'src' | 'width' | 'height'> & { key: string }

export default function ImageListPlugin() {
  const [editor] = useLexicalComposerContext()
  const [imageDatas, setImageDatas] = useState<OmitedImageData[]>([])
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const nodes = editorState.read(() => {
        return editor.getEditorState()._nodeMap
      })
      const imageNodes = Array.from(nodes.values()).filter(
        (node) => node.getType() === 'image',
      ) as ImageNode[]
      setImageDatas(imageNodes.map((node) => ({ fileName: node.__altText, key: node.__key })))
    })
  }, [editor])

  const removeImageNode = (key: string) => {
    editor.update(() => {
      const nodeToRemove = $getNodeByKey(key)
      if (!nodeToRemove) return

      nodeToRemove.remove()
    })
  }

  return (
    <ul className="w-full bg-purple-500">
      {imageDatas.map((data) => (
        <li
          key={data.key}
          onClick={() => {
            removeImageNode(data.key)
          }}
        >
          {data.fileName}
        </li>
      ))}
    </ul>
  )
}
