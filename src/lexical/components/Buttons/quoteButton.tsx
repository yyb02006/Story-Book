import { quoteNode } from '#/lexical/plugins/blockTypes'
import { CommonToolButtonProps } from '#/lexical/components/Buttons/buttonTypes'
import BaseToolButton from '#/lexical/components/Buttons/baseToolButton'
import { createFormatQuote } from '#/lexical/plugins/utils'

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
