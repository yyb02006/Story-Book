import { BlockType, quoteNode } from '#/components/plugins/blockTypes'
import { BaseToolButton } from '#/components/plugins/Buttons/baseToolButton'
import { $createQuoteNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { $setBlocksType } from '@lexical/selection'

interface CustomToolButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
}

export default function QuoteButton({ selectedBlockType, editor }: CustomToolButtonProps) {
  const createQuote = () => {
    if (selectedBlockType !== quoteNode) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  return (
    <BaseToolButton
      selectedBlockType={selectedBlockType}
      buttonBlockType={quoteNode}
      onClick={() => {
        createQuote()
      }}
    />
  )
}
