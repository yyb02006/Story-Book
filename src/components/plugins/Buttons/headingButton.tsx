import { headingNodes } from '#/components/plugins/blockTypes'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import DropdownButtonList from '#/components/plugins/Buttons/dropdownButtonList'
import { createFormatHeading } from '#/components/plugins/utils'

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
