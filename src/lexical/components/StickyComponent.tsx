/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { LexicalEditor, NodeKey } from 'lexical'
import type { JSX } from 'react'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LexicalNestedComposer } from '@lexical/react/LexicalNestedComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { calculateZoomLevel } from '@lexical/utils'
import { $getNodeByKey } from 'lexical'
import * as React from 'react'
import { useEffect, useLayoutEffect, useRef } from 'react'

import StickyEditorTheme from '../styles/stickyEditorTheme.css'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { $isStickyNode } from '../nodes/StickyNode'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { buttonSizes } from '#/lexical/components/Buttons/buttonTypes'
import { cls } from '#/libs/client/utils'

type Positioning = {
  isDragging: boolean
  offsetX: number
  offsetY: number
  rootElementRect: null | ClientRect
  x: number
  y: number
}

function positionSticky(stickyElem: HTMLElement, positioning: Positioning): void {
  const style = stickyElem.style
  const rootElementRect = positioning.rootElementRect
  const rectLeft = rootElementRect !== null ? rootElementRect.left : 0
  const rectTop = rootElementRect !== null ? rootElementRect.top : 0
  style.top = rectTop + positioning.y + 'px'
  style.left = rectLeft + positioning.x + 'px'
}

export default function StickyComponent({
  x,
  y,
  nodeKey,
  color,
  caption,
}: {
  caption: LexicalEditor
  color: 'pink' | 'yellow'
  nodeKey: NodeKey
  x: number
  y: number
}): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const stickyContainerRef = useRef<null | HTMLDivElement>(null)
  const positioningRef = useRef<Positioning>({
    isDragging: false,
    offsetX: 0,
    offsetY: 0,
    rootElementRect: null,
    x: 0,
    y: 0,
  })

  useEffect(() => {
    const position = positioningRef.current
    position.x = x
    position.y = y

    const stickyContainer = stickyContainerRef.current
    if (stickyContainer !== null) {
      positionSticky(stickyContainer, position)
    }
  }, [x, y])

  useLayoutEffect(() => {
    const position = positioningRef.current
    const resizeObserver = new ResizeObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const { target } = entry
        position.rootElementRect = target.getBoundingClientRect()
        const stickyContainer = stickyContainerRef.current
        if (stickyContainer !== null) {
          positionSticky(stickyContainer, position)
        }
      }
    })

    const removeRootListener = editor.registerRootListener((nextRootElem, prevRootElem) => {
      if (prevRootElem !== null) {
        resizeObserver.unobserve(prevRootElem)
      }
      if (nextRootElem !== null) {
        resizeObserver.observe(nextRootElem)
      }
    })

    /* ResizeObserver는 DOM 요소의 크기 변경을 감지하고
    window resize 이벤트 리스너는 브라우저 크기 변경을 감지하는데,
    페이지가 반응형으로 작동하더라도 반응형으로 만들어지지 않은 요소들의 경우( ex)지금 만드는 메모 요소 )
    감지할 수 없기 때문에 ResizeObserver로 요소의 크기 변경에 대비한 상대적인 메모의 위치와
    window resize로 브라우저의 크기 변경으로 인한 변경을 따로 관리해야 한다.
    
    그러나 미디어쿼리로 인한 DOM 크기 변화는 ResizeObserver로 감지가 안 될 가능성도 있다고 한다*/

    const handleWindowResize = () => {
      const rootElement = editor.getRootElement()
      console.log(rootElement?.getBoundingClientRect())

      const stickyContainer = stickyContainerRef.current
      if (rootElement !== null && stickyContainer !== null) {
        position.rootElementRect = rootElement.getBoundingClientRect()
        positionSticky(stickyContainer, position)
      }
    }

    window.addEventListener('resize', handleWindowResize)

    return () => {
      window.removeEventListener('resize', handleWindowResize)
      removeRootListener()
    }
  }, [editor])

  useEffect(() => {
    const stickyContainer = stickyContainerRef.current
    if (stickyContainer !== null) {
      // Delay adding transition so we don't trigger the
      // transition on load of the sticky.
      setTimeout(() => {
        stickyContainer.style.setProperty('transition', 'top 0.3s ease 0s, left 0.3s ease 0s')
      }, 500)
    }
  }, [])

  const handlePointerMove = (event: PointerEvent) => {
    const stickyContainer = stickyContainerRef.current
    const positioning = positioningRef.current
    const rootElementRect = positioning.rootElementRect
    const zoom = calculateZoomLevel(stickyContainer)
    if (stickyContainer !== null && positioning.isDragging && rootElementRect !== null) {
      positioning.x = event.pageX / zoom - positioning.offsetX - rootElementRect.left
      positioning.y = event.pageY / zoom - positioning.offsetY - rootElementRect.top
      positionSticky(stickyContainer, positioning)
    }
  }

  const handlePointerUp = (event: PointerEvent) => {
    const stickyContainer = stickyContainerRef.current
    const positioning = positioningRef.current
    if (stickyContainer !== null) {
      positioning.isDragging = false
      stickyContainer.classList.remove('dragging')
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if ($isStickyNode(node)) {
          node.setPosition(positioning.x, positioning.y)
        }
      })
    }
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  const handleDelete = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isStickyNode(node)) {
        node.remove()
      }
    })
  }

  const handleColorChange = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if ($isStickyNode(node)) {
        node.toggleColor()
      }
    })
  }

  return (
    <div ref={stickyContainerRef} className="sticky-note-container">
      <div
        className={`sticky-note ${color} sticky-cliped`}
        onPointerDown={(event) => {
          const stickyContainer = stickyContainerRef.current
          if (
            stickyContainer == null ||
            event.button === 2 ||
            event.target !== stickyContainer.firstChild
          ) {
            // Right click or click on editor should not work
            return
          }
          const stickContainer = stickyContainer
          const positioning = positioningRef.current
          if (stickContainer !== null) {
            const { top, left } = stickContainer.getBoundingClientRect()
            const zoom = calculateZoomLevel(stickContainer)
            positioning.offsetX = event.clientX / zoom - left
            positioning.offsetY = event.clientY / zoom - top
            positioning.isDragging = true
            stickContainer.classList.add('dragging')
            document.addEventListener('pointermove', handlePointerMove)
            document.addEventListener('pointerup', handlePointerUp)
            event.preventDefault()
          }
        }}
      >
        <div className="relative -top-4 -right-2 mb-4 w-full">
          <div className="float-right flex items-center justify-end">
            <button
              onClick={handleColorChange}
              className="cursor-pointer"
              aria-label="Change sticky note color"
              title="Color"
            >
              <ToolbarIcon
                svgId="color"
                size={buttonSizes['sm']}
                className="text-sky-blue hover:text-bright-blue"
              />
            </button>
            <button
              onClick={handleDelete}
              className="delete"
              aria-label="Delete sticky note"
              title="Delete"
            >
              <ToolbarIcon
                svgId="cancel"
                size={buttonSizes['md']}
                className="text-sky-blue hover:text-bright-blue"
              />
            </button>
          </div>
        </div>
        <LexicalNestedComposer initialEditor={caption} initialTheme={StickyEditorTheme}>
          <div className="relative">
            <PlainTextPlugin
              contentEditable={<ContentEditable className="StickyNode__contentEditable" />}
              placeholder={
                <div className="font-patrick-hand text-light-placeholder dark:text-dark-placeholder pointer-events-none absolute top-0 left-1">
                  Memo.
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </LexicalNestedComposer>
        <div
          className={cls(
            color === 'yellow' ? 'bg-[#e9d900]' : 'bg-[#c97baf]',
            'sticky-cliped absolute -right-1 -bottom-1 size-[26px] rounded-tl-[6px]',
          )}
        />
      </div>
    </div>
  )
}
