import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isLineBreakNode,
  $isNodeSelection,
  $isRangeSelection,
  BaseSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  ElementNode,
  getDOMSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
  TextNode,
} from 'lexical'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { $findMatchingParent } from '@lexical/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { mergeRegister } from '@lexical/utils'
import { createPortal } from 'react-dom'
import { $isAtNodeEnd } from '@lexical/selection'
import { sanitizeUrl } from '#/libs/client/utils'

function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  // 앵커와 포커스가 같은 노드에 있는 경우, 해당 노드 반환
  if (anchorNode === focusNode) {
    return anchorNode
  }

  // 선택이 역방향인지 확인
  const isBackward = selection.isBackward()

  // 역방향 선택인 경우
  if (isBackward) {
    // 포커스가 노드 끝에 있으면 앵커 노드 반환, 그렇지 않으면 포커스 노드 반환
    return $isAtNodeEnd(focus) ? anchorNode : focusNode
  } else {
    // 정방향 선택인 경우
    // 앵커가 노드 끝에 있으면 앵커 노드 반환, 그렇지 않으면 포커스 노드 반환
    return $isAtNodeEnd(anchor) ? anchorNode : focusNode
  }
}

function setFloatingElemPositionForLinkEditor(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = 10,
  horizontalOffset: number = 5,
): void {
  const scrollerElem = anchorElem.parentElement

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  // 링크 에디터
  const floatingElemRect = floatingElem.getBoundingClientRect()
  // 에디터 (콘텐츠 영역 크기)
  const anchorElementRect = anchorElem.getBoundingClientRect()
  // 에디터 전체 영역
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  // targeRect = 링크노드
  let top = targetRect.top - verticalGap
  let left = targetRect.left - horizontalOffset

  if (top < editorScrollerRect.top) {
    top += floatingElemRect.height + targetRect.height + verticalGap * 2
  }

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
  }

  top -= anchorElementRect.top
  left -= anchorElementRect.left

  floatingElem.style.opacity = '1'
  floatingElem.style.transform = `translate(${left}px, ${top}px)`
}

function FloatingLinkEditor({
  editor,
  floatingAnchorElement,
  isLink,
  setIsLink,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  editor: LexicalEditor
  floatingAnchorElement: HTMLElement
  isLink: boolean
  setIsLink: Dispatch<SetStateAction<boolean>>
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}) {
  const linkEditorRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [linkUrl, setLinkUrl] = useState('')
  const [editedLinkUrl, setEditedLinkUrl] = useState('https://')
  const [lastSelection, setLastSelection] = useState<BaseSelection | null>(null)
  /*   const editorElem = editorRef.current
  const nativeSelection = getDOMSelection(editor._window)
  const activeElement = document.activeElement */
  const $updateLinkEditor = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = getSelectedNode(selection)
      const parentLinkNode = $findMatchingParent(anchorNode, $isLinkNode)

      if (parentLinkNode) {
        setLinkUrl(parentLinkNode.getURL())
      } else if ($isLinkNode(anchorNode)) {
        setLinkUrl(anchorNode.getURL())
      } else {
        setLinkUrl('')
      }

      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    } else if ($isNodeSelection(selection)) {
      const nodes = selection.getNodes()

      if (nodes.length === 0) return

      const node = nodes[0]
      const parent = node.getParent()
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL())
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL())
      } else {
        setLinkUrl('')
      }
      if (isLinkEditMode) {
        setEditedLinkUrl(linkUrl)
      }
    }

    const editorElem = linkEditorRef.current
    const nativeSelection = getDOMSelection(editor._window)
    const activeElement = document.activeElement

    if (editorElem === null) return

    const rootElement = editor.getRootElement()

    if (selection !== null && rootElement !== null && editor.isEditable()) {
      let domRect: DOMRect | undefined

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes()

        if (nodes.length > 0) {
          const element = editor.getElementByKey(nodes[0].getKey())
          if (element) {
            domRect = element.getBoundingClientRect()
          }
        }
      } else if (nativeSelection !== null && rootElement.contains(nativeSelection.anchorNode)) {
        // 링크가 겹칠 때도 해결할 수 있을까? 겹친 상태로는 링크 삽입이 안되게 하거나, 플레이그라운드에서도 해결 안 되어 있음
        domRect = selection.isBackward()
          ? nativeSelection.anchorNode?.parentElement?.getBoundingClientRect()
          : nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
        // 여기서 link 버튼을 클릭해도 여전히 전체 노드를 할당하기 때문에 링크 에디터가 맨 왼쪽에 가있게 됨
        // 그 후 실제 링크노드를 클릭하면 그때서야 linknode를 선택했다고 판단되어 제대로 된 위치에 링크 에디터가 생성됨

        // 정확한 원인은 111111111111111111222에서 222만 링크노드로 만들 때, 뒤에서 앞으로 드래그를 긁으면
        // focusNode가 1과 2사이에서 111111111111111111을 가리키기 때문에 앞 111111111111111111의 getBoundingClientRect를 가져와버린다
        console.log(nativeSelection.focusNode)
      }

      if (domRect) {
        domRect.y += 40
        setFloatingElemPositionForLinkEditor(domRect, editorElem, floatingAnchorElement)
      }
      setLastSelection(selection)
    } else if (!activeElement || activeElement.className !== 'link-input') {
      if (rootElement !== null) {
        setFloatingElemPositionForLinkEditor(null, editorElem, floatingAnchorElement)
      }
      setLastSelection(null)
      setIsLinkEditMode(false)
      setLinkUrl('')
    }
  }, [editor, floatingAnchorElement, isLinkEditMode, linkUrl, setIsLinkEditMode])

  useEffect(() => {
    const scrollerElem = floatingAnchorElement.parentElement

    const update = () => {
      editor.getEditorState().read(() => {
        $updateLinkEditor()
      })
    }

    window.addEventListener('resize', update)

    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update)
    }

    return () => {
      window.removeEventListener('resize', update)

      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update)
      }
    }
  }, [floatingAnchorElement.parentElement, editor, $updateLinkEditor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateLinkEditor()
        })
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateLinkEditor()
          return true
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          if (isLink) {
            setIsLink(false)
            return true
          }
          return false
        },
        COMMAND_PRIORITY_HIGH,
      ),
    )
  }, [editor, $updateLinkEditor, setIsLink, isLink])

  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLinkEditMode, isLink])

  const monitorInputInteraction = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLinkSubmission(event)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      setIsLinkEditMode(false)
    }
  }

  const handleLinkSubmission = (
    event: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>,
  ) => {
    event.preventDefault()
    if (lastSelection !== null) {
      if (linkUrl !== '') {
        editor.update(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl))
        })
      }
      setEditedLinkUrl('https://')
      setIsLinkEditMode(false)
    }
  }

  return (
    <div ref={linkEditorRef} className="absolute flex w-fit bg-amber-400 p-5">
      {!isLink ? null : isLinkEditMode ? (
        <>
          <input
            ref={inputRef}
            className="link-input"
            value={editedLinkUrl}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value)
            }}
            onKeyDown={(event) => {
              monitorInputInteraction(event)
            }}
          />
          <div className="flex">
            <div
              className="size-10 bg-pink-400"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={() => {
                setIsLinkEditMode(false)
              }}
            >
              취소
            </div>

            <div
              className="size-10 bg-sky-500"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => {
                event.preventDefault()
              }}
              onClick={handleLinkSubmission}
            >
              등록
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-fit bg-amber-400">
          <a href={sanitizeUrl(linkUrl)} target="_blank" rel="noopener noreferrer">
            {linkUrl}
          </a>
          <div
            className="link-edit"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onClick={(event) => {
              event.preventDefault()
              setEditedLinkUrl(linkUrl)
              setIsLinkEditMode(true)
            }}
          >
            수정
          </div>
          <div
            className="link-trash"
            role="button"
            tabIndex={0}
            onMouseDown={(event) => {
              event.preventDefault()
            }}
            onClick={() => {
              editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
            }}
          >
            삭제
          </div>
        </div>
      )}
    </div>
  )
}

function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  floatingAnchorElement: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>,
): JSX.Element | null {
  // FloatingLinkEditor는 입력 필드가 Editor와 다르기 때문에 독립적인 Editor 인스턴스를 가져야 한다
  const [activeEditor, setActiveEditor] = useState(editor)
  const [isLink, setIsLink] = useState(false)

  useEffect(() => {
    function $updateToolbar() {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const focusNode = getSelectedNode(selection)
        const focusLinkNode = $findMatchingParent(focusNode, $isLinkNode)
        if (!focusLinkNode) {
          setIsLink(false)
          return
        }
        const badNode = selection
          .getNodes()
          .filter((node) => !$isLineBreakNode(node))
          .find((node) => {
            const linkNode = $findMatchingParent(node, $isLinkNode)
            return (
              /* 선택된 노드들 중 부모가 focusLinkNode가 아닌 것이 있으면 true 반환 */
              (focusLinkNode && !focusLinkNode.is(linkNode)) ||
              /* 선택된 노드들 중 부모 Link노드가 있으면서 그게 focusLinkNode가 아니라면 true 반환 */
              // 그런데 위 조건과 아래 조건이 서로 다르게 나올 수 있나?
              // 여기까지 왔으면 이미 !focusLinkNode.is(linkNode)에서
              // 선택된 노드의 부모와 focusLinkNode가 서로 같다고 판단이 된 건데?
              (linkNode && !linkNode.is(focusLinkNode))
              /* focusLinkNode !== linkNode 이거와 같은 의미이기 때문에 교체 고려 */
            )
          })
        if (!badNode) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      } else if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes()
        if (nodes.length === 0) {
          setIsLink(false)
          return
        }
        const node = nodes[0]
        const parent = node.getParent()
        if ($isLinkNode(parent) || $isLinkNode(node)) {
          setIsLink(true)
        } else {
          setIsLink(false)
        }
      }
    }
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar()
          setActiveEditor(newEditor)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection)
            const linkNode = $findMatchingParent(node, $isLinkNode)
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank')
              return true
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW,
      ),
    )
  }, [editor])

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      floatingAnchorElement={floatingAnchorElement}
      setIsLink={setIsLink}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    floatingAnchorElement,
  )
}

export default function FloatingLinkEditorPlugin({
  floatingAnchorElement,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  floatingAnchorElement: HTMLElement
  isLinkEditMode: boolean
  setIsLinkEditMode: Dispatch<SetStateAction<boolean>>
}) {
  const [editor] = useLexicalComposerContext()
  return useFloatingLinkEditorToolbar(
    editor,
    floatingAnchorElement,
    isLinkEditMode,
    setIsLinkEditMode,
  )
}
