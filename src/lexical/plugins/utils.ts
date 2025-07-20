import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
  ElementNode,
  RangeSelection,
  TextNode,
  $getRoot,
  LexicalNode,
  $isElementNode,
} from 'lexical'
import { $setBlocksType, $isAtNodeEnd } from '@lexical/selection'
import { BlockType, HeadingNodeType, quoteNode } from '#/lexical/plugins/blockTypes'
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text'
import { $isImageNode, ImageNode } from '#/lexical/nodes/ImageNode'
import { ColorInput, TinyColor } from '@ctrl/tinycolor'
import { $createExtendedCodeNode } from '#/lexical/nodes/extendedCodeNode'

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
        $setBlocksType(selection, () => $createExtendedCodeNode())
      } else {
        const textContent = selection.getTextContent()
        selection.insertText(textContent)
        $setBlocksType(selection, () => $createExtendedCodeNode())
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

/**
 * 현재 Lexical 에디터 문서 내의 모든 ImageNode 인스턴스를 찾아 반환
 *
 * 이 함수는 에디터 상태를 읽기 전용으로 탐색하며, 트리 구조를 재귀적으로 순회하여
 * 사용자가 정의한 `ImageNode` 클래스의 모든 인스턴스를 수집
 *
 * @param editor - 이미지 노드를 가져올 대상인 LexicalEditor 인스턴스
 * @returns 에디터 문서 내에서 발견된 모든 ImageNode 객체들의 배열
 *
 * @example
 * const imageNodes = getAllImageNodes(editor);
 * imageNodes.forEach((node) => {
 *   console.log(node.getSrc());
 * });
 */
export function forEachImageNodes(
  editor: LexicalEditor,
  callback: (node: ImageNode, index: number) => void,
): void {
  editor.update(() => {
    const root = $getRoot()
    let index = 0

    const traverse = (node: LexicalNode) => {
      if ($isImageNode(node)) {
        callback(node, index++)
      }

      if ($isElementNode(node)) {
        for (const child of node.getChildren()) {
          traverse(child)
        }
      }
    }

    traverse(root)
  })
}

/**
 * 주어진 colorHex가 6자리 hex 코드가 맞는지 여부를 반환
 *
 * @param {string} colorHex - 색상 값
 * @returns {boolean}
 */
export function isHexColor(colorHex: string): boolean {
  const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
  return hexColorRegex.test(colorHex)
}

/**
 * 주어진 색상 값을 TinyColor 객체로 변환
 *
 * @param {ColorInput} color - 변환할 색상 값
 * @returns {TinyColor} 변환된 TinyColor 객체
 */
export function tinycolor(color: ColorInput) {
  return new TinyColor(color)
}

/**
 * 주어진 색상 값을 HSV 포맷으로 변환하고, a 값을 제외한 h, s, v 프로퍼티만 반환
 *
 * @param {string} color - 변환할 색상 값
 * @returns {{ h: number, s: number, v: number }} - h, s, v 프로퍼티를 포함한 객체.
 */
export function getHsvWithoutAlpha(color: ColorInput) {
  const { h, s, v } = tinycolor(color).toHsv()
  return { h, s, v }
}
