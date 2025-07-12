import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $parseSerializedNode,
  $insertNodes,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  FORMAT_TEXT_COMMAND,
  HISTORIC_TAG,
  SELECTION_CHANGE_COMMAND,
  getDOMSelectionFromTarget,
  $createRangeSelection,
  $setSelection,
  $createTextNode,
  $getNodeByKey,
  SerializedTextNode,
  TextNode,
  RangeSelection,
  LexicalEditor,
} from 'lexical'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import { $isCodeNode } from '@lexical/code'
import { TOGGLE_LINK_COMMAND, $isLinkNode } from '@lexical/link'
import { cls, sanitizeUrl } from '#/libs/client/utils'
import { getHsvWithoutAlpha, getSelectedNode, tinycolor } from '#/lexical/plugins/utils'
import ColorPicker, { Hsv } from '#/lexical/components/ui/ColorPicker'
import { $patchStyleText } from '@lexical/selection'
import { mergeRegister } from '@lexical/utils'

declare global {
  interface Document {
    caretPositionFromPoint?(
      x: number,
      y: number,
    ): {
      offsetNode: Node
      offset: number
    } | null
  }
}

type SlicedNode = {
  serialized: SerializedTextNode
  originalKey: string
  isPartial: boolean
  startOffset: number
  endOffset: number
}

const SupportedInlineTypes = [
  'code',
  'bold',
  'italic',
  'strikethrough',
  'underline',
  'superscript',
  'subscript',
] as const

const ColorPickerDropdown = ({
  onChange,
  hsv,
  setHsv,
}: {
  onChange: (value: string, skipHistoryStack: boolean) => void
  hsv: Hsv
  setHsv: Dispatch<SetStateAction<Hsv>>
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsColorPickerOpen((p) => !p)
        }}
        aria-label="Color Picker"
        title={`Color Picker`}
        type="button"
        className="relative flex items-center"
      >
        <ToolbarIcon
          svgId={'color-picker'}
          size={buttonSizes['md']}
          className={cls(
            'hover:text-bright-blue',
            'dark:text-dark-disabled-icon text-light-disabled-icon',
          )}
        />
        <svg className="dark:text-dark-disabled-icon text-light-disabled-icon size-[12px]">
          <use href={`icons/toolbarButtons.svg#chevron-down`} />
        </svg>
      </button>
      {isColorPickerOpen && <ColorPicker onChange={onChange} hsv={hsv} setHsv={setHsv} />}
    </div>
  )
}

export default function InlineToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}) {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)

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
  const [hsv, setHsv] = useState<Hsv>({ h: 0, s: 0, v: 1 })

  useEffect(() => {
    return activeEditor.registerUpdateListener(({ editorState }) => {
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

        const node = getSelectedNode(selection) // 선택된 노드 중 첫 번째

        if ($isTextNode(node)) {
          const style = node.getStyle() // style은 string (ex: 'color: red; font-size: 12px')

          const match = style?.match(/color\s*:\s*([^;]+)/)
          const color = match?.[1]?.trim() // ex: 'red', '#ff0000', 'rgb(255,0,0)' 등

          if (!color) {
            return activeEditor.update(() => {
              const currentSelection = $getSelection()
              if ($isRangeSelection(currentSelection)) {
                const node = getSelectedNode(selection)

                // $patchStyleText(currentSelection, { color: '#ffffff' })
              }
            })
          }

          setHsv(getHsvWithoutAlpha(tinycolor(color).toHsv()))
        }
      })
    })
  }, [activeEditor])

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event)
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        (event, editor) => {
          return $onDrop(event, editor)
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
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

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection()

          if (selection !== null) {
            $patchStyleText(selection, styles)
          }
        },
        skipHistoryStack ? { tag: HISTORIC_TAG } : {},
      )
    },
    [activeEditor],
  )

  const colorChange = useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack)
    },
    [applyStyleText],
  )

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
      <ColorPickerDropdown onChange={colorChange} hsv={hsv} setHsv={setHsv} />
    </div>
  )
}

const $onDragStart = (event: DragEvent) => {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return false
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) return false

  const nodes = selection.getNodes().filter($isTextNode)

  const slicedNodes: SlicedNode[] = nodes.map((node) => {
    const { slicedText, endOffset, startOffset, isPartial } = $sliceTextNodeBySelection(
      node,
      selection,
    )

    const newNode = $createSlicedTextNode(node, slicedText)

    return {
      serialized: newNode.exportJSON(),
      originalKey: node.getKey(),
      isPartial,
      startOffset,
      endOffset,
    }
  })

  dataTransfer.setData('application/x-lexical-drag-text', JSON.stringify(slicedNodes))

  return true
}

const $onDrop = (event: DragEvent, editor: LexicalEditor) => {
  const selection = $getSelection()
  if (!$isRangeSelection(selection)) return false
  if (!$isTextNode(getSelectedNode(selection))) return false

  const json = event.dataTransfer?.getData('application/x-lexical-drag-text')
  if (!json) return false

  const serializedNodes: SlicedNode[] = JSON.parse(json)

  event.preventDefault()

  const range = getCaretRangeFromDropPoint(event)

  editor.update(() => {
    $applyDropNode(range, serializedNodes)
  })

  return true
}

const $sliceTextNodeBySelection = (node: TextNode, selection: RangeSelection) => {
  const text = node.getTextContent()
  const nodeKey = node.getKey()

  let slicedText = text
  let startOffset: number = 0
  let endOffset: number = text.length

  // 항상 뒤부터 잘라야함
  if (selection.isBackward()) {
    if (nodeKey === selection.anchor.key) {
      slicedText = slicedText.slice(0, selection.anchor.offset)
      endOffset = selection.anchor.offset
    }
    if (nodeKey === selection.focus.key) {
      slicedText = slicedText.slice(selection.focus.offset)
      startOffset = selection.focus.offset
    }
  } else {
    if (nodeKey === selection.focus.key) {
      slicedText = slicedText.slice(0, selection.focus.offset)
      endOffset = selection.focus.offset
    }
    if (nodeKey === selection.anchor.key) {
      slicedText = slicedText.slice(selection.anchor.offset)
      startOffset = selection.anchor.offset
    }
  }

  const isPartial = startOffset !== 0 || endOffset !== text.length

  return { slicedText, startOffset, endOffset, isPartial }
}

const $createSlicedTextNode = (node: TextNode, slicedText: string) => {
  const newNode = $createTextNode(slicedText)
  newNode.setStyle(node.getStyle())
  newNode.setFormat(node.getFormat())

  return newNode
}

const getCaretRangeFromDropPoint = (event: DragEvent) => {
  const domSelection = getDOMSelectionFromTarget(event.target)
  let range: Range | null = null

  // 크로스 브라우징
  if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(event.clientX, event.clientY)
    if (pos) {
      range = document.createRange()
      range.setStart(pos.offsetNode, pos.offset)
      range.collapse(true)
    }
  } else if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  }

  if (!range) {
    throw Error(`Cannot get the selection when dragging`)
  }

  return range
}

const $applyDropNode = (range: Range, serializedNodes: SlicedNode[]) => {
  $setDOMRangetoEditorSelection(range)

  serializedNodes.forEach($updateOriginalNode)
  const nodes = serializedNodes.map((node) => {
    return $parseSerializedNode(node.serialized)
  })

  $insertNodes(nodes)
}

const $setDOMRangetoEditorSelection = (range: Range) => {
  const selection = $createRangeSelection()
  if (range) selection.applyDOMRange(range)
  $setSelection(selection)
}

const $updateOriginalNode = (node: SlicedNode) => {
  const originalNode = $getNodeByKey(node.originalKey)
  if (originalNode && $isTextNode(originalNode)) {
    if (node.isPartial) {
      const text = originalNode.getTextContent()
      originalNode.setTextContent(text.slice(0, node.startOffset) + text.slice(node.endOffset))
    } else {
      originalNode.remove()
    }
  }
}
