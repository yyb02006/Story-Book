import { listNodes } from '#/components/plugins/blockTypes'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import BaseToolButton from '#/components/plugins/Buttons/baseToolButton'

export default function ListButton({ selectedBlockType, editor }: CommonToolButtonProps) {
  const createList = (listNodeType: (typeof listNodes)[number]) => {
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
    <div>
      {listNodes.map((listNode) => (
        <BaseToolButton
          selectedBlockType={selectedBlockType}
          buttonBlockType={listNode}
          onClick={() => {
            createList(listNode)
          }}
          key={listNode}
        />
      ))}
    </div>
  )
}
