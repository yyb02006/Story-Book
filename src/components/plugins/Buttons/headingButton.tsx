import { headingNodes } from '#/components/plugins/blockTypes'
import { $createHeadingNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import DropdownButtonList from '#/components/plugins/Buttons/dropdownButtonList'

type HeadingNode = (typeof headingNodes)[number]

export default function HeadingButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const createHeading = (headingNodeType: HeadingNode) => {
    if (selectedBlockType !== headingNodeType) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingNodeType))
        }
      })
    }
  }

  return (
    <>
      <DropdownButtonList
        List={headingNodes}
        buttonSize={buttonSize}
        defaultButtonState="h1"
        onSelect={createHeading}
        selectedBlockType={selectedBlockType}
      />
    </>
  )
}
