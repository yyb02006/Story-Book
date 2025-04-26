import { codeNode } from '#/components/plugins/blockTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import { createFormatCode } from '#/components/plugins/utils'

export default function CodeButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const formatCode = createFormatCode(editor, selectedBlockType)

  return (
    <BaseToolButton
      selectedBlockType={selectedBlockType}
      buttonBlockType={codeNode}
      buttonSize={buttonSize}
      onClick={formatCode}
    />
  )
}
