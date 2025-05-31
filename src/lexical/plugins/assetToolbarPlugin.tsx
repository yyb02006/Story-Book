import useModal from '#/hooks/useModal'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { $createStickyNode, $isStickyNode } from '#/lexical/nodes/StickyNode'
import { InsertImageUploadedDialog } from '#/lexical/plugins/ImagesPlugin'
import { getSelectedNode } from '#/lexical/plugins/utils'
import { cls } from '#/libs/client/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { useEffect, useState } from 'react'

type AssetState = 'memo' | 'image' | ''

export default function AssetToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [modal, showModal] = useModal()

  const [assetState, setAssetState] = useState<AssetState>('')

  // 여기에 위 useEffect의 updateToolbar 함수를 넣어서 memo, link, image 버튼을 활성화할 수 있도록
  // 각 에디터들을 구분해서 코드를 쓸 것인지? 아니면 newEditor만 가지고 모든 로직을 처리할 것인지?
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        if (newEditor === editor) return false
        newEditor.read(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return
          const anchorNode = getSelectedNode(selection)
          const parent = anchorNode.getParent()
          const isStickyNodeActive = $isStickyNode(anchorNode) || $isStickyNode(parent)
          console.log(isStickyNodeActive)

          if (isStickyNodeActive) {
            setAssetState('memo')
          } else {
            setAssetState('')
          }
        })
        // return false는 다른 PRIORITY를 가진 같은 SELECTION_CHANGE_COMMAND에 대해서
        // true일 때 연결해서 실행하지 않고 false일 때 연결해서 실행함
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor])

  const insertMemoHandler = () => {
    editor.update(() => {
      const root = $getRoot()
      const stickyNode = $createStickyNode(0, 0)
      root.append(stickyNode)
    })
  }

  return (
    <div className="flex space-x-3">
      <button
        onClick={insertMemoHandler}
        aria-label="Sticky Note"
        title="Sticky Note"
        type="button"
      >
        <ToolbarIcon
          svgId={'sticky-note'}
          size={buttonSizes['md']}
          className="hover:text-bright-blue dark:text-dark-disabled-icon text-light-disabled-icon"
        />
      </button>
      <button
        onClick={() => {
          showModal('이미지 삽입', (onClose) => (
            <InsertImageUploadedDialog activeEditor={editor} onClose={onClose} />
          ))
        }}
        aria-label="Insert Image"
        title="Insert Image"
        type="button"
      >
        <ToolbarIcon
          svgId={'image'}
          size={buttonSizes['md']}
          className={cls(
            'hover:text-bright-blue',
            assetState === 'memo'
              ? 'text-bright-blue'
              : 'dark:text-dark-disabled-icon text-light-disabled-icon',
          )}
        />
      </button>
      {modal}
    </div>
  )
}
