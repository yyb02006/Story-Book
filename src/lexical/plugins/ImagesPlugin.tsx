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
  $getNodeByKey,
  $getRoot,
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
  NodeKey,
} from 'lexical'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { $createImageNode, $isImageNode, ImageNode, ImagePayload } from '../nodes/ImageNode'
import { FileInput } from '#/components/Inputs/index'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import { supabase } from '#/libs/client/supabase'
import { cls } from '#/libs/client/utils'
import imageCompression from 'browser-image-compression'
import { forEachImageNodes } from '#/lexical/plugins/utils'

export type InsertImagePayload = Readonly<ImagePayload>

type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'failed'

interface ThumbnailPayload {
  nodeKey: NodeKey
  isThumbnail: boolean
  editor: LexicalEditor
}

export type EditorImageData = {
  id: string
  file: File
  previewSrc: string // Dialog에서 미리보기용 Base64 URL
  storageUrl: string | null // 스토리지 업로드 후 받을 영구 URL
  fileName: string
  width: number
  height: number
  uploadStatus: UploadStatus // 업로드 상태
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND')

export const INSERT_IMAGE_ARRAY_COMMAND: LexicalCommand<InsertImagePayload[]> = createCommand(
  'INSERT_IMAGE_ARRAY_COMMAND',
)

export const SET_THUMBNAIL_COMMAND: LexicalCommand<ThumbnailPayload> =
  createCommand('SET_THUMBNAIL_COMMAND')

async function uploadImageToSupabase(file: File, id: string) {
  const fileExtension = file.name.split('.').pop()
  const imagePath = `${id}-${file.lastModified}.${fileExtension}`
  const thumbnailImage = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 100,
    useWebWorker: true,
    fileType: 'image/jpeg',
  })
  // const { error } = await supabase.storage.from('temp-images').upload(contentImagePath, file)
  const [contentResult, thumbnailResult] = await Promise.all([
    supabase.storage.from('temp-images').upload(`content/${imagePath}`, file),
    supabase.storage.from('temp-images').upload(`thumbnail/${imagePath}`, thumbnailImage),
  ])
  const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
  if (contentResult.error || thumbnailResult.error) {
    throw new Error(
      `contentImageError: ${contentResult.error?.message || ''} thumbnailImageError:  ${thumbnailResult.error?.message || ''}`,
    )
  } else {
    return `https://${projectId}.supabase.co/storage/v1/object/public/temp-images/content/${imagePath}`
  }
}

const uploadStatusTag = (uploadStatus: UploadStatus) => {
  switch (uploadStatus) {
    case 'failed':
      return <div className="rounded-md border border-red-400 px-2 text-red-400">실패</div>
    case 'uploaded':
      return <div className="rounded-md border border-green-600 px-2 text-green-600">성공</div>
    default:
      return (
        <div className="border-white-gray text-white-gray rounded-md border px-2">업로드 중</div>
      )
  }
}

export function InsertImageUploadedDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor
  onClose: () => void
}) {
  const [images, setImages] = useState<EditorImageData[]>([])
  const [uploadButtonStatus, setUploadButtonStatus] = useState<
    '업로드중' | '업로드 불가' | '업로드' | null
  >(null)

  useEffect(() => {
    switch (true) {
      case images.length === 0:
        setUploadButtonStatus(null)
        break
      case images.some((image) => image.uploadStatus === 'uploading'):
        setUploadButtonStatus('업로드중')
        break
      case images.some((image) => image.uploadStatus === 'failed'):
        setUploadButtonStatus('업로드 불가')
        break
      default:
        setUploadButtonStatus('업로드')
        break
    }
  }, [images])

  const loadImage = (files: FileList | null) => {
    if (files === null) return

    const fileArray = Array.from(files)
    fileArray.forEach((file) => {
      const id = crypto.randomUUID()

      setImages((prev) => [
        ...prev,
        {
          id,
          file,
          previewSrc: '',
          storageUrl: null,
          fileName: file.name,
          height: 0,
          width: 0,
          uploadStatus: 'uploading',
        },
      ])

      const reader = new FileReader()

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const previewDataUrl = URL.createObjectURL(file)
          const img = new Image()
          img.onload = () => {
            setImages((prev) =>
              prev.map((item) =>
                item.id === id
                  ? { ...item, previewSrc: previewDataUrl, width: img.width, height: img.height }
                  : item,
              ),
            )
            URL.revokeObjectURL(previewDataUrl)
          }
          img.onerror = () => {
            console.error('Failed to load image for preview:', file.name)
            setImages((prev) =>
              prev.map((item) => (item.id === id ? { ...item, uploadStatus: 'failed' } : item)),
            )
            URL.revokeObjectURL(previewDataUrl)
          }
          img.src = previewDataUrl
        } else {
          console.error('Failed to read file as string:', file.name)
          setImages((prev) =>
            prev.map((item) => (item.id === id ? { ...item, uploadStatus: 'failed' } : item)),
          )
        }
      }
      reader.onerror = () => {
        console.error('FileReader error:', file.name)
        setImages((prev) =>
          prev.map((item) => (item.id === id ? { ...item, uploadStatus: 'failed' } : item)),
        )
      }
      reader.readAsDataURL(file)
      uploadImageToSupabase(file, id)
        .then((storageUrl) => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, storageUrl, uploadStatus: 'uploaded' } : item,
            ),
          )
        })
        .catch((err) => {
          console.log('Image upload to Supabase failed:', file.name, err)
          setImages((prev) =>
            prev.map((item) => (item.id === id ? { ...item, uploadStatus: 'failed' } : item)),
          )
        })
    })
  }

  const submitImages = (payloads: InsertImagePayload[]) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_ARRAY_COMMAND, payloads)
    onClose()
  }

  const contentAreaWidth = activeEditor.getRootElement()?.clientWidth

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      loadImage(files)
      event.dataTransfer.clearData()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    loadImage(e.target.files)
    e.target.value = ''
  }

  return (
    <div className="flex min-w-80 flex-col gap-y-4">
      <FileInput
        name="Image Upload"
        label={{
          children: (
            <div className="pointer-events-none flex items-center gap-x-2 py-20">
              <span>파일 선택</span>
              <ToolbarIcon size={buttonSizes.lg} svgId={'add-file'} className="" />
            </div>
          ),
          id: 'File_Upload',
        }}
        onChange={handleFileChange}
        onFileDrop={handleFileDrop}
        accept="image/*"
        className="hidden"
      />
      {images.length > 0 ? (
        <ul className="font-S-CoreDream-400 space-y-2 text-sm">
          {images.map(({ fileName, id, uploadStatus }) => (
            <li key={id} className="font-S-CoreDream-200 flex justify-between">
              <span>{fileName}</span>
              <div className="flex space-x-2">
                <span>{uploadStatusTag(uploadStatus)}</span>
                <button
                  onClick={() => {
                    setImages((p) => p.filter((image) => image.fileName !== fileName))
                  }}
                >
                  <ToolbarIcon size={buttonSizes.xs} svgId="cancel" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      <button
        disabled={images.length === 0 || images.some((img) => img.uploadStatus !== 'uploaded')}
        onClick={() => {
          if (images.some((img) => img.uploadStatus !== 'uploaded')) return
          submitImages(
            images.map<InsertImagePayload>(({ fileName, storageUrl, width, height, id, file }) => ({
              id,
              altText: fileName,
              src: URL.createObjectURL(file),
              maxWidth: contentAreaWidth,
              width: contentAreaWidth && width >= 500 ? 500 : width,
              height:
                contentAreaWidth && width >= 500 ? Math.round((height * 500) / width) : height,
              isThumbnail: false,
              storageUrl: storageUrl || '',
            })),
          )
        }}
        className={cls(
          uploadButtonStatus === '업로드' ? 'bg-bright-blue' : 'bg-charcoal-gray',
          'cursor-pointer rounded-md px-4 py-2',
        )}
      >
        {uploadButtonStatus === null ? '업로드' : uploadButtonStatus}
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
      editor.registerCommand<InsertImagePayload[]>(
        INSERT_IMAGE_ARRAY_COMMAND,
        (payloads) => {
          const imageNodes = payloads.map((payload) => {
            const imageNode = $createImageNode(payload)
            const paragraphNode = $createParagraphNode()
            return paragraphNode.append(imageNode)
          })

          $insertNodes(imageNodes)

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<ThumbnailPayload>(
        SET_THUMBNAIL_COMMAND,
        ({ nodeKey, isThumbnail, editor }) => {
          forEachImageNodes(editor, (node) => {
            const isCurrentImage = node.getKey() === nodeKey
            if (isThumbnail && !isCurrentImage) {
              node.setIsThumbnail(false)
            }
            if (node.getKey() === nodeKey) {
              node.setIsThumbnail(isThumbnail)
            }
          })
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
