import { quoteNode } from '#/components/plugins/blockTypes'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { createFormatQuote } from '#/components/plugins/utils'

export default function QuoteButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const formatQuote = createFormatQuote(editor, selectedBlockType)

  return (
    <BaseToolButton
      selectedBlockType={selectedBlockType}
      buttonBlockType={quoteNode}
      buttonSize={buttonSize}
      onClick={formatQuote}
    />
  )
}
