import { ToolButton } from '#/components/plugins/toolbarButton'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from '@lexical/rich-text'
import {
  $isListNode,
  ListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list'
import { $setBlocksType } from '@lexical/selection'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useEffect, useState } from 'react'
import { $getNearestNodeOfType } from '@lexical/utils'
import {
  availableNodes,
  BlockType,
  listNodes,
  SupportedBlockType,
} from '#/components/plugins/blockTypes'

export const ToolbarPlugin = () => {
  const [blockType, setBlockType] = useState<BlockType>('paragraph')
  const [editor] = useLexicalComposerContext()

  const createHeading = (type: HeadingTagType) => {
    if (blockType !== type) {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(type))
        }
      })
    }
  }

  const createQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const createList = (currentListNode: (typeof listNodes)[number]) => {
    switch (true) {
      case blockType !== 'bullet' && currentListNode === 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        break
      case blockType !== 'number' && currentListNode === 'number':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        break
      case blockType !== 'check' && currentListNode === 'check':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
        break
      default:
        break
    }
  }

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
    <div>
      {availableNodes.heading.map((heading) => {
        return (
          <ToolButton
            currentBlockType={blockType}
            nodeName={heading}
            callback={() => {
              createHeading(heading)
            }}
            key={heading}
          />
        )
      })}
      <ToolButton
        currentBlockType={blockType}
        nodeName={availableNodes.quote}
        callback={() => {
          createQuote()
        }}
      />
      {availableNodes.list.map((listType) => {
        return (
          <ToolButton
            currentBlockType={blockType}
            nodeName={listType}
            callback={() => {
              createList(listType)
            }}
            key={listType}
          />
        )
      })}
    </div>
  )
}
