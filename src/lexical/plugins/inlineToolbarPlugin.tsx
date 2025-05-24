import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
import { $isCodeNode } from '@lexical/code'
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import { cls, sanitizeUrl } from '#/libs/client/utils'
import { getSelectedNode } from '#/lexical/plugins/utils'
import { $createStickyNode } from '#/lexical/nodes/StickyNode'

const SupportedInlineTypes = [
  'code',
  'bold',
  'italic',
  'strikethrough',
  'underline',
  'superscript',
  'subscript',
] as const

export default function InlineToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}) {
  const [editor] = useLexicalComposerContext()

  const initialOnTextFormatState = useMemo(() => {
    return {
      bold: false,
      underline: false,
      strikethrough: false,
      italic: false,
      code: false,
      subscript: false,
      superscript: false,
    }
  }, [])

  const [onTextFormats, setOnTextFormats] = useState(initialOnTextFormatState)
  const [onLink, setOnLink] = useState(false)

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) return

        const anchorNode = getSelectedNode(selection)
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()

        // link 업데이트 우선 수행
        // const node = getSelectedNode(selection)

        const parent = anchorNode.getParent()
        const isLink = $isLinkNode(parent) || $isLinkNode(anchorNode) // 앵커 노드가 link일 수가 있나?
        setOnLink(isLink)

        // 새로운 객체를 계속 생성하는데, 이게 성능적으로 좋을까?
        const newTextFormats = SupportedInlineTypes.reduce(
          (acc, format) => ({ ...acc, [format]: selection.hasFormat(format) }),
          {} as Record<(typeof SupportedInlineTypes)[number], boolean>,
        )

        /* 
        이 코드는 객체를 한 번만 생성한다.
        하드코딩처럼 보여도 이게 더 좋은 게 아닐까?
        const newFormats {
          bold: selection.hasFormat('bold'),
          code: selection.hasFormat('code'),
          italic: selection.hasFormat('italic'),
          strikethrough: selection.hasFormat('strikethrough'),
          subscript: selection.hasFormat('subscript'),
          superscript: selection.hasFormat('superscript'),
          underline: selection.hasFormat('underline'),
        } 
        */

        if ($isCodeNode(targetNode)) newTextFormats.code = false

        setOnTextFormats(newTextFormats)
      })
    })
  }, [editor])

  const insertLinkHandler = () => {
    if (!onLink) {
      setIsLinkEditMode(true)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      setIsLinkEditMode(false)
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }

  const insertMemoHandler = () => {
    editor.update(() => {
      const root = $getRoot()
      const stickyNode = $createStickyNode(0, 0)
      root.append(stickyNode)
    })
  }

  return (
    <div className="flex space-x-3">
      {SupportedInlineTypes.map((inlineType) => {
        return (
          <button
            type="button"
            role="checkBox"
            title={inlineType}
            aria-label={inlineType}
            aria-checked={onTextFormats[inlineType]}
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, inlineType)}
            key={inlineType}
          >
            <ToolbarIcon
              svgId={`text-${inlineType}`}
              size={buttonSizes['md']}
              className={cls(
                'hover:text-bright-blue',
                onTextFormats[inlineType]
                  ? 'text-bright-blue'
                  : 'dark:text-dark-disabled-icon text-light-disabled-icon',
              )}
            />
          </button>
        )
      })}
      <button
        onClick={insertLinkHandler}
        aria-label="Insert Link"
        title={`Insert Link`}
        type="button"
      >
        <ToolbarIcon
          svgId={'link'}
          size={buttonSizes['md']}
          className={cls(
            'hover:text-bright-blue',
            onLink ? 'text-bright-blue' : 'dark:text-dark-disabled-icon text-light-disabled-icon',
          )}
        />
      </button>
      <button
        onClick={insertMemoHandler}
        aria-label="Stick Note"
        title={`Stick Note`}
        type="button"
      >
        <ToolbarIcon
          svgId={'sticky-note'}
          size={buttonSizes['md']}
          className={cls(
            'hover:text-bright-blue',
            onLink ? 'text-bright-blue' : 'dark:text-dark-disabled-icon text-light-disabled-icon',
          )}
        />
      </button>
    </div>
  )
}
