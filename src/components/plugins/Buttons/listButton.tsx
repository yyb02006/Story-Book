import { listNodes } from '#/components/plugins/blockTypes'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import DropdownButtonList from '#/components/plugins/Buttons/dropdownButtonList'
import { $createParagraphNode, $getSelection } from 'lexical'

type ListNode = (typeof listNodes)[number]

// 관심사 분리 필요
export default function ListButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      $setBlocksType(selection, () => $createParagraphNode())
    })
  }

  const createList = (listNodeType: ListNode) => {
    switch (true) {
      case listNodeType === 'bullet':
        if (selectedBlockType !== 'bullet') {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
          formatParagraph()
        }
        break
      case listNodeType === 'number':
        if (selectedBlockType !== 'number') {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
          formatParagraph()
        }
        break
      case listNodeType === 'check':
        if (selectedBlockType !== 'check') {
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        } else {
          formatParagraph()
        }
        break
      default:
        break
    }
  }

  return (
    <>
      <DropdownButtonList
        List={listNodes}
        buttonSize={buttonSize}
        defaultButtonState="bullet"
        onSelect={createList}
        selectedBlockType={selectedBlockType}
      />
    </>
  )
}
