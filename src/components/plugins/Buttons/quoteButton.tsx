import { quoteNode } from '#/components/plugins/blockTypes'
import { BaseToolButton } from '#/components/plugins/Buttons/baseToolButton'
import { $createQuoteNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'

export default function QuoteButton({ selectedBlockType, editor }: CommonToolButtonProps) {
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
