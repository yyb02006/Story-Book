/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { BaseSelection, LexicalCommand, LexicalEditor, NodeKey } from 'lexical'
import type { JSX } from 'react'

import '../styles/ImageNode.css'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { useLexicalEditable } from '@lexical/react/useLexicalEditable'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { mergeRegister } from '@lexical/utils'
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGSTART_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import * as React from 'react'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { $isImageNode } from '#/lexical/nodes/ImageNode'
import NextImage from 'next/image'
import ImageResizer from '#/lexical/components/ImageResizer'
import { cls } from '#/libs/client/utils'
import { SET_THUMBNAIL_COMMAND } from '#/lexical/plugins/ImagesPlugin'

const imageCache = new Map<string, Promise<boolean> | boolean>()

export const RIGHT_CLICK_IMAGE_COMMAND: LexicalCommand<MouseEvent> = createCommand(
  'RIGHT_CLICK_IMAGE_COMMAND',
)

function useSuspenseImage(src: string) {
  let cached = imageCache.get(src)
  if (typeof cached === 'boolean') {
    return cached
  } else if (!cached) {
    cached = new Promise<boolean>((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(false)
      img.onerror = () => resolve(true)
    }).then((hasError) => {
      imageCache.set(src, hasError)
      return hasError
    })
    imageCache.set(src, cached)
    throw cached
  }
  throw cached
}

function isSVG(src: string): boolean {
  return src.toLowerCase().endsWith('.svg')
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
  onError,
}: {
  altText: string
  className: string | null
  height: 'inherit' | number
  imageRef: { current: null | HTMLImageElement }
  maxWidth: number
  src: string
  width: 'inherit' | number
  onError: () => void
}): JSX.Element {
  const [dimensions, setDimensions] = useState<{
    width: number
    height: number
  } | null>(null)
  const isSVGImage = isSVG(src)
  const [loading, setLoading] = useState(true)

  // Set initial dimensions for SVG images
  useEffect(() => {
    if (imageRef.current && isSVGImage) {
      const { naturalWidth, naturalHeight } = imageRef.current
      setDimensions({
        height: naturalHeight,
        width: naturalWidth,
      })
    }
  }, [imageRef, isSVGImage])

  const hasError = useSuspenseImage(src)

  useEffect(() => {
    if (hasError) {
      onError()
    }
  }, [hasError, onError])

  if (hasError) {
    return <BrokenImage />
  }

  // Calculate final dimensions with proper scaling
  const calculateDimensions = () => {
    if (!isSVGImage) {
      return {
        height,
        maxWidth,
        width,
      }
    }

    // Use natural dimensions if available, otherwise fallback to defaults
    const naturalWidth = dimensions?.width || 200
    const naturalHeight = dimensions?.height || 200

    let finalWidth = naturalWidth
    let finalHeight = naturalHeight

    // Scale down if width exceeds maxWidth while maintaining aspect ratio
    if (finalWidth > maxWidth) {
      const scale = maxWidth / finalWidth
      finalWidth = maxWidth
      finalHeight = Math.round(finalHeight * scale)
    }

    // Scale down if height exceeds maxHeight while maintaining aspect ratio
    const maxHeight = 500
    if (finalHeight > maxHeight) {
      const scale = maxHeight / finalHeight
      finalHeight = maxHeight
      finalWidth = Math.round(finalWidth * scale)
    }

    return {
      height: finalHeight,
      maxWidth,
      width: finalWidth,
    }
  }

  const imageStyle = calculateDimensions()

  return (
    <>
      {loading && (
        <div
          style={{ width, height }}
          className="bg-charcoal-gray/50 absolute flex items-center justify-center rounded-md"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-transparent" />
        </div>
      )}
      <NextImage
        className={className || undefined}
        src={src}
        alt={altText}
        ref={imageRef}
        width={typeof imageStyle.width === 'number' ? imageStyle.width : 200}
        height={typeof imageStyle.height === 'number' ? imageStyle.height : 200}
        style={imageStyle}
        onError={onError}
        draggable="false"
        onLoad={(e) => {
          if (isSVGImage) {
            const img = e.currentTarget
            setDimensions({
              height: img.naturalHeight,
              width: img.naturalWidth,
            })
          }
          setLoading(false)
        }}
      />
    </>
  )
}

function BrokenImage(): JSX.Element {
  return (
    <div>Broken</div>
    // <NextImage
    //   src={brokenImage}
    //   style={{
    //     height: 200,
    //     opacity: 0.2,
    //     width: 200,
    //   }}
    //   draggable="false"
    //   alt="Broken image"
    // />
  )
}

export default function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
  captionsEnabled,
  isThumbnail,
}: {
  altText: string
  caption: LexicalEditor
  height: 'inherit' | number
  maxWidth: number
  nodeKey: NodeKey
  resizable: boolean
  showCaption: boolean
  src: string
  width: 'inherit' | number
  captionsEnabled: boolean
  isThumbnail: boolean
}): JSX.Element {
  const imageRef = useRef<null | HTMLImageElement>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey)
  const [isResizing, setIsResizing] = useState<boolean>(false)
  const [editor] = useLexicalComposerContext()
  const [selection, setSelection] = useState<BaseSelection | null>(null)
  const activeEditorRef = useRef<LexicalEditor | null>(null)
  const [isLoadError, setIsLoadError] = useState<boolean>(false)
  const isEditable = useLexicalEditable()
  const [isHovered, setIsHovered] = useState(false)

  const $onEnter = useCallback(
    (event: KeyboardEvent) => {
      const latestSelection = $getSelection()
      const buttonElem = buttonRef.current
      if (
        isSelected &&
        $isNodeSelection(latestSelection) &&
        latestSelection.getNodes().length === 1
      ) {
        if (showCaption) {
          // Move focus into nested editor
          $setSelection(null)
          event.preventDefault()
          caption.focus()
          return true
        } else if (buttonElem !== null && buttonElem !== document.activeElement) {
          event.preventDefault()
          buttonElem.focus()
          return true
        }
      }
      return false
    },
    [caption, isSelected, showCaption],
  )

  const $onEscape = useCallback(
    (event: KeyboardEvent) => {
      if (activeEditorRef.current === caption || buttonRef.current === event.target) {
        $setSelection(null)
        editor.update(() => {
          setSelected(true)
          const parentRootElement = editor.getRootElement()
          if (parentRootElement !== null) {
            parentRootElement.focus()
          }
        })
        return true
      }
      return false
    },
    [caption, editor, setSelected],
  )

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload

      if (isResizing) {
        return true
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected)
        } else {
          clearSelection()
          setSelected(true)
        }
        return true
      }

      return false
    },
    [isResizing, isSelected, setSelected, clearSelection],
  )

  const onRightClick = useCallback(
    (event: MouseEvent): void => {
      editor.getEditorState().read(() => {
        const latestSelection = $getSelection()
        const domElement = event.target as HTMLElement
        if (
          domElement.tagName === 'IMG' &&
          $isRangeSelection(latestSelection) &&
          latestSelection.getNodes().length === 1
        ) {
          editor.dispatchCommand(RIGHT_CLICK_IMAGE_COMMAND, event as MouseEvent)
        }
      })
    },
    [editor],
  )

  useEffect(() => {
    const rootElement = editor.getRootElement()
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        const updatedSelection = editorState.read(() => $getSelection())
        if ($isNodeSelection(updatedSelection)) {
          setSelection(updatedSelection)
        } else {
          setSelection(null)
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<MouseEvent>(CLICK_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand<MouseEvent>(RIGHT_CLICK_IMAGE_COMMAND, onClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault()
            return true
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_ENTER_COMMAND, $onEnter, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_ESCAPE_COMMAND, $onEscape, COMMAND_PRIORITY_LOW),
    )

    rootElement?.addEventListener('contextmenu', onRightClick)

    return () => {
      unregister()
      rootElement?.removeEventListener('contextmenu', onRightClick)
    }
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    $onEnter,
    $onEscape,
    onClick,
    onRightClick,
    setSelected,
  ])

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setShowCaption(true)
      }
    })
  }

  const onResizeEnd = (nextWidth: 'inherit' | number, nextHeight: 'inherit' | number) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false)
    }, 200)

    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight)
      }
    })
  }

  const onResizeStart = () => {
    setIsResizing(true)
  }

  const setThumbnail = (isThumbnail: boolean) => {
    editor.dispatchCommand(SET_THUMBNAIL_COMMAND, { nodeKey, isThumbnail, editor })
  }

  const draggable = isSelected && $isNodeSelection(selection) && !isResizing
  const isFocused = (isSelected || isResizing) && isEditable

  return (
    <Suspense
      fallback={
        <div
          style={{ width, height }}
          className="bg-charcoal-gray/50 flex items-center justify-center rounded-md"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-4 border-gray-200 border-t-transparent" />
        </div>
      }
    >
      <>
        <div draggable={draggable}>
          {isLoadError ? (
            <BrokenImage />
          ) : (
            <div
              className="relative z-1"
              onMouseEnter={() => {
                setIsHovered(true)
              }}
              onMouseLeave={() => {
                setIsHovered(false)
              }}
            >
              <LazyImage
                className={cls(
                  isFocused
                    ? `ring-bright-blue ring-2 ${$isNodeSelection(selection) ? 'cursor-grab active:cursor-grabbing' : ''}`
                    : 'cursor-pointer',
                )}
                src={src}
                altText={altText}
                imageRef={imageRef}
                width={width}
                height={height}
                maxWidth={maxWidth}
                onError={() => setIsLoadError(true)}
              />
              {resizable && $isNodeSelection(selection) && isFocused && (
                <ImageResizer
                  showCaption={showCaption}
                  setShowCaption={setShowCaption}
                  editor={editor}
                  buttonRef={buttonRef}
                  imageRef={imageRef}
                  maxWidth={maxWidth}
                  onResizeStart={onResizeStart}
                  onResizeEnd={onResizeEnd}
                  captionsEnabled={!isLoadError && captionsEnabled}
                />
              )}
              {(isHovered || isThumbnail) && (
                <button
                  onClick={() => {
                    setThumbnail(!isThumbnail)
                  }}
                  className={cls(
                    isThumbnail
                      ? 'bg-bright-blue/60'
                      : 'bg-charcoal-gray/60 border-white-gray hover:border-bright-blue border',
                    'font-S-CoreDream-200 absolute top-3 left-1/2 -translate-x-1/2 rounded-md px-3 py-2 text-xs',
                  )}
                >
                  {isThumbnail ? '썸네일' : '썸네일로 설정'}
                </button>
              )}
            </div>
          )}
        </div>
        {showCaption && (
          <div className="relative my-1 w-full text-xs">
            <LexicalNestedComposer initialEditor={caption}>
              <AutoFocusPlugin />
              <LinkPlugin />
              <HashtagPlugin />
              <RichTextPlugin
                contentEditable={
                  <div>
                    <ContentEditable className="text-light-placeholder dark:text-dark-placeholder cursor-text" />
                  </div>
                }
                placeholder={
                  <div className="font-S-CoreDream-200 text-light-placeholder dark:text-dark-placeholder pointer-events-none absolute top-0 left-1 text-xs">
                    캡션을 입력해주세요
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalNestedComposer>
          </div>
        )}
      </>
    </Suspense>
  )
}
