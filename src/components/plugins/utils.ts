import { $createParagraphNode, $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { BlockType, HeadingNode } from '#/components/plugins/blockTypes'
import { $createHeadingNode } from '@lexical/rich-text'

export const formatParagraph = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection()
    $setBlocksType(selection, () => $createParagraphNode())
  })
}

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
