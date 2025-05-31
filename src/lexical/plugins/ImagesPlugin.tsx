/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils'
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  getDOMSelectionFromTarget,
  isHTMLElement,
  LexicalCommand,
  LexicalEditor,
} from 'lexical'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '../nodes/ImageNode'
import FileInput from '#/components/Inputs/fileInput'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import { TextInput } from '#/components/Inputs'

export type InsertImagePayload = Readonly<ImagePayload>

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')

export function InsertImageUploadedDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}) {
  const [src, setSrc] = useState('')
  const [altText, setAltText] = useState('')
  const [fileNames, setFileNames] = useState<string[]>([])

  const isDisabled = src === ''

  const loadImage = (files: FileList | null) => {
    const reader = new FileReader()
    if (files === null) return
    reader.onload = function () {
      if (typeof reader.result === 'string') {
        setSrc(reader.result)
      }
      return ''
    }
    // onload 이벤트 트리거를 위한 read
    reader.readAsDataURL(files[0])
    setFileNames(Array.from(files).map((file) => file.name))
  }

  // 어차피 dispatch는 src, altText로부터 받아서 넣으니까 이미지 삭제 시에도
  // input의 value를 바꾸는 게 아니라 받아놓은 데이터의 상태만 만지면 됨
  // 여러장의 이미지를 처리할 때는 forEach같은 걸로 ㄱㄱ
  const onClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    onClose()
  }

  const contentAreaWidth = activeEditor.getRootElement()?.clientWidth

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      loadImage(files)
    }
  }

  return (
    <div className="flex min-w-60 flex-col gap-y-4">
      <FileInput
        name="Image Upload"
        label={{
          children: (
            <div className="flex items-center gap-x-2">
              <span>파일 선택</span>
              <ToolbarIcon size={buttonSizes.lg} svgId={'add-file'} className="" />
            </div>
          ),
          className:
            'cursor-pointer bg-charcoal-gray rounded-md py-12 text-sm flex justify-center items-center hover:text-bright-blue dark:text-dark-disabled-icon text-light-disabled-icon hover:ring-2',
          id: 'File_Upload',
        }}
        onChange={loadImage}
        onFileDrop={handleFileDrop}
        accept="image/*"
        className="hidden"
      />
      {fileNames.length > 0 ? (
        <ul className="font-S-CoreDream-400 text-sm">
          {fileNames.map((fileName) => (
            <li key={fileName}>{fileName}</li>
          ))}
        </ul>
      ) : null}
      <TextInput
        name="description"
        value={altText}
        onChange={(value) => {
          setAltText(value)
        }}
        placeholder="출처란에 표시될 설명"
        className="bg-charcoal-gray font-S-CoreDream-400 placeholder:font-S-CoreDream-400 rounded-md p-2 text-sm"
      />
      <button
        disabled={isDisabled}
        onClick={() => {
          onClick({
            altText,
            src,
            maxWidth: contentAreaWidth,
            width: contentAreaWidth && contentAreaWidth >= 500 ? 500 : contentAreaWidth,
          })
        }}
        className="bg-bright-blue cursor-pointer rounded-md px-4 py-2"
      >
        업로드
      </button>
    </div>
  )
}

export default function ImagesPlugin({
  captionsEnabled,
}: {
  captionsEnabled?: boolean
}): JSX.Element | null {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor')
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload)
          $insertNodes([imageNode])

          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd()
          }

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return $onDragStart(event)
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return $onDragover(event)
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return $onDrop(event, editor)
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [captionsEnabled, editor])

  return null
}

let img: HTMLImageElement

if (typeof window !== 'undefined') {
  const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
  img = document.createElement('img')
  img.src = TRANSPARENT_IMAGE
}

function $onDragStart(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }
  const dataTransfer = event.dataTransfer
  if (!dataTransfer) {
    return false
  }
  dataTransfer.setData('text/plain', '_')
  dataTransfer.setDragImage(img, 0, 0)
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  )

  return true
}

function $onDragover(event: DragEvent): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }
  if (!canDropImage(event)) {
    event.preventDefault()
  }
  return true
}

function $onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = $getImageNodeInSelection()
  if (!node) {
    return false
  }
  const data = getDragImageData(event)
  if (!data) {
    return false
  }
  event.preventDefault()
  if (canDropImage(event)) {
    const range = getDragSelection(event)
    node.remove()
    const rangeSelection = $createRangeSelection()
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range)
    }
    $setSelection(rangeSelection)
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data)
  }
  return true
}

function $getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection()
  if (!$isNodeSelection(selection)) {
    return null
  }
  const nodes = selection.getNodes()
  const node = nodes[0]
  return $isImageNode(node) ? node : null
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag')
  if (!dragData) {
    return null
  }
  const { type, data } = JSON.parse(dragData)
  if (type !== 'image') {
    return null
  }

  return data
}

declare global {
  interface DragEvent {
    rangeOffset?: number
    rangeParent?: Node
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target
  return !!(
    isHTMLElement(target) &&
    !target.closest('code, span.editor-image') &&
    isHTMLElement(target.parentElement) &&
    target.parentElement.closest('div.ContentEditable__root')
  )
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range
  const domSelection = getDOMSelectionFromTarget(event.target)
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY)
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0)
    range = domSelection.getRangeAt(0)
  } else {
    throw Error(`Cannot get the selection when dragging`)
  }

  return range
}
