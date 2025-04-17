import { BlockType, listNodes } from '#/components/plugins/blockTypes'
import { BaseToolButton } from '#/components/plugins/Buttons/baseToolButton'
import { LexicalEditor } from 'lexical'
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'

interface CustomToolButtonProps {
  selectedBlockType: BlockType
  editor: LexicalEditor
}

export default function ListButton({ selectedBlockType, editor }: CustomToolButtonProps) {
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
    <>
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
    </>
  )
}
