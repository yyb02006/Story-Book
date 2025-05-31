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

export type InsertImagePayload = Readonly<ImagePayload>

type ImageData = { src: string; fileName: string; height: number; width: number }

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')

export function InsertImageUploadedDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}) {
  const [images, setImages] = useState<ImageData[]>([])

  const isDisabled = images.length === 0

  const loadImage = (files: FileList | null) => {
    if (files === null) return

    const fileArray = Array.from(files)
    const srcPromises = fileArray.map(
      (file) =>
        new Promise<ImageData>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              const img = new Image()
              const result = reader.result
              img.onload = () => {
                resolve({
                  src: result,
                  fileName: file.name,
                  width: img.width,
                  height: img.height,
                })
              }
              img.onerror = () => {
                reject(new Error('Failed to load image'))
              }
              img.src = result
            } else {
              reject(new Error('Failed to read file'))
            }
          }
          reader.onerror = () => {
            reject(new Error('Failed to read file'))
          }
          reader.readAsDataURL(file)
        }),
    )

    Promise.all(srcPromises)
      .then((results) => {
        setImages(results)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const onClick = (payloads: InsertImagePayload[]) => {
    payloads.forEach((payload) => {
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
    })
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
            <div className="pointer-events-none flex items-center gap-x-2">
              <span>파일 선택</span>
              <ToolbarIcon size={buttonSizes.lg} svgId={'add-file'} className="" />
            </div>
          ),
          className: '',
          id: 'File_Upload',
        }}
        onChange={loadImage}
        onFileDrop={handleFileDrop}
        accept="image/*"
        className="hidden"
      />
      {images.length > 0 ? (
        <ul className="font-S-CoreDream-400 space-y-2 text-sm">
          {images.map(({ fileName }) => (
            <li key={fileName} className="flex justify-between">
              {fileName}
              <button
                onClick={() => {
                  setImages((p) => p.filter((image) => image.fileName !== fileName))
                }}
              >
                <ToolbarIcon size={buttonSizes.xs} className="" svgId="cancel" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        disabled={isDisabled}
        onClick={() => {
          onClick(
            images.map(({ fileName, src, width, height }) => ({
              altText: fileName,
              src,
              maxWidth: contentAreaWidth,
              width: contentAreaWidth && width >= 500 ? 500 : width,
              height:
                contentAreaWidth && width >= 500 ? Math.round((height * 500) / width) : height,
            })),
          )
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
