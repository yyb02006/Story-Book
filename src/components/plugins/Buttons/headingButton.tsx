import { BlockType, headingNodes } from '#/components/plugins/blockTypes'
import { BaseToolButton } from '#/components/plugins/Buttons/baseToolButton'
import { $createHeadingNode } from '@lexical/rich-text'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'
import { $setBlocksType } from '@lexical/selection'

interface HeadingButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
}

export default function HeadingButton({ selectedBlockType, editor }: HeadingButtonProps) {
  const createHeading = (headingNodeType: (typeof headingNodes)[number]) => {
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
      {headingNodes.map((headingNode) => (
        <BaseToolButton
          selectedBlockType={selectedBlockType}
          buttonBlockType={headingNode}
          onClick={() => {
            createHeading(headingNode)
          }}
          key={headingNode}
        />
      ))}
    </>
  )
}
