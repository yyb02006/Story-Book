import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isHeadingNode } from '@lexical/rich-text'
import { $isListNode, ListNode } from '@lexical/list'
import { $getSelection, $isRangeSelection } from 'lexical'
import { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { $getNearestNodeOfType } from '@lexical/utils'
import { BlockType, SupportedBlockType } from '#/lexical/plugins/blockTypes'
import { buttonSizes, CommonToolButtonProps } from '#/lexical/components/Buttons/buttonTypes'
import { CodeButton, HeadingButton, ListButton, QuoteButton } from '#/lexical/components/Buttons'

export const ToolbarPlugin = ({
  selectedBlockType,
  setSelectedBlockType,
}: {
  selectedBlockType: BlockType
  setSelectedBlockType: Dispatch<SetStateAction<BlockType>>
}) => {
  const [editor] = useLexicalComposerContext()
  const ToolbarButtons = [HeadingButton, ListButton, QuoteButton, CodeButton]
  const commonToolButtonProps: CommonToolButtonProps = useMemo(
    () => ({
      selectedBlockType,
      editor,
      buttonSize: buttonSizes['md'],
    }),
    [selectedBlockType, editor],
  )

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
          setSelectedBlockType(tag)
        } else if ($isListNode(targetNode)) {
          const parentListNode = $getNearestNodeOfType(anchorNode, ListNode)
          const listType = parentListNode ? parentListNode.getListType() : targetNode.getListType()
          setSelectedBlockType(listType)
        } else {
          const nodeType = targetNode.getType()
          if (nodeType in SupportedBlockType) {
            setSelectedBlockType(nodeType as BlockType)
          } else {
            setSelectedBlockType('paragraph')
          }
        }
      })
    })
  }, [editor, setSelectedBlockType])

  return (
    <div className="flex space-x-3">
      {ToolbarButtons.map((Button) => (
        <div key={Button.name} className="flex items-center">
          <Button {...commonToolButtonProps} />
        </div>
      ))}
    </div>
  )
}
