import { listNodes } from '#/lexical/plugins/blockTypes'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { CommonToolButtonProps } from '#/lexical/components/Buttons/buttonTypes'
import DropdownButtonList from '#/lexical/components/Buttons/dropdownButtonList'
import { formatParagraph } from '#/lexical/plugins/utils'

type ListNode = (typeof listNodes)[number]

export default function ListButton({
  selectedBlockType,
  editor,
  buttonSize,
}: CommonToolButtonProps) {
  const createList = (listNodeType: ListNode) => {
    switch (true) {
      case listNodeType === 'bullet':
        if (selectedBlockType !== 'bullet') {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        } else {
          formatParagraph(editor)
        }
        break
      case listNodeType === 'number':
        if (selectedBlockType !== 'number') {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        } else {
          formatParagraph(editor)
        }
        break
      case listNodeType === 'check':
        if (selectedBlockType !== 'check') {
          editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        } else {
          formatParagraph(editor)
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
