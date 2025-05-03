import { buttonSizes } from '#/components/plugins/Buttons/buttonTypes'
import ToolbarIcon from '#/components/plugins/Buttons/toolbarIcon'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { useEffect, useMemo, useState } from 'react'
import { $isCodeNode } from '@lexical/code'

const SupportedInlineTypes = [
  'code',
  'bold',
  'italic',
  'strikethrough',
  'underline',
  'superscript',
  'subscript',
] as const

export default function InlineToolbarPlugin() {
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

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()

        if (!$isRangeSelection(selection)) return

        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()

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
              className={
                onTextFormats[inlineType]
                  ? 'text-bright-blue'
                  : 'dark:text-dark-disabled-icon text-light-disabled-icon'
              }
            />
          </button>
        )
      })}
    </div>
  )
}
