import { $createRangeSelection, $getNodeByKey, $setSelection } from 'lexical'
import { $isImageNode, ImageNode } from '#/lexical/nodes/ImageNode'
import { EditorImageData } from '#/lexical/plugins/ImagesPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEffect, useState } from 'react'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import useModal from '#/hooks/useModal'
import Image from 'next/image'

type OmitedImageData = Omit<
  EditorImageData,
  'uploadStatus' | 'permanentSrc' | 'previewSrc' | 'width' | 'height' | 'id' | 'file'
> & {
  key: string
}

export default function ImageListPlugin() {
  const [editor] = useLexicalComposerContext()
  const [imageDatas, setImageDatas] = useState<OmitedImageData[]>([])

  const [modal, showModal] = useModal()

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const nodes = editorState.read(() => {
        return editor.getEditorState()._nodeMap
      })
      const imageNodes = Array.from(nodes.values()).filter(
        (node) => node.getType() === 'image',
      ) as ImageNode[]
      setImageDatas(
        imageNodes.map((node) => ({
          fileName: node.__altText,
          key: node.__key,
          storageUrl: node.__storageUrl,
        })),
      )
    })
  }, [editor])

  const removeImageNode = (key: string) => {
    editor.update(() => {
      const nodeToRemove = $getNodeByKey(key)
      if (!nodeToRemove) return

      const parent = nodeToRemove.getParent()
      if (!parent) return

      const index = nodeToRemove.getIndexWithinParent()

      const rangeSelection = $createRangeSelection()

      rangeSelection.anchor.set(parent.getKey(), index, 'element')
      rangeSelection.focus.set(parent.getKey(), index, 'element')

      $setSelection(rangeSelection)

      nodeToRemove.remove()
    })
  }

  const handlePreviewClick = (nodeKey: string) => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(nodeKey)
      if (!$isImageNode(node)) return
      const { __key, __altText, __src, __width, __height } = node
      const viewWidth = '60vw'
      showModal(
        '',
        () => (
          <div
            style={{
              width: viewWidth,
              height: `calc(${viewWidth}/${__width} * ${__height})`,
              minWidth: 300,
              minHeight: `calc(300/${__width} * ${__height})`,
            }}
            className="relative"
          >
            <Image key={__key} src={__src} alt={__altText} fill />
          </div>
        ),
        true,
      )
    })
  }

  return (
    <>
      <ul
        className={
          imageDatas.length > 0
            ? 'font-S-CoreDream-200 input-color-theme absolute top-0 left-full ml-4 w-[240px] space-y-2 rounded-lg p-3 text-sm'
            : 'hidden'
        }
      >
        {imageDatas.length > 0 && <h1 className="font-S-CoreDream-400 text-base">추가된 이미지</h1>}
        {imageDatas.map((data) => (
          <li key={data.key} className="flex justify-between text-ellipsis">
            <button
              onClick={() => {
                handlePreviewClick(data.key)
              }}
              className="hover:font-S-CoreDream-400 hover:text-bright-blue"
            >
              {data.fileName}
            </button>
            <button
              onClick={() => {
                removeImageNode(data.key)
              }}
              className="hover:text-bright-blue"
            >
              <ToolbarIcon size={buttonSizes.sm} svgId="cancel" />
            </button>
          </li>
        ))}
      </ul>
      {modal}
    </>
  )
}
