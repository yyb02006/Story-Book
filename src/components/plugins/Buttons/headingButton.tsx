import { headingNodes } from '#/components/plugins/blockTypes'
import { $createHeadingNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'

type HeadingNode = (typeof headingNodes)[number]

export default function HeadingButton({ selectedBlockType, editor }: CommonToolButtonProps) {
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
    <div>
      {headingNodes.map((headingNode) => (
        <BaseToolButton
          buttonBlockType={headingNode}
          onClick={() => createHeading(headingNode)}
          selectedBlockType={selectedBlockType}
          key={headingNode}
        />
      ))}
    </div>
  )
}
