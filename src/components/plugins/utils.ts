import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  ElementNode,
  RangeSelection,
  TextNode,
} from 'lexical'
import { $setBlocksType, $isAtNodeEnd } from '@lexical/selection'
import { BlockType, HeadingNodeType, quoteNode } from '#/components/plugins/blockTypes'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $createCodeNode } from '@lexical/code'

/**
 * 파라미터로 받은 에디터에서 선택된 텍스트 블록을 paragraph로 변환
 *
 * @param {LexicalEditor} editor - Lexical 에디터 인스턴스
 * @example
 * formatParagraph(editor)
 */
export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

/**
 * 파라미터로 받은 에디터에서 선택된 텍스트 블록을 지정된 헤딩 노드 타입으로 변환하는 함수를 반환
 *
 * @param {LexicalEditor} editor - Lexical 에디터 인스턴스
 * @param {BlockType} selectedBlockType - 현재 선택된 블록 타입
 * @returns {(headingNodeType: HeadingNodeType) => void} - 헤딩 노드 타입을 인자로 받아 헤딩 노드 타입으로 블록을 변환하는 함수
 * @example
 * const formatHeading = createFormatHeading(editor, 'paragraph')
 * formatHeading('h1')
 */
export const createFormatHeading = (editor: LexicalEditor, selectedBlockType: BlockType) => {
  return (headingNodeType: HeadingNodeType) => {
    if (selectedBlockType !== headingNodeType) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingNodeType))
        }
      })
    } else {
      formatParagraph(editor)
    }
  }
}

/**
 * 파라미터로 받은 에디터에서 선택된 텍스트 블록을 지정된 쿼트 노드 타입으로 변환하는 함수를 반환
 *
 * @param {LexicalEditor} editor - Lexical 에디터 인스턴스
 * @param {BlockType} selectedBlockType - 현재 선택된 블록 타입
 * @returns {(headingNodeType: QuoteNodeType) => void} - 헤딩 노드 타입을 인자로 받아 쿼트 노드 타입으로 블록을 변환하는 함수
 * @example
 * const formatQuote = createFormatQuote(editor, 'paragraph')
 * formatQuote('h1')
 */
export const createFormatQuote = (editor: LexicalEditor, selectedBlockType: BlockType) => {
  return () => {
    if (selectedBlockType !== quoteNode) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    } else {
      formatParagraph(editor)
    }
  }
}

/**
 * 파라미터로 받은 에디터에서 선택된 텍스트 블록을 지정된 코드 노드 타입으로 변환하는 함수를 반환
 *
 * @param {LexicalEditor} editor - Lexical 에디터 인스턴스
 * @param {BlockType} selectedBlockType - 현재 선택된 블록 타입
 * @returns {(headingNodeType: QuoteNodeType) => void} - 헤딩 노드 타입을 인자로 받아 코드 노드 타입으로 블록을 변환하는 함수
 * @example
 * const formatQuote = createFormatQuote(editor, 'paragraph')
 * formatCode('h1')
 */
export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== 'code') {
    editor.update(() => {
      const selection = $getSelection()
      if (!selection) return
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode())
      } else {
        const textContent = selection.getTextContent()
        selection.insertText(textContent)
        $setBlocksType(selection, () => $createCodeNode())
      }
    })
  } else {
    formatParagraph(editor)
  }
}

/**
 * 주어진 선택 범위에서 선택된 노드를 반환
 * 선택이 역방향인지 여부에 따라 앵커 노드 또는 포커스 노드를 반환
 *
 * @param {RangeSelection} selection - 선택 범위 객체
 * @returns {TextNode | ElementNode} - 선택된 노드 (텍스트 노드 또는 요소 노드)
 */
export function getSelectedNode(selection: RangeSelection): TextNode | ElementNode {
  const anchor = selection.anchor
  const focus = selection.focus
  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  /*
  [노드 1의 끝] | [노드 2의 시작 부분...]
                |_____________|
               앵커          포커스

  위와 같이 사용자는 노드 2를 드래그한 것이지만
  이건 노드 1의 끝이기도 해서, 앵커는 노드 1이 선택됨.

  사용자가 무엇을 선택했는 지 정확히 알려면 이 상황에서는 포커스가 선택되어야함.

  역방향인 경우는 반대로 적용. 
  */

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
