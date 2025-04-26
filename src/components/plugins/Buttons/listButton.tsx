import { listNodes } from '#/components/plugins/blockTypes'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import DropdownButtonList from '#/components/plugins/Buttons/dropdownButtonList'
import { formatParagraph } from '#/components/plugins/utils'

type ListNode = (typeof listNodes)[number]

export default function ListButton({
  selectedBlockType,
  editor,
  buttonSize,
  themeMode,
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
        themeMode={themeMode}
      />
    </>
  )
}
