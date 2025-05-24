import { headingNodes } from '#/lexical/plugins/blockTypes'
import { CommonToolButtonProps } from '#/lexical/components/Buttons/buttonTypes'
import DropdownButtonList from '#/lexical/components/Buttons/dropdownButtonList'
import { createFormatHeading } from '#/lexical/plugins/utils'

export default function HeadingButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const formatHeading = createFormatHeading(editor, selectedBlockType)
  return (
    <>
      <DropdownButtonList
        List={headingNodes}
        buttonSize={buttonSize}
        defaultButtonState="h1"
        onSelect={formatHeading}
        selectedBlockType={selectedBlockType}
      />
    </>
  )
}
