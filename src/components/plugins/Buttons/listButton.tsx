import { listNodes } from '#/components/plugins/blockTypes'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import DropdownButtonList from '#/components/plugins/Buttons/dropdownButtonList'

type ListNode = (typeof listNodes)[number]

export default function ListButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const createList = (listNodeType: ListNode) => {
    switch (true) {
      case selectedBlockType !== 'bullet' && listNodeType === 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      case selectedBlockType !== 'number' && listNodeType === 'number':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      case selectedBlockType !== 'check' && listNodeType === 'check':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
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
      ></DropdownButtonList>
    </>
  )
}
