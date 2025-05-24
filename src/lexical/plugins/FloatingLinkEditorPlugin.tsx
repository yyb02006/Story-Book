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
  getDOMSelection,
  KEY_ESCAPE_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { $findMatchingParent } from '@lexical/utils'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import { mergeRegister } from '@lexical/utils'
import { createPortal } from 'react-dom'
import { sanitizeUrl } from '#/libs/client/utils'
import ToolbarIcon from '#/lexical/components/Buttons/toolbarIcon'
import { getSelectedNode } from '#/lexical/plugins/utils'

/* function setFloatingElemPositionForLinkEditor(
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
} */

const setFloatingElemPositionForLinkEditor = (
  targetLinkNodeRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement,
  verticalGap: number = 10,
  horizontalOffset: number = 5,
) => {
  const scrollerElem = anchorElem.parentElement

  if (targetLinkNodeRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  // 링크 에디터
  const floatingElemRect = floatingElem.getBoundingClientRect()
  // 에디터 실제 컨텐츠가 작성된 영역
  const anchorElementRect = anchorElem.getBoundingClientRect()
  // 에디터 컨텐츠 박스 뷰 영역
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  // targeRect = 링크노드
  let left = targetLinkNodeRect.left - horizontalOffset

  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset
  }

  left -= anchorElementRect.left

  floatingElem.style.opacity = '1'
  floatingElem.style.transform = `translate(${left}px, ${verticalGap}px)`
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

      // 위의 setLinkUrl은 링크 노드로 이동할 때 한 번 실행되고, 이 때 링크노드의 url이 linkUrl에 할당된다.
      // 이 후 isLinkEditMode가 true가 되면서 한 번 더 실행되고, 아래 조건문이 실행되며 url이 할당된 linkUrl로 부터 값을 받을 수 있게 된다.
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
        // 위 조건문의 문제는, 링크 버튼 클릭으로 링크 생성시 selection(커서)가 사라지면서
        // rootElement에 nativeSelection이 포함되지 않게 되어
        // 값이 false가 되며 실행문이 작동하지 않아 브라우저 리사이징에 대응할 수 없게됨

        /* rootElement.contains(nativeSelection.anchorNode)
        위 조건을 제거 했더니 리사이징 시에 에디터 스타일이 예상대로 작동하지 않는다 why?
        이 실행문은 링크 셀렉션의 DOMRect값을 가져오는 것이 목적이다
        그러나 링크 에디터가 처음 생성될 때는 아래 구현된 focus동작 때문에 nativeSelection이 링크 에디터 요소를 가리킨다
        조건문을 보면 rootElement(메인 에디터) 내에 생성된 nativeSelection이 있어야 하지만
        링크 에디터는 rootElement 외부에 있는 요소이기 때문에 링크 에디터가 focus된 상태에서는 이 실행문이 작동하지 않고
        링크 에디터가 focus된 상태에서는 리사이징과 같은 이벤트에서 스타일의 업데이트가 불가능해진다.
        반면 저 조건을 지우면 어떤 nativeSelection도 가져올 수 있게 되어서 링크 에디터의 getBoundingClientRect를 가져와버리게 된다
        원래 링크 셀렉션의 DOMRect를 가져와서 넣어야 하는데 링크 에디터의 DOMRect를 가져와서 넣으니 스타일이 이상해진다 */

        // 링크가 겹칠 때도 해결할 수 있을까? 겹친 상태로는 링크 삽입이 안되게 하거나, 플레이그라운드에서도 해결 안 되어 있음

        // 아래와 같은 방법으로 셀렉션을 앞으로 긁었을 때도, 뒤로 긁었을 때도 작동하도록 만들어야 함
        domRect = selection.isBackward()
          ? nativeSelection.anchorNode?.parentElement?.getBoundingClientRect()
          : nativeSelection.focusNode?.parentElement?.getBoundingClientRect()
      } else if (isLinkEditMode && inputRef.current) {
        // 링크 에디터 생성 시 포커스 이동때문에 리사이징에 대응할 수 없었던 문제를 해결하는 조건문
        // inputRef.current가 존재하는 링크 에디터가 있다면, 최근 셀렉션에서 앵커노드를 가져와 domRect에 넣어준다
        // 여기서 링크 에디터는 링크 노드와 상호작용을 해야 생성되기 때문에 위 조건에서 최근 셀렉션은 항상 링크 노드 아래에 있다
        editor.getEditorState().read(() => {
          if ($isRangeSelection(lastSelection) && lastSelection._cachedNodes) {
            const node = lastSelection.anchor.getNode()
            const domElement = editor.getElementByKey(node.getKey())

            if (domElement) {
              domRect = domElement.getBoundingClientRect()
            }
          }
        })
      }

      if (domRect) {
        domRect.y += 20

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
  }, [editor, floatingAnchorElement, isLinkEditMode, linkUrl, setIsLinkEditMode, lastSelection])

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

  // 왜 이 코드가 필요하지?
  useEffect(() => {
    editor.getEditorState().read(() => {
      $updateLinkEditor()
    })
  }, [editor, $updateLinkEditor])

  // 링크 에디터 생성 시 자동으로 포커스(마우스 커서)를 에디터 인풋으로 옮겨주는 코드
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
      if (linkUrl !== '' && editedLinkUrl !== '') {
        editor.update(() => {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl))
        })
      }
      setEditedLinkUrl('https://')
      setIsLinkEditMode(false)
    }
  }

  return (
    <div ref={linkEditorRef} className="absolute w-[360px] rounded-2xl">
      {!isLink ? null : (
        <div className="border-gray bg-charcoal-gray shadow-smooth-gray dark:text-sky-blue text-bright-blue flex rounded-xl border px-3 py-2 shadow-lg/40">
          {isLinkEditMode ? (
            <>
              <input
                ref={inputRef}
                className="link-input bg-midnight-gray mr-2 grow rounded-lg px-3"
                value={editedLinkUrl}
                onChange={(event) => {
                  setEditedLinkUrl(event.target.value)
                }}
                onKeyDown={(event) => {
                  monitorInputInteraction(event)
                }}
              />
              <div className="flex">
                <button
                  className="flex size-10 items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}
                  onClick={() => {
                    setIsLinkEditMode(false)
                  }}
                >
                  <ToolbarIcon
                    size="size-[24px]"
                    svgId="cancel"
                    className="dark:text-dark-disabled-icon text-light-disabled-icon hover:text-bright-blue"
                  />
                </button>
                <button
                  className="flex size-10 items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}
                  onClick={handleLinkSubmission}
                >
                  <ToolbarIcon
                    size="size-[24px]"
                    svgId="confirm"
                    className="dark:text-dark-disabled-icon text-light-disabled-icon hover:text-bright-blue"
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="flex w-full justify-between py-1">
              <a
                href={sanitizeUrl(linkUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2"
              >
                {linkUrl}
              </a>
              <div className="flex">
                <div
                  className="link-edit flex w-10 items-center justify-center"
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
                  <ToolbarIcon
                    size="size-[24px]"
                    svgId="write"
                    className="dark:text-dark-disabled-icon text-light-disabled-icon hover:text-bright-blue"
                  />
                </div>
                <div
                  className="link-trash flex w-10 items-center justify-center"
                  role="button"
                  tabIndex={0}
                  onMouseDown={(event) => {
                    event.preventDefault()
                  }}
                  onClick={() => {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
                  }}
                >
                  <ToolbarIcon
                    size="size-[24px]"
                    svgId="delete"
                    className="dark:text-dark-disabled-icon text-light-disabled-icon hover:text-rose-400"
                  />
                </div>
              </div>
            </div>
          )}
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
