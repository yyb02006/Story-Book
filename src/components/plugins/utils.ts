import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { BlockType, HeadingNode } from '#/components/plugins/blockTypes'
import { $createHeadingNode } from '@lexical/rich-text'

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
 * @returns {(headingNodeType: HeadingNode) => void} - 헤딩 노드 타입을 인자로 받아 해당 타입으로 블록을 변환하는 함수
 * @example
 * const formatHeading = createFormatHeading(editor, 'paragraph')
 * formatHeading('h1')
 */
export const createFormatHeading = (editor: LexicalEditor, selectedBlockType: BlockType) => {
  return (headingNodeType: HeadingNode) => {
    if (selectedBlockType === headingNodeType) return
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingNodeType))
      }
    })
  }
}
