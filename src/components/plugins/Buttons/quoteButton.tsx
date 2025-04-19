import { quoteNode } from '#/components/plugins/blockTypes'
import { $createQuoteNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'

export default function QuoteButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
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
      buttonSize={buttonSize}
      onClick={() => {
        createQuote()
      }}
    />
  )
}
