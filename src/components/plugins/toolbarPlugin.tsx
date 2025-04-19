import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isListNode, ListNode } from '@lexical/list'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'
import { $getNearestNodeOfType } from '@lexical/utils'
import { BlockType, SupportedBlockType } from '#/components/plugins/blockTypes'
import { CommonToolButtonProps } from '#/components/plugins/Buttons/buttonTypes'
import { HeadingButton, ListButton, QuoteButton } from '#/components/plugins/Buttons'

export const ToolbarPlugin = () => {
  const [selectedBlockType, setBlockType] = useState<BlockType>('paragraph')
  const [editor] = useLexicalComposerContext()
  const commonToolButtonProps: CommonToolButtonProps = { selectedBlockType, editor }
  const ToolbarButtons = [HeadingButton, QuoteButton, ListButton]

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return
        const anchorNode = selection.anchor.getNode()
        const targetNode =
          anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow()
        if ($isHeadingNode(targetNode)) {
          const tag = targetNode.getTag()
          setBlockType(tag)
        } else if ($isListNode(targetNode)) {
          const parentListNode = $getNearestNodeOfType(anchorNode, ListNode)
          const listType = parentListNode ? parentListNode.getListType() : targetNode.getListType()
          setBlockType(listType)
        } else {
          const nodeType = targetNode.getType()
          if (nodeType in SupportedBlockType) {
            setBlockType(nodeType as BlockType)
          } else {
            setBlockType('paragraph')
          }
        }
      })
    })
  }, [editor])

  return (
    <div className="flex space-x-4">
      {ToolbarButtons.map((Button) => (
        <Button key={Button.name} {...commonToolButtonProps} />
      ))}
    </div>
  )
}
